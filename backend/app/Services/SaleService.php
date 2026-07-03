<?php

namespace App\Services;

use App\Enums\PaymentStatus;
use App\Enums\SaleStatus;
use App\Enums\StockMovementType;
use App\Models\Product;
use App\Models\Sale;
use App\Models\StockMovement;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class SaleService
{
    public function list(Request $request): LengthAwarePaginator
    {
        $query = Sale::with(['customer', 'createdBy', 'items.product'])
            ->where('company_id', $request->user()->company_id);

        if ($search = $request->get('search')) {
            $query->where(function (Builder $q) use ($search): void {
                $q->where('sale_number', 'like', "%{$search}%")
                  ->orWhere('invoice_number', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        if ($request->has('date_from')) {
            $query->whereDate('order_date', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('order_date', '<=', $request->date_to);
        }

        $sortField = $request->get('sort', 'created_at');
        $sortDir = $request->get('direction', 'desc');

        $query->orderBy($sortField, $sortDir);

        return $query->paginate($request->get('per_page', 15));
    }

    public function create(array $data, int $companyId, int $userId): Sale
    {
        return DB::transaction(function () use ($data, $companyId, $userId): Sale {
            $saleNumber = $this->generateSaleNumber($companyId);
            $invoiceNumber = 'INV-' . $saleNumber;

            $items = $data['items'];
            $subtotal = collect($items)->sum(fn ($item) => $item['quantity'] * $item['unit_price']);

            $sale = Sale::create([
                'company_id' => $companyId,
                'customer_id' => $data['customer_id'] ?? null,
                'customer_name' => $data['customer_name'] ?? null,
                'sale_number' => $saleNumber,
                'invoice_number' => $invoiceNumber,
                'status' => SaleStatus::COMPLETED,
                'payment_method' => $data['payment_method'] ?? 'cash',
                'payment_status' => $data['payment_status'] ?? PaymentStatus::PAID,
                'amount_paid' => $data['amount_paid'] ?? $subtotal,
                'order_date' => $data['order_date'],
                'notes' => $data['notes'] ?? null,
                'subtotal' => $subtotal,
                'total' => $subtotal,
                'created_by' => $userId,
            ]);

            foreach ($items as $item) {
                $sub = $item['quantity'] * $item['unit_price'];

                $sale->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $sub,
                ]);

                $product = Product::findOrFail($item['product_id']);
                $stockBefore = $product->stock;

                $product->decrement('stock', $item['quantity']);

                StockMovement::create([
                    'company_id' => $companyId,
                    'product_id' => $item['product_id'],
                    'type' => StockMovementType::OUT,
                    'quantity' => $item['quantity'],
                    'stock_before' => $stockBefore,
                    'stock_after' => $product->fresh()->stock,
                    'reference_type' => Sale::class,
                    'reference_id' => $sale->id,
                    'reason' => 'Sale #' . $saleNumber,
                    'created_by' => $userId,
                ]);
            }

            return $sale->fresh()->load(['customer', 'items.product', 'createdBy']);
        });
    }

    public function show(Sale $sale): Sale
    {
        return $sale->load(['customer', 'items.product', 'createdBy']);
    }

    public function delete(Sale $sale): void
    {
        DB::transaction(function () use ($sale): void {
            foreach ($sale->items as $item) {
                $product = Product::find($item->product_id);
                if ($product) {
                    $stockBefore = $product->stock;

                    $product->increment('stock', $item->quantity);

                    StockMovement::create([
                        'company_id' => $sale->company_id,
                        'product_id' => $item->product_id,
                        'type' => StockMovementType::IN,
                        'quantity' => $item->quantity,
                        'stock_before' => $stockBefore,
                        'stock_after' => $product->fresh()->stock,
                        'reference_type' => Sale::class,
                        'reference_id' => $sale->id,
                        'reason' => 'Sale deleted #' . $sale->sale_number,
                        'created_by' => request()->user()?->id,
                    ]);
                }
            }

            $sale->delete();
        });
    }

    private function generateSaleNumber(int $companyId): string
    {
        $prefix = 'SLS-' . now()->format('Ymd');
        $last = Sale::withTrashed()
            ->where('company_id', $companyId)
            ->where('sale_number', 'like', "{$prefix}-%")
            ->orderBy('id', 'desc')
            ->value('sale_number');

        $seq = $last ? (int) substr($last, -4) + 1 : 1;

        return "{$prefix}-" . str_pad((string) $seq, 4, '0', STR_PAD_LEFT);
    }
}

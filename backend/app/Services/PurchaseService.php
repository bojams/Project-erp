<?php

namespace App\Services;

use App\Enums\PurchaseStatus;
use App\Enums\StockMovementType;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\StockMovement;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class PurchaseService
{
    public function list(Request $request): LengthAwarePaginator
    {
        $query = Purchase::with(['supplier', 'createdBy', 'items.product'])
            ->where('company_id', $request->user()->company_id);

        if ($search = $request->get('search')) {
            $query->where(function (Builder $q) use ($search): void {
                $q->where('purchase_number', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
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

    public function create(array $data, int $companyId, int $userId): Purchase
    {
        return DB::transaction(function () use ($data, $companyId, $userId): Purchase {
            $purchaseNumber = $this->generatePurchaseNumber($companyId);

            $items = $data['items'];
            $subtotal = collect($items)->sum(fn ($item) => $item['quantity'] * $item['unit_price']);

            $purchase = Purchase::create([
                'company_id' => $companyId,
                'supplier_id' => $data['supplier_id'] ?? null,
                'supplier_name' => $data['supplier_name'] ?? null,
                'purchase_number' => $purchaseNumber,
                'status' => PurchaseStatus::RECEIVED,
                'order_date' => $data['order_date'],
                'received_date' => now(),
                'notes' => $data['notes'] ?? null,
                'subtotal' => $subtotal,
                'total' => $subtotal,
                'created_by' => $userId,
            ]);

            foreach ($items as $item) {
                $sub = $item['quantity'] * $item['unit_price'];

                $purchase->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'received_quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $sub,
                ]);

                $product = Product::findOrFail($item['product_id']);
                $stockBefore = $product->stock;

                $product->increment('stock', $item['quantity']);

                StockMovement::create([
                    'company_id' => $companyId,
                    'product_id' => $item['product_id'],
                    'type' => StockMovementType::IN,
                    'quantity' => $item['quantity'],
                    'stock_before' => $stockBefore,
                    'stock_after' => $product->fresh()->stock,
                    'reference_type' => Purchase::class,
                    'reference_id' => $purchase->id,
                    'reason' => 'Purchase #' . $purchaseNumber,
                    'created_by' => $userId,
                ]);
            }

            return $purchase->fresh()->load(['supplier', 'items.product', 'createdBy']);
        });
    }

    public function show(Purchase $purchase): Purchase
    {
        return $purchase->load(['supplier', 'items.product', 'createdBy']);
    }

    public function delete(Purchase $purchase): void
    {
        DB::transaction(function () use ($purchase): void {
            foreach ($purchase->items as $item) {
                $product = Product::find($item->product_id);
                if ($product) {
                    $stockBefore = $product->stock;

                    $product->decrement('stock', $item->quantity);

                    StockMovement::create([
                        'company_id' => $purchase->company_id,
                        'product_id' => $item->product_id,
                        'type' => StockMovementType::OUT,
                        'quantity' => $item->quantity,
                        'stock_before' => $stockBefore,
                        'stock_after' => $product->fresh()->stock,
                        'reference_type' => Purchase::class,
                        'reference_id' => $purchase->id,
                        'reason' => 'Purchase deleted #' . $purchase->purchase_number,
                        'created_by' => request()->user()?->id,
                    ]);
                }
            }

            $purchase->delete();
        });
    }

    private function generatePurchaseNumber(int $companyId): string
    {
        $prefix = 'PRC-' . now()->format('Ymd');
        $last = Purchase::withTrashed()
            ->where('company_id', $companyId)
            ->where('purchase_number', 'like', "{$prefix}-%")
            ->orderBy('id', 'desc')
            ->value('purchase_number');

        $seq = $last ? (int) substr($last, -4) + 1 : 1;

        return "{$prefix}-" . str_pad((string) $seq, 4, '0', STR_PAD_LEFT);
    }
}

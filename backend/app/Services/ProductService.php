<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    public function list(Request $request): LengthAwarePaginator
    {
        $query = Product::with(['category', 'unit'])
            ->where('company_id', $request->user()->company_id);

        if ($search = $request->get('search')) {
            $query->where(function (Builder $q) use ($search): void {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
                  ->orWhere('barcode', 'like', "%{$search}%");
            });
        }

        if ($request->boolean('low_stock')) {
            $query->lowStock();
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $sortField = $request->get('sort', 'created_at');
        $sortDir = $request->get('direction', 'desc');

        $query->orderBy($sortField, $sortDir);

        return $query->paginate($request->get('per_page', 15));
    }

    public function create(array $data, int $companyId, int $userId): Product
    {
        $data['company_id'] = $companyId;
        $data['created_by'] = $userId;
        $data['updated_by'] = $userId;

        if (!isset($data['stock'])) {
            $data['stock'] = 0;
        }

        if (!empty($data['image']) && is_object($data['image'])) {
            $data['image'] = $data['image']->store('products', 'public');
        }

        return Product::create($data);
    }

    public function update(Product $product, array $data): Product
    {
        if (isset($data['remove_image']) && $data['remove_image']) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = null;
        } elseif (!empty($data['image']) && is_object($data['image'])) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $data['image']->store('products', 'public');
        }

        unset($data['remove_image']);
        $product->update($data);

        return $product->fresh()->load(['category', 'unit']);
    }

    public function delete(Product $product): void
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        $product->delete();
    }

    public function show(Product $product): Product
    {
        return $product->load(['category', 'unit']);
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'sku' => $this->sku,
            'barcode' => $this->barcode,
            'description' => $this->description,
            'purchase_price' => (float) $this->purchase_price,
            'selling_price' => (float) $this->selling_price,
            'stock' => $this->stock,
            'stock_minimum' => $this->stock_minimum,
            'image' => $this->image ? url('storage/' . $this->image) : null,
            'image_thumb' => $this->image ? url('storage/' . $this->image) : null,
            'is_active' => $this->is_active,
            'is_low_stock' => $this->is_low_stock,
            'stock_value' => $this->stock_value,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'unit' => new UnitResource($this->whenLoaded('unit')),
        ];
    }
}

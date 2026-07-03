<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'purchase_number' => $this->purchase_number,
            'status' => $this->status,
            'order_date' => $this->order_date,
            'received_date' => $this->received_date,
            'notes' => $this->notes,
            'subtotal' => (float) $this->subtotal,
            'total' => (float) $this->total,
            'supplier_name' => $this->supplier_name,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'supplier' => new SupplierResource($this->whenLoaded('supplier')),
            'items' => PurchaseItemResource::collection($this->whenLoaded('items')),
            'created_by' => $this->whenLoaded('createdBy', fn () => [
                'id' => $this->createdBy->id,
                'name' => $this->createdBy->name,
            ]),
        ];
    }
}

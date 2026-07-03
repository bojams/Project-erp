<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Purchase\StorePurchaseRequest;
use App\Http\Resources\PurchaseResource;
use App\Models\Purchase;
use App\Services\PurchaseService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PurchaseController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        private readonly PurchaseService $purchaseService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $purchases = $this->purchaseService->list($request);

        return $this->successResponse([
            'items' => PurchaseResource::collection($purchases),
            'pagination' => [
                'current_page' => $purchases->currentPage(),
                'last_page' => $purchases->lastPage(),
                'per_page' => $purchases->perPage(),
                'total' => $purchases->total(),
            ],
        ]);
    }

    public function store(StorePurchaseRequest $request): JsonResponse
    {
        $purchase = $this->purchaseService->create(
            $request->validated(),
            $request->user()->company_id,
            $request->user()->id
        );

        return $this->successResponse(
            new PurchaseResource($purchase),
            'Pembelian berhasil dibuat',
            201
        );
    }

    public function show(Purchase $purchase): JsonResponse
    {
        return $this->successResponse(
            new PurchaseResource($this->purchaseService->show($purchase))
        );
    }

    public function destroy(Purchase $purchase): JsonResponse
    {
        $this->purchaseService->delete($purchase);

        return $this->successResponse(null, 'Pembelian berhasil dihapus');
    }
}

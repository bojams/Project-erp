<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Sale\StoreSaleRequest;
use App\Http\Resources\SaleResource;
use App\Models\Sale;
use App\Services\SaleService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SaleController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        private readonly SaleService $saleService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $sales = $this->saleService->list($request);

        return $this->successResponse([
            'items' => SaleResource::collection($sales),
            'pagination' => [
                'current_page' => $sales->currentPage(),
                'last_page' => $sales->lastPage(),
                'per_page' => $sales->perPage(),
                'total' => $sales->total(),
            ],
        ]);
    }

    public function store(StoreSaleRequest $request): JsonResponse
    {
        $sale = $this->saleService->create(
            $request->validated(),
            $request->user()->company_id,
            $request->user()->id
        );

        return $this->successResponse(
            new SaleResource($sale),
            'Transaksi penjualan berhasil dibuat',
            201
        );
    }

    public function show(Sale $sale): JsonResponse
    {
        return $this->successResponse(
            new SaleResource($this->saleService->show($sale))
        );
    }

    public function destroy(Sale $sale): JsonResponse
    {
        $this->saleService->delete($sale);

        return $this->successResponse(null, 'Transaksi penjualan berhasil dihapus');
    }
}

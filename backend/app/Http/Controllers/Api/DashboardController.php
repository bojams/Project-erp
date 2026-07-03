<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        private readonly DashboardService $dashboardService
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $companyId = $request->user()->company_id;
        $year = $request->query('year');

        return $this->successResponse([
            'stats' => $this->dashboardService->stats($companyId),
            'monthly_chart' => $this->dashboardService->monthlyChart($companyId, $year ? (int) $year : null),
            'recent_transactions' => $this->dashboardService->recentTransactions($companyId),
            'low_stock_products' => $this->dashboardService->lowStockProducts($companyId),
        ]);
    }
}

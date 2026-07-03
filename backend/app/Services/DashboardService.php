<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Purchase;
use App\Models\Sale;
use Carbon\Carbon;

class DashboardService
{
    public function stats(int $companyId): array
    {
        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();

        $totalProducts = Product::where('company_id', $companyId)->count();

        $todaySales = Sale::where('company_id', $companyId)
            ->whereDate('order_date', $today)
            ->count();

        $todaySalesTotal = (float) Sale::where('company_id', $companyId)
            ->whereDate('order_date', $today)
            ->sum('total');

        $thisMonthRevenue = (float) Sale::where('company_id', $companyId)
            ->whereDate('order_date', '>=', $startOfMonth)
            ->sum('total');

        $lowStockCount = Product::where('company_id', $companyId)
            ->lowStock()
            ->count();

        $newProductsCount = Product::where('company_id', $companyId)
            ->whereDate('created_at', '>=', $startOfMonth)
            ->count();

        return [
            'total_products' => $totalProducts,
            'today_sales' => $todaySales,
            'today_sales_total' => $todaySalesTotal,
            'this_month_revenue' => $thisMonthRevenue,
            'low_stock_count' => $lowStockCount,
            'new_products_count' => $newProductsCount,
        ];
    }

    public function recentTransactions(int $companyId, int $limit = 5): array
    {
        return Sale::where('company_id', $companyId)
            ->with(['customer:id,name', 'createdBy:id,name'])
            ->latest()
            ->limit($limit)
            ->get()
            ->toArray();
    }

    public function lowStockProducts(int $companyId, int $limit = 5): array
    {
        return Product::where('company_id', $companyId)
            ->with(['unit:id,name,short_code'])
            ->lowStock()
            ->orderBy('stock')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    public function monthlyChart(int $companyId, ?int $year = null): array
    {
        $months = [];
        $targetYear = $year ?? Carbon::now()->year;

        for ($m = 1; $m <= 12; $m++) {
            $date = Carbon::create($targetYear, $m, 1);

            $revenue = (float) Sale::where('company_id', $companyId)
                ->whereYear('order_date', $targetYear)
                ->whereMonth('order_date', $m)
                ->sum('total');

            $expenses = (float) Purchase::where('company_id', $companyId)
                ->whereYear('order_date', $targetYear)
                ->whereMonth('order_date', $m)
                ->sum('total');

            $months[] = [
                'month' => $date->format('M'),
                'revenue' => $revenue,
                'expenses' => $expenses,
            ];
        }

        return $months;
    }
}

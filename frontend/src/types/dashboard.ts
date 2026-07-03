export interface DashboardStats {
  total_products: number
  today_sales: number
  today_sales_total: number
  this_month_revenue: number
  low_stock_count: number
  new_products_count: number
}

export interface MonthlyChartPoint {
  month: string
  revenue: number
  expenses: number
}

export interface RecentTransaction {
  id: number
  sale_number: string
  total: number
  status: string
  order_date: string
  customer?: { id: number; name: string } | null
  created_by?: { id: number; name: string } | null
}

export interface LowStockProduct {
  id: number
  name: string
  sku: string
  stock: number
  stock_minimum: number
  unit?: { id: number; name: string; short_code: string } | null
}

export interface DashboardData {
  stats: DashboardStats
  monthly_chart: MonthlyChartPoint[]
  recent_transactions: RecentTransaction[]
  low_stock_products: LowStockProduct[]
}

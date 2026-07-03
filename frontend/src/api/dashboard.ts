import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/auth'
import type { DashboardData } from '@/types/dashboard'

export const dashboardApi = {
  async get(year?: number) {
    const params: Record<string, string> = {}
    if (year) params.year = String(year)
    const res = await apiClient.get<ApiResponse<DashboardData>>('/dashboard', { params })
    return res.data.data
  },
}

import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/auth'
import type { Sale, SaleListData } from '@/types/sale'

export const saleApi = {
  async list(params?: Record<string, string | number | boolean | undefined>) {
    const res = await apiClient.get<ApiResponse<SaleListData>>('/sales', { params })
    return res.data.data
  },
  async get(id: number) {
    const res = await apiClient.get<ApiResponse<Sale>>(`/sales/${id}`)
    return res.data.data
  },
  async create(data: Record<string, unknown>) {
    const res = await apiClient.post<ApiResponse<Sale>>('/sales', data)
    return res.data.data
  },
  async delete(id: number) {
    await apiClient.delete<ApiResponse<null>>(`/sales/${id}`)
  },
}

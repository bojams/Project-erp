import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/auth'
import type { Purchase, PurchaseListData } from '@/types/purchase'

export const purchaseApi = {
  async list(params?: Record<string, string | number | boolean | undefined>) {
    const res = await apiClient.get<ApiResponse<PurchaseListData>>('/purchases', { params })
    return res.data.data
  },
  async get(id: number) {
    const res = await apiClient.get<ApiResponse<Purchase>>(`/purchases/${id}`)
    return res.data.data
  },
  async create(data: Record<string, unknown>) {
    const res = await apiClient.post<ApiResponse<Purchase>>('/purchases', data)
    return res.data.data
  },
  async delete(id: number) {
    await apiClient.delete<ApiResponse<null>>(`/purchases/${id}`)
  },
}

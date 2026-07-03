import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/auth'
import type { Supplier } from '@/types/supplier'

export const supplierApi = {
  async list() {
    const res = await apiClient.get<ApiResponse<Supplier[]>>('/suppliers/list')
    return res.data.data
  },
}

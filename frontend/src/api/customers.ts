import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/auth'
import type { Customer } from '@/types/customer'

export const customerApi = {
  async list() {
    const res = await apiClient.get<ApiResponse<Customer[]>>('/customers/list')
    return res.data.data
  },
}

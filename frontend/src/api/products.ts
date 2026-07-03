import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/auth'
import type { Product, Category, Unit, PaginationMeta } from '@/types/product'

interface ProductListData {
  items: Product[]
  pagination: PaginationMeta
}

function hasFile(data: Record<string, unknown>): boolean {
  return Object.values(data).some((v) => v instanceof File)
}

function toFormData(data: Record<string, unknown>): FormData {
  const fd = new FormData()
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue
    if (value instanceof File) {
      fd.append(key, value)
    } else if (typeof value === 'boolean') {
      fd.append(key, value ? '1' : '0')
    } else if (typeof value === 'number') {
      fd.append(key, String(value))
    } else {
      fd.append(key, String(value))
    }
  }
  return fd
}

function cleanData(data: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue
    if (value instanceof File) continue
    cleaned[key] = value
  }
  return cleaned
}

export const productApi = {
  async list(params?: Record<string, string | number | boolean | undefined>) {
    const res = await apiClient.get<ApiResponse<ProductListData>>('/products', { params })
    return res.data.data
  },
  async get(id: number) {
    const res = await apiClient.get<ApiResponse<Product>>(`/products/${id}`)
    return res.data.data
  },
  async create(data: Record<string, unknown>) {
    if (hasFile(data)) {
      const res = await apiClient.post<ApiResponse<Product>>('/products', toFormData(data))
      return res.data.data
    }
    const res = await apiClient.post<ApiResponse<Product>>('/products', data)
    return res.data.data
  },
  async update(id: number, data: Record<string, unknown>) {
    if (hasFile(data)) {
      const fd = toFormData(data)
      fd.append('_method', 'PUT')
      const res = await apiClient.post<ApiResponse<Product>>(`/products/${id}`, fd)
      return res.data.data
    }
    const res = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, cleanData(data))
    return res.data.data
  },
  async delete(id: number) {
    await apiClient.delete<ApiResponse<null>>(`/products/${id}`)
  },
  async categories() {
    const res = await apiClient.get<ApiResponse<Category[]>>('/categories/list')
    return res.data.data
  },
  async units() {
    const res = await apiClient.get<ApiResponse<Unit[]>>('/units/list')
    return res.data.data
  },
}

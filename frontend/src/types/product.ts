export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  is_active: boolean
}

export interface Unit {
  id: number
  name: string
  short_code: string
  is_active: boolean
}

export interface Product {
  id: number
  name: string
  sku: string
  barcode?: string
  description?: string
  purchase_price: number
  selling_price: number
  stock: number
  stock_minimum: number
  image?: string | null
  image_thumb?: string | null
  is_active: boolean
  is_low_stock: boolean
  stock_value: number
  created_at: string
  updated_at: string
  category?: Category
  unit?: Unit
}

export interface ProductFormData {
  name: string
  sku: string
  barcode?: string
  description?: string
  category_id?: number | null
  unit_id: number
  purchase_price: number
  selling_price: number
  stock_minimum: number
  is_active: boolean
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

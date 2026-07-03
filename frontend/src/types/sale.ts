import type { Customer } from './customer'
import type { Product } from './product'
import type { PaginationMeta } from './product'

export interface SaleItem {
  id: number
  product_id: number
  quantity: number
  unit_price: number
  subtotal: number
  product?: Product
}

export interface Sale {
  id: number
  sale_number: string
  invoice_number: string
  status: 'pending' | 'completed' | 'cancelled'
  payment_status: 'unpaid' | 'partial' | 'paid'
  payment_method: 'cash' | 'qris' | string
  amount_paid: number
  order_date: string
  notes: string | null
  subtotal: number
  total: number
  created_at: string
  updated_at: string
  customer_name: string | null
  customer?: Customer | null
  items?: SaleItem[]
  created_by?: { id: number; name: string } | null
}

export interface SaleFormData {
  customer_id: number | null
  customer_name?: string | null
  order_date: string
  notes: string
  payment_status: string
  payment_method?: string
  amount_paid: number
  items: SaleItemInput[]
}

export interface SaleItemInput {
  product_id: number
  quantity: number
  unit_price: number
}

export interface SaleListData {
  items: Sale[]
  pagination: PaginationMeta
}

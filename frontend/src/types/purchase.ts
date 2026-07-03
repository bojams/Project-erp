import type { Supplier } from './supplier'
import type { Product } from './product'
import type { PaginationMeta } from './product'

export interface PurchaseItem {
  id: number
  product_id: number
  quantity: number
  received_quantity: number
  unit_price: number
  subtotal: number
  product?: Product
}

export interface Purchase {
  id: number
  purchase_number: string
  status: 'pending' | 'approved' | 'received' | 'cancelled'
  order_date: string
  received_date: string | null
  notes: string | null
  subtotal: number
  total: number
  supplier_name: string | null
  created_at: string
  updated_at: string
  supplier?: Supplier | null
  items?: PurchaseItem[]
  created_by?: { id: number; name: string } | null
}

export interface PurchaseFormData {
  supplier_id: number | null
  supplier_name: string | null
  order_date: string
  notes: string
  items: PurchaseItemInput[]
}

export interface PurchaseItemInput {
  product_id: number
  quantity: number
  unit_price: number
}

export interface PurchaseListData {
  items: Purchase[]
  pagination: PaginationMeta
}

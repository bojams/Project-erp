export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  avatar: string | null
  is_active: boolean
  last_login_at: string | null
  created_at: string
  updated_at: string
  company: Company | null
  roles: string[]
  permissions: string[]
}

export interface Company {
  id: number
  name: string
  address: string | null
  phone: string | null
  email: string | null
  logo: string | null
  currency: string
  timezone: string
  date_format: string
  low_stock_threshold: number
  is_active: boolean
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface AuthResponse {
  user: User
  token: string
}

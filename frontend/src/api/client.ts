import type { ApiResponse, AuthResponse } from '@/types/auth'
import axios from 'axios'

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Accept': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('auth-storage')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export const authApi = {
  login(email: string, password: string) {
    return apiClient.post<ApiResponse<AuthResponse>>('/auth/login', { email, password })
  },
  logout() {
    return apiClient.post<ApiResponse<null>>('/auth/logout')
  },
  me() {
    return apiClient.get<ApiResponse<AuthResponse['user']>>('/auth/me')
  },
  forgotPassword(email: string) {
    return apiClient.post<ApiResponse<null>>('/auth/forgot-password', { email })
  },
  resetPassword(token: string, email: string, password: string, password_confirmation: string) {
    return apiClient.post<ApiResponse<null>>('/auth/reset-password', {
      token,
      email,
      password,
      password_confirmation,
    })
  },
}

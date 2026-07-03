import { authApi } from '@/api/client'
import type { User } from '@/types/auth'
import { create } from 'zustand'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
  fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  token: localStorage.getItem('auth-token'),
  isLoading: true,
  isAuthenticated: false,

  setAuth: (user, token) => {
    localStorage.setItem('auth-token', token)
    set({ user, token, isAuthenticated: true, isLoading: false })
  },

  logout: () => {
    const token = get().token
    if (token) {
      authApi.logout().catch(() => {})
    }
    localStorage.removeItem('auth-token')
    set({ user: null, token: null, isAuthenticated: false, isLoading: false })
  },

  fetchUser: async () => {
    const token = get().token
    if (!token) {
      set({ isLoading: false, isAuthenticated: false })
      return
    }
    try {
      const response = await authApi.me()
      set({ user: response.data.data, isAuthenticated: true, isLoading: false })
    } catch {
      localStorage.removeItem('auth-token')
      set({ user: null, token: null, isAuthenticated: false, isLoading: false })
    }
  },
}))

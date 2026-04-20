import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient, setToken, ApiError } from '@/api/client'
import { mapUser } from '@/api/mappers'
import type { User } from '@/types/models'

/**
 * Login request shape · 對應 EBMECAPI 的 LoginRequest schema。
 * 本地定義避免依賴 auto-generated `src/types/api.ts`（該檔可能被 gitignore）。
 */
interface LoginRequest {
  UserID: string
  Password: string
}

/**
 * Auth Store
 *
 * 對接 EBMECAPI `/api/auth/*`。開發時 vite-plugin-mock 會攔截請求。
 * 測試階段 App.vue 啟動時會呼叫 fetchMe()，mock handler 會回假 user，
 * 因此無需實際登入即可測試其它頁面。
 */
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)

  const isLoggedIn = computed(() => user.value !== null)

  async function fetchMe(): Promise<User | null> {
    try {
      const raw = await apiClient.post<Record<string, unknown>>('/api/auth/me')
      user.value = mapUser(raw)
      return user.value
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        user.value = null
      }
      return null
    }
  }

  async function login(userId: string, password: string): Promise<void> {
    loading.value = true
    try {
      const body: LoginRequest = { UserID: userId, Password: password }
      const raw = await apiClient.post<{ Token?: string } & Record<string, unknown>>(
        '/api/auth/login',
        body,
      )
      if (raw?.Token) setToken(raw.Token)
      await fetchMe()
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout')
    } finally {
      setToken(null)
      user.value = null
    }
  }

  async function checkLoginStatus(): Promise<boolean> {
    try {
      const raw = await apiClient.post<{ LoggedIn?: boolean }>(
        '/api/auth/checkLoginStatus',
      )
      return Boolean(raw?.LoggedIn)
    } catch {
      return false
    }
  }

  return { user, loading, isLoggedIn, fetchMe, login, logout, checkLoginStatus }
})

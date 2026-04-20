import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient, setToken } from '@/api/client'
import { mapUser } from '@/api/mappers'
import type { User } from '@/types/models'

/**
 * Login request shape · 對應 EBMECAPI 的 LoginRequest schema。
 * 本地定義以避免與自動產生的 `@/types/schemas` 衝突。
 */
interface LoginRequest {
  UserID: string
  Password: string
}

/**
 * Auth Store · 對接 EBMECAPI `/api/auth/*`
 *
 * - user === null 代表未登入
 * - login() 真的打 /api/auth/login 拿 Token 存 localStorage
 * - 後續 request 靠 axios interceptor 自動帶 Bearer header
 * - 401 時 user 歸 null，由 router guard 導到 /login
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
    } catch {
      user.value = null
      return null
    }
  }

  async function login(userId: string, password: string): Promise<void> {
    loading.value = true
    try {
      const body: LoginRequest = { UserID: userId, Password: password }
      const raw = await apiClient.post<Record<string, unknown>>(
        '/api/auth/login',
        body,
      )

      // 從回應尋找 token。
      const token =
        (raw?.Token as string | undefined) ??
        (raw?.token as string | undefined) ??
        (raw?.AccessToken as string | undefined) ??
        (raw?.accessToken as string | undefined) ??
        null

      if (token) {
        setToken(token)
      }

      // 無論 token 是否在 body 中，都呼叫 /me 驗證
      await fetchMe()
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout')
    } catch {
      /* ignore — 即使後端呼叫失敗也要清本地狀態 */
    }
    setToken(null)
    user.value = null
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
// Build Force Sync: Tue Apr 21 05:08:02 CST 2026

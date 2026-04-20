import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockUser } from '@/mocks/user'
import type { User } from '@/types/models'

/**
 * Auth Store
 *
 * 測試階段：使用 mock user 預設為已登入狀態，不打後端 API。
 * API 就緒後，請把 login / logout 改為實際呼叫 `/api/auth/*`。
 */
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>({ ...mockUser })
  const loading = ref(false)

  const isLoggedIn = computed(() => user.value !== null)

  async function login(userId: string, _password: string) {
    user.value = { ...mockUser, userId: userId || mockUser.userId }
  }

  async function logout() {
    user.value = null
  }

  return { user, loading, isLoggedIn, login, logout }
})

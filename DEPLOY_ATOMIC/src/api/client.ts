/**
 * EBMECAPI HTTP client
 *
 * 統一的 axios 實例 + request / response interceptor：
 *   - baseURL 讀 VITE_API_BASE_URL（預設 /ECAPI）
 *   - request 自動帶 Bearer JWT（從 localStorage 讀）
 *   - response 401 自動清 token 並重導 /login
 *   - 統一錯誤型別 ApiError
 *
 * Dev mode 下，vite-plugin-mock 會攔截 /ECAPI/api/* 並回傳 mock data；
 * Prod build 走真後端（webris.ebmtech.com/ECAPI 或 vite proxy target）。
 */

import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios'

const TOKEN_KEY = 'ebm_token'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null): void {
  if (typeof window === 'undefined') return
  if (token) window.localStorage.setItem(TOKEN_KEY, token)
  else window.localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public data: unknown,
    message?: string,
  ) {
    super(message ?? `API error ${status}`)
    this.name = 'ApiError'
  }
}

const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/ECAPI',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
  // 同時支援 Bearer JWT（header）與 Cookie-based auth。
  // 若後端用 Set-Cookie 回 session，withCredentials: true 會讓瀏覽器自動帶 Cookie 回去。
  withCredentials: true,
})

// Request interceptor — 自動帶 Bearer JWT
http.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — 統一錯誤
//
// 401 時僅清 token（不主動跳轉）。跳轉邏輯讓呼叫端 / router guard 決定，
// 避免 login 路由尚未建立前的 redirect loop。
http.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    const status = err.response?.status ?? 0
    const data = err.response?.data

    if (status === 401 && typeof window !== 'undefined') {
      setToken(null)
    }

    return Promise.reject(new ApiError(status, data, err.message))
  },
)

/**
 * EBMECAPI 全部是 POST，統一用 post(path, body)。
 */
export const apiClient = {
  async post<TResponse = unknown, TRequest = unknown>(
    path: string,
    body?: TRequest,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    const res = await http.post<TResponse>(path, body ?? {}, config)
    return res.data
  },

  raw: http,
}

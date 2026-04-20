/**
 * EBMECAPI HTTP client
 *
 * 目前前端使用 `src/mocks/*` 與 Pinia stores 提供假資料，尚未接 API。
 * 待後端 API 穩定後，將各 store 的 fetch 實作改為呼叫此 client。
 *
 * 認證方式：Bearer JWT（Authorization header）。
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/ECAPI'
const TOKEN_KEY = 'ebm_token'

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
    message?: string,
  ) {
    super(message ?? `API error ${status}`)
    this.name = 'ApiError'
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null) {
  if (typeof window === 'undefined') return
  if (token) window.localStorage.setItem(TOKEN_KEY, token)
  else window.localStorage.removeItem(TOKEN_KEY)
}

async function request<TResponse = unknown>(
  path: string,
  body: unknown = {},
): Promise<TResponse> {
  const token = getToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })

  const text = await res.text()
  const data = text ? (JSON.parse(text) as TResponse) : (null as TResponse)

  if (!res.ok) {
    throw new ApiError(res.status, data, `${path} failed (${res.status})`)
  }
  return data
}

export const apiClient = {
  post: request,
}

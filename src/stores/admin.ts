/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiClient } from '@/api/client'
import type { AdminUser, Registration } from '@/mocks/admin'

function mapAdminUser(raw: any): AdminUser {
  return {
    userId: raw?.UserID ?? '',
    displayName: raw?.DisplayName ?? '',
    email: raw?.Email ?? '',
    phone: raw?.Phone ?? '',
    prepaidBalance: Number(raw?.Prepaid ?? 0),
    language: raw?.Language === 'en-US' ? 'en-US' : 'zh-TW',
    isAdmin: Boolean(raw?.IsAdmin),
    createdAt: raw?.CreatedAt ?? '',
    lastLoginAt: raw?.LastLoginAt ?? null,
    status: raw?.Status ?? 'active',
  }
}

function mapRegistration(raw: any): Registration {
  return {
    id: Number(raw?.Id ?? 0),
    userId: raw?.UserID ?? '',
    displayName: raw?.DisplayName ?? '',
    email: raw?.Email ?? '',
    phone: raw?.Phone ?? '',
    company: raw?.Company ?? '',
    appliedAt: raw?.AppliedAt ?? '',
    status: raw?.Status ?? 'pending',
    note: raw?.Note ?? undefined,
  }
}

export const useAdminStore = defineStore('admin', () => {
  const users = ref<AdminUser[]>([])
  const registrations = ref<Registration[]>([])

  async function fetchUsers() {
    const raw = await apiClient.post<{ Items?: unknown[] }>('/api/users/list')
    users.value = (raw?.Items ?? []).map(mapAdminUser)
    return users.value
  }

  async function fetchRegistrations() {
    const raw = await apiClient.post<{ Items?: unknown[] }>(
      '/api/admin/register/list',
    )
    registrations.value = (raw?.Items ?? []).map(mapRegistration)
    return registrations.value
  }

  function toggleUserStatus(userId: string) {
    const u = users.value.find((x) => x.userId === userId)
    if (u) u.status = u.status === 'active' ? 'disabled' : 'active'
  }

  async function acceptRegistration(id: number) {
    await apiClient.post('/api/admin/register/accept', { Id: id })
    const r = registrations.value.find((x) => x.id === id)
    if (r) r.status = 'accepted'
  }

  async function ignoreRegistration(id: number) {
    await apiClient.post('/api/admin/register/ignore', { Id: id })
    const r = registrations.value.find((x) => x.id === id)
    if (r) r.status = 'ignored'
  }

  return {
    users,
    registrations,
    fetchUsers,
    fetchRegistrations,
    toggleUserStatus,
    acceptRegistration,
    ignoreRegistration,
  }
})

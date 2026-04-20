import { defineStore } from 'pinia'
import { ref } from 'vue'
import { adminUsers as seedUsers, registrations as seedRegs, type AdminUser, type Registration } from '@/mocks/admin'

export const useAdminStore = defineStore('admin', () => {
  const users = ref<AdminUser[]>(seedUsers)
  const registrations = ref<Registration[]>(seedRegs)

  async function fetchUsers() {
    await new Promise((r) => setTimeout(r, 200))
    return users.value
  }
  async function fetchRegistrations() {
    await new Promise((r) => setTimeout(r, 200))
    return registrations.value
  }
  function toggleUserStatus(userId: string) {
    const u = users.value.find((x) => x.userId === userId)
    if (u) u.status = u.status === 'active' ? 'disabled' : 'active'
  }
  function acceptRegistration(id: number) {
    const r = registrations.value.find((x) => x.id === id)
    if (r) r.status = 'accepted'
  }
  function ignoreRegistration(id: number) {
    const r = registrations.value.find((x) => x.id === id)
    if (r) r.status = 'ignored'
  }

  return { users, registrations, fetchUsers, fetchRegistrations, toggleUserStatus, acceptRegistration, ignoreRegistration }
})

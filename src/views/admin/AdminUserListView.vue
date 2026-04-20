<script setup lang="ts">
import { onMounted } from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { useAdminStore } from '@/stores/admin'
import EbmCard from '@/components/ui/EbmCard.vue'
import EbmBadge from '@/components/ui/EbmBadge.vue'
import EbmButton from '@/components/ui/EbmButton.vue'

const adminStore = useAdminStore()
onMounted(() => {
  adminStore.fetchUsers()
  adminStore.fetchRegistrations()
})

const statusVariant = { active: 'success', disabled: 'error', pending: 'warning' } as const
const statusLabel = { active: '使用中', disabled: '已停用', pending: '待審核' } as const

const fmt = (n: number) => 'NT$ ' + n.toLocaleString()
</script>

<template>
  <AdminLayout :breadcrumb="['使用者管理']">
    <h1 class="text-3xl font-extrabold text-ebm-primary tracking-tight mb-6">使用者管理</h1>

    <!-- Users -->
    <EbmCard padding="sm" class="mb-6">
      <div class="px-5 py-4 border-b border-ebm-border flex justify-between items-center">
        <h3 class="text-lg font-bold text-ebm-primary">帳號列表（{{ adminStore.users.length }}）</h3>
        <EbmButton variant="primary" size="sm">+ 新增使用者</EbmButton>
      </div>
      <table class="w-full text-sm">
        <thead class="bg-ebm-bg text-xs uppercase tracking-wider text-ebm-text-muted">
          <tr>
            <th class="px-5 py-3 text-left font-semibold">使用者</th>
            <th class="px-5 py-3 text-left font-semibold">Email</th>
            <th class="px-5 py-3 text-right font-semibold">儲值金</th>
            <th class="px-5 py-3 text-left font-semibold">角色</th>
            <th class="px-5 py-3 text-left font-semibold">狀態</th>
            <th class="px-5 py-3 text-left font-semibold">最後登入</th>
            <th class="px-5 py-3 text-right font-semibold">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-ebm-border">
          <tr v-for="u in adminStore.users" :key="u.userId" class="hover:bg-ebm-bg">
            <td class="px-5 py-3">
              <div class="flex items-center gap-3">
                <div class="h-9 w-9 rounded-full bg-ebm-accent flex items-center justify-center text-white text-sm font-bold">
                  {{ u.displayName[0] }}
                </div>
                <div>
                  <div class="font-semibold text-ebm-primary">{{ u.displayName }}</div>
                  <div class="text-xs text-ebm-text-muted font-mono">{{ u.userId }}</div>
                </div>
              </div>
            </td>
            <td class="px-5 py-3 text-xs">{{ u.email }}</td>
            <td class="px-5 py-3 text-right font-mono">{{ fmt(u.prepaidBalance) }}</td>
            <td class="px-5 py-3">
              <EbmBadge :variant="u.isAdmin ? 'primary' : 'neutral'">{{ u.isAdmin ? 'Admin' : '一般' }}</EbmBadge>
            </td>
            <td class="px-5 py-3">
              <EbmBadge :variant="statusVariant[u.status]" dot>{{ statusLabel[u.status] }}</EbmBadge>
            </td>
            <td class="px-5 py-3 text-xs text-ebm-text-muted">
              {{ u.lastLoginAt ? u.lastLoginAt.slice(0, 16).replace('T', ' ') : '從未' }}
            </td>
            <td class="px-5 py-3 text-right">
              <button class="h-8 px-2 rounded-md hover:bg-white text-xs text-ebm-accent"
                @click="adminStore.toggleUserStatus(u.userId)">
                {{ u.status === 'active' ? '停用' : '啟用' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </EbmCard>

    <!-- Registration queue -->
    <EbmCard padding="sm">
      <div class="px-5 py-4 border-b border-ebm-border">
        <h3 class="text-lg font-bold text-ebm-primary">註冊申請（{{ adminStore.registrations.length }}）</h3>
      </div>
      <table class="w-full text-sm">
        <thead class="bg-ebm-bg text-xs uppercase tracking-wider text-ebm-text-muted">
          <tr>
            <th class="px-5 py-3 text-left font-semibold">申請人</th>
            <th class="px-5 py-3 text-left font-semibold">公司</th>
            <th class="px-5 py-3 text-left font-semibold">Email</th>
            <th class="px-5 py-3 text-left font-semibold">申請時間</th>
            <th class="px-5 py-3 text-left font-semibold">狀態</th>
            <th class="px-5 py-3 text-right font-semibold">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-ebm-border">
          <tr v-for="r in adminStore.registrations" :key="r.id" class="hover:bg-ebm-bg">
            <td class="px-5 py-3">
              <div class="font-semibold text-ebm-primary">{{ r.displayName }}</div>
              <div class="text-xs text-ebm-text-muted font-mono">{{ r.userId }}</div>
            </td>
            <td class="px-5 py-3 text-xs">{{ r.company || '—' }}</td>
            <td class="px-5 py-3 text-xs">{{ r.email }}</td>
            <td class="px-5 py-3 text-xs text-ebm-text-muted">{{ r.appliedAt.slice(0, 16).replace('T', ' ') }}</td>
            <td class="px-5 py-3">
              <EbmBadge :variant="r.status === 'pending' ? 'warning' : r.status === 'accepted' ? 'success' : 'neutral'">
                {{ r.status === 'pending' ? '待審核' : r.status === 'accepted' ? '已核准' : '已略過' }}
              </EbmBadge>
            </td>
            <td class="px-5 py-3 text-right">
              <div v-if="r.status === 'pending'" class="flex gap-1 justify-end">
                <button class="h-8 px-2 rounded-md bg-ebm-success text-white text-xs font-semibold"
                  @click="adminStore.acceptRegistration(r.id)">核准</button>
                <button class="h-8 px-2 rounded-md border border-ebm-border text-ebm-text-muted text-xs"
                  @click="adminStore.ignoreRegistration(r.id)">略過</button>
              </div>
              <span v-else class="text-xs text-ebm-text-muted">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </EbmCard>
  </AdminLayout>
</template>

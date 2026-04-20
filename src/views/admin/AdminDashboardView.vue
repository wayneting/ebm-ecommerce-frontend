<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { useProductStore } from '@/stores/product'
import { useOrderStore } from '@/stores/order'
import { useAdminStore } from '@/stores/admin'
import EbmCard from '@/components/ui/EbmCard.vue'
import EbmBadge from '@/components/ui/EbmBadge.vue'

const productStore = useProductStore()
const orderStore = useOrderStore()
const adminStore = useAdminStore()

onMounted(() => {
  productStore.fetchAll()
  orderStore.fetchAll()
  adminStore.fetchUsers()
  adminStore.fetchRegistrations()
})

const stats = computed(() => {
  const revenue = orderStore.orders.reduce((sum, o) => sum + o.total, 0)
  const pendingRegs = adminStore.registrations.filter((r) => r.status === 'pending').length
  const activeUsers = adminStore.users.filter((u) => u.status === 'active').length
  return [
    { label: '總產品', value: productStore.products.length, suffix: '', hint: '上架中' },
    { label: '總訂單', value: orderStore.orders.length, suffix: '', hint: `總營收 NT$ ${revenue.toLocaleString()}` },
    { label: '使用者', value: activeUsers, suffix: '', hint: `${adminStore.users.length} 位（含停用）` },
    { label: '待審核註冊', value: pendingRegs, suffix: '', hint: '需要處理' },
  ]
})

const recentOrders = computed(() => orderStore.orders.slice(0, 5))
const pendingRegs = computed(() => adminStore.registrations.filter((r) => r.status === 'pending'))

const fmt = (n: number) => 'NT$ ' + n.toLocaleString()
</script>

<template>
  <AdminLayout>
    <h1 class="text-3xl font-extrabold text-ebm-primary tracking-tight mb-6">儀表板</h1>

    <!-- Stat cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <EbmCard v-for="s in stats" :key="s.label" padding="sm">
        <div class="px-2 py-2">
          <div class="text-xs text-ebm-text-muted uppercase tracking-wider">{{ s.label }}</div>
          <div class="text-2xl font-black text-ebm-primary mt-1 font-mono">{{ s.value }}{{ s.suffix }}</div>
          <div class="text-xs text-ebm-text-muted mt-1">{{ s.hint }}</div>
        </div>
      </EbmCard>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <!-- Recent orders -->
      <EbmCard>
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-ebm-primary">最近訂單</h3>
          <RouterLink to="/admin/orders" class="text-xs text-ebm-accent hover:underline">全部 →</RouterLink>
        </div>
        <table class="w-full text-sm">
          <tbody class="divide-y divide-ebm-border">
            <tr v-for="o in recentOrders" :key="o.id" class="py-2">
              <td class="py-2 font-mono text-xs text-ebm-accent">#{{ o.id }}</td>
              <td class="py-2">{{ o.productName }}</td>
              <td class="py-2 text-right font-mono">{{ fmt(o.total) }}</td>
            </tr>
          </tbody>
        </table>
      </EbmCard>

      <!-- Pending registrations -->
      <EbmCard>
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-ebm-primary">待審核註冊</h3>
          <EbmBadge v-if="pendingRegs.length > 0" variant="warning">{{ pendingRegs.length }}</EbmBadge>
        </div>
        <div v-if="pendingRegs.length === 0" class="text-sm text-ebm-text-muted text-center py-6">
          沒有待審核註冊
        </div>
        <div v-else class="space-y-3">
          <div v-for="r in pendingRegs" :key="r.id" class="flex justify-between items-center p-3 rounded-lg border border-ebm-border">
            <div class="min-w-0">
              <div class="font-semibold text-ebm-primary truncate">{{ r.displayName }}（{{ r.userId }}）</div>
              <div class="text-xs text-ebm-text-muted truncate">{{ r.company }} · {{ r.email }}</div>
            </div>
            <div class="flex gap-1 flex-shrink-0">
              <button class="h-7 px-2 rounded-md bg-ebm-success text-white text-xs font-semibold"
                @click="adminStore.acceptRegistration(r.id)">核准</button>
              <button class="h-7 px-2 rounded-md border border-ebm-border text-ebm-text-muted text-xs"
                @click="adminStore.ignoreRegistration(r.id)">略過</button>
            </div>
          </div>
        </div>
      </EbmCard>
    </div>
  </AdminLayout>
</template>

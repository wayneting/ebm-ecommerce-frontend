<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useOrderStore } from '@/stores/order'
import EbmBadge from '@/components/ui/EbmBadge.vue'
import EbmCard from '@/components/ui/EbmCard.vue'
import EbmButton from '@/components/ui/EbmButton.vue'

const orderStore = useOrderStore()
const filter = ref<'all' | 'pending' | 'paid' | 'cancelled'>('all')

onMounted(() => orderStore.fetchAll())

const filtered = computed(() => {
  if (filter.value === 'all') return orderStore.orders
  if (filter.value === 'pending') return orderStore.orders.filter((o) => o.status === 'pending-payment')
  if (filter.value === 'paid') return orderStore.orders.filter((o) => o.status === 'paid-not-burned' || o.status === 'paid-burned')
  if (filter.value === 'cancelled') return orderStore.orders.filter((o) => o.status === 'cancelled' || o.status === 'refunded')
  return orderStore.orders
})

const statusLabel = { 'pending-payment': '待付款', 'paid-not-burned': '已付款', 'paid-burned': '已燒錄', cancelled: '已取消', refunded: '已退款' } as const
const statusVariant = { 'pending-payment': 'info', 'paid-not-burned': 'warning', 'paid-burned': 'success', cancelled: 'neutral', refunded: 'neutral' } as const

const fmt = (n: number) => 'NT$ ' + n.toLocaleString()
const fmtDate = (iso: string) => iso.slice(0, 10).replace(/-/g, '/')
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-10">
    <header class="mb-8 flex justify-between items-end flex-wrap gap-3">
      <div>
        <div class="text-ebm-accent text-sm font-semibold uppercase tracking-widest mb-1">我的訂單</div>
        <h1 class="text-3xl font-extrabold text-ebm-primary tracking-tight">訂單列表</h1>
      </div>
      <div class="flex gap-2 text-sm">
        <button v-for="f in (['all','pending','paid','cancelled'] as const)" :key="f"
          class="px-3 py-1.5 rounded-md text-xs"
          :class="filter === f ? 'bg-ebm-primary text-white' : 'border border-ebm-border text-ebm-text-muted hover:border-ebm-primary'"
          @click="filter = f"
        >
          {{ { all:'全部', pending:'待付款', paid:'已付款', cancelled:'已取消' }[f] }}
        </button>
      </div>
    </header>

    <EbmCard v-if="filtered.length === 0" class="text-center py-16">
      <div class="text-4xl mb-3">📭</div>
      <h3 class="text-lg font-bold text-ebm-primary mb-2">尚無符合條件的訂單</h3>
      <RouterLink to="/app/products"><EbmButton variant="primary" class="mt-4">瀏覽產品 →</EbmButton></RouterLink>
    </EbmCard>

    <EbmCard v-else padding="sm">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-ebm-border text-ebm-text-muted text-xs uppercase tracking-wider">
            <th class="px-5 py-3 text-left font-semibold">訂單編號</th>
            <th class="px-5 py-3 text-left font-semibold">產品</th>
            <th class="px-5 py-3 text-right font-semibold">金額</th>
            <th class="px-5 py-3 text-left font-semibold">付款方式</th>
            <th class="px-5 py-3 text-left font-semibold">狀態</th>
            <th class="px-5 py-3 text-left font-semibold">Dongle</th>
            <th class="px-5 py-3 text-left font-semibold">日期</th>
            <th class="px-5 py-3 text-right font-semibold">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-ebm-border">
          <tr v-for="o in filtered" :key="o.id" class="hover:bg-ebm-bg">
            <td class="px-5 py-3 font-mono text-xs text-ebm-accent font-semibold">#{{ o.id }}</td>
            <td class="px-5 py-3">
              <div class="font-semibold text-ebm-primary">{{ o.productName }}</div>
              <div class="text-xs text-ebm-text-muted">{{ o.productId }} · {{ o.items.length }} 模組</div>
            </td>
            <td class="px-5 py-3 text-right font-mono font-semibold">{{ fmt(o.total) }}</td>
            <td class="px-5 py-3 text-xs">{{ o.paymentMethod === 'bank-transfer' ? '匯款' : '扣儲值金' }}</td>
            <td class="px-5 py-3">
              <EbmBadge :variant="statusVariant[o.status]" dot>{{ statusLabel[o.status] }}</EbmBadge>
            </td>
            <td class="px-5 py-3 font-mono text-xs">#{{ o.dongleSerial }}</td>
            <td class="px-5 py-3 text-xs text-ebm-text-muted">{{ fmtDate(o.orderDate) }}</td>
            <td class="px-5 py-3 text-right">
              <RouterLink :to="`/app/orders/${o.id}`" class="text-xs text-ebm-accent hover:underline">查看內容</RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </EbmCard>
  </div>
</template>

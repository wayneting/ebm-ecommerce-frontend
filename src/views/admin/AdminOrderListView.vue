<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { useOrderStore } from '@/stores/order'
import EbmCard from '@/components/ui/EbmCard.vue'
import EbmBadge from '@/components/ui/EbmBadge.vue'
import EbmModal from '@/components/ui/EbmModal.vue'
import EbmButton from '@/components/ui/EbmButton.vue'
import type { Order } from '@/types/models'

const orderStore = useOrderStore()
onMounted(() => orderStore.fetchAll())

const filter = ref<'all' | 'pending-payment' | 'paid-not-burned' | 'paid-burned'>('all')
const viewing = ref<Order | null>(null)

const filtered = computed(() => {
  if (filter.value === 'all') return orderStore.orders
  return orderStore.orders.filter((o) => o.status === filter.value)
})

const statusLabel = { 'pending-payment': '待付款', 'paid-not-burned': '已付款·待燒錄', 'paid-burned': '已燒錄完成', cancelled: '已取消', refunded: '已退款' } as const
const statusVariant = { 'pending-payment': 'info', 'paid-not-burned': 'warning', 'paid-burned': 'success', cancelled: 'neutral', refunded: 'neutral' } as const

const fmt = (n: number) => 'NT$ ' + n.toLocaleString()

function markAsBurned(order: Order) {
  order.status = 'paid-burned'
  order.burned = true
  viewing.value = null
}
</script>

<template>
  <AdminLayout :breadcrumb="['訂單管理']">
    <h1 class="text-3xl font-extrabold text-ebm-primary tracking-tight mb-6">訂單管理</h1>

    <div class="flex gap-2 mb-4 text-sm">
      <button v-for="f in (['all','pending-payment','paid-not-burned','paid-burned'] as const)" :key="f"
        class="px-3 py-1.5 rounded-md text-xs"
        :class="filter === f ? 'bg-ebm-primary text-white' : 'border border-ebm-border text-ebm-text-muted hover:border-ebm-primary'"
        @click="filter = f"
      >
        {{ f === 'all' ? '全部' : statusLabel[f] }}
      </button>
    </div>

    <EbmCard padding="sm">
      <table class="w-full text-sm">
        <thead class="bg-ebm-bg text-xs uppercase tracking-wider text-ebm-text-muted">
          <tr>
            <th class="px-5 py-3 text-left font-semibold">編號</th>
            <th class="px-5 py-3 text-left font-semibold">產品</th>
            <th class="px-5 py-3 text-left font-semibold">Dongle</th>
            <th class="px-5 py-3 text-right font-semibold">金額</th>
            <th class="px-5 py-3 text-left font-semibold">付款</th>
            <th class="px-5 py-3 text-left font-semibold">狀態</th>
            <th class="px-5 py-3 text-left font-semibold">日期</th>
            <th class="px-5 py-3 text-right font-semibold">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-ebm-border">
          <tr v-for="o in filtered" :key="o.id" class="hover:bg-ebm-bg">
            <td class="px-5 py-3 font-mono text-xs font-semibold text-ebm-accent">#{{ o.id }}</td>
            <td class="px-5 py-3">{{ o.productName }}</td>
            <td class="px-5 py-3 font-mono text-xs">#{{ o.dongleSerial }}</td>
            <td class="px-5 py-3 text-right font-mono font-semibold">{{ fmt(o.total) }}</td>
            <td class="px-5 py-3 text-xs">{{ o.paymentMethod === 'bank-transfer' ? '匯款' : '儲值金' }}</td>
            <td class="px-5 py-3"><EbmBadge :variant="statusVariant[o.status]" dot>{{ statusLabel[o.status] }}</EbmBadge></td>
            <td class="px-5 py-3 text-xs text-ebm-text-muted">{{ o.orderDate.slice(0, 10) }}</td>
            <td class="px-5 py-3 text-right">
              <button class="h-8 px-2 rounded-md hover:bg-white text-xs text-ebm-accent"
                @click="viewing = o">詳情</button>
            </td>
          </tr>
        </tbody>
      </table>
    </EbmCard>

    <!-- Order detail modal -->
    <EbmModal :open="!!viewing" :title="viewing ? `訂單 #${viewing.id}` : ''"
      :subtitle="viewing ? viewing.productName + ' · ' + viewing.dongleSerial : ''"
      max-width="max-w-2xl" @close="viewing = null"
    >
      <template v-if="viewing">
        <div class="space-y-3 text-sm mb-5">
          <div class="flex justify-between"><span class="text-ebm-text-muted">訂購日期</span><span>{{ viewing.orderDate.replace('T', ' ').slice(0, 16) }}</span></div>
          <div class="flex justify-between"><span class="text-ebm-text-muted">類型</span><span>{{ viewing.isUpgrade ? '升級' : '新購' }} · {{ viewing.licenseType === 'buyout' ? 'Buyout' : `Day ${viewing.purchaseDays}` }}</span></div>
          <div class="flex justify-between"><span class="text-ebm-text-muted">付款</span><span>{{ viewing.paymentMethod === 'bank-transfer' ? '匯款' : '扣儲值金' }}</span></div>
          <div class="flex justify-between"><span class="text-ebm-text-muted">已燒錄</span>
            <span :class="viewing.burned ? 'text-ebm-success font-semibold' : 'text-ebm-warning'">{{ viewing.burned ? '是' : '尚未' }}</span>
          </div>
        </div>
        <table class="w-full text-sm mb-3">
          <thead class="text-xs text-ebm-text-muted uppercase tracking-wider">
            <tr class="border-b border-ebm-border">
              <th class="py-2 text-left font-semibold">模組</th>
              <th class="py-2 text-right font-semibold">數量</th>
              <th class="py-2 text-right font-semibold">小計</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-ebm-border">
            <tr v-for="it in viewing.items" :key="it.moduleId">
              <td class="py-2"><span class="font-mono text-xs text-ebm-text-muted">{{ it.moduleId }}</span> {{ it.moduleName }}</td>
              <td class="py-2 text-right font-mono">{{ it.quantity.toLocaleString() }}</td>
              <td class="py-2 text-right font-mono font-semibold">{{ fmt(it.subtotal) }}</td>
            </tr>
          </tbody>
        </table>
        <div class="flex justify-between pt-3 border-t-2 border-ebm-primary">
          <span class="font-bold">總計</span>
          <span class="font-mono font-black text-xl text-ebm-primary">{{ fmt(viewing.total) }}</span>
        </div>
      </template>
      <template #footer>
        <EbmButton variant="secondary" size="sm" @click="viewing = null">關閉</EbmButton>
        <EbmButton
          v-if="viewing && viewing.status === 'paid-not-burned'"
          variant="primary" size="sm" @click="markAsBurned(viewing)"
        >
          標記為已燒錄
        </EbmButton>
      </template>
    </EbmModal>
  </AdminLayout>
</template>

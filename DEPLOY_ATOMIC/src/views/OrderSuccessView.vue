<script setup lang="ts">
/**
 * OrderSuccessView — 下單成功
 */
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useOrderStore } from '@/stores/order'
import EbmButton from '@/components/ui/EbmButton.vue'
import EbmCard from '@/components/ui/EbmCard.vue'

const route = useRoute()
const orderStore = useOrderStore()

const orderId = computed(() => route.query.id as string)
const order = computed(() => (orderId.value ? orderStore.findById(orderId.value) : null))

function format(n: number) {
  return Math.round(n).toLocaleString('en-US')
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-6 py-20">
    <div class="text-center mb-10">
      <div class="mx-auto h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
        <svg class="h-12 w-12 text-ebm-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 class="text-4xl font-extrabold text-ebm-primary tracking-tight mb-3">訂單建立成功</h1>
      <p class="text-lg text-ebm-text-muted">
        您的訂單已送出，{{ order?.paymentMethod === 'bank-transfer' ? '請於 3 個工作天內完成匯款' : '將立即處理' }}。
      </p>
    </div>

    <EbmCard v-if="order">
      <div class="flex justify-between items-start pb-5 mb-5 border-b border-ebm-border">
        <div>
          <div class="text-xs text-ebm-text-muted uppercase tracking-wider">訂單編號</div>
          <div class="text-2xl font-bold text-ebm-primary font-mono">#{{ order.id }}</div>
        </div>
        <div class="text-right">
          <div class="text-xs text-ebm-text-muted uppercase tracking-wider">訂購時間</div>
          <div class="text-sm font-semibold text-ebm-primary">{{ order.orderDate.replace('T', ' ').slice(0, 16) }}</div>
        </div>
      </div>

      <div class="space-y-3 mb-6">
        <div class="flex justify-between">
          <span class="text-ebm-text-muted text-sm">產品</span>
          <span class="font-semibold">{{ order.productName }}（{{ order.productId }}）</span>
        </div>
        <div class="flex justify-between">
          <span class="text-ebm-text-muted text-sm">Dongle 序號</span>
          <span class="font-mono font-semibold">#{{ order.dongleSerial }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-ebm-text-muted text-sm">授權類型</span>
          <span class="font-semibold">
            {{ order.licenseType === 'buyout' ? 'Buyout 買斷' : `Day License ${order.purchaseDays} 天` }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-ebm-text-muted text-sm">付款方式</span>
          <span class="font-semibold">{{ order.paymentMethod === 'bank-transfer' ? '匯款' : '扣儲值金' }}</span>
        </div>
      </div>

      <div class="pt-5 border-t border-ebm-border flex justify-between items-center mb-6">
        <span class="text-ebm-text-muted">總計</span>
        <span class="text-3xl font-black text-ebm-primary font-mono">NT$ {{ format(order.total) }}</span>
      </div>

      <div class="flex gap-3 flex-wrap">
        <RouterLink to="/app" class="flex-1">
          <EbmButton variant="primary" full-width>回到儀表板</EbmButton>
        </RouterLink>
        <RouterLink to="/app/products" class="flex-1">
          <EbmButton variant="secondary" full-width>繼續選購</EbmButton>
        </RouterLink>
      </div>
    </EbmCard>

    <div v-else class="text-center py-10 text-ebm-text-muted">
      找不到訂單資訊。
      <RouterLink to="/app" class="text-ebm-accent hover:underline">回到儀表板</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useOrderStore } from '@/stores/order'
import EbmCard from '@/components/ui/EbmCard.vue'
import EbmButton from '@/components/ui/EbmButton.vue'
import EbmBadge from '@/components/ui/EbmBadge.vue'

const route = useRoute()
const orderStore = useOrderStore()

const order = computed(() => orderStore.findById(route.params.id as string))

const fmt = (n: number) => 'NT$ ' + n.toLocaleString()
const statusLabel = { 'pending-payment': '待付款', 'paid-not-burned': '已付款·待燒錄', 'paid-burned': '已燒錄完成', cancelled: '已取消', refunded: '已退款' } as const
const statusVariant = { 'pending-payment': 'info', 'paid-not-burned': 'warning', 'paid-burned': 'success', cancelled: 'neutral', refunded: 'neutral' } as const
</script>

<template>
  <div class="max-w-5xl mx-auto px-6 py-10">
    <RouterLink to="/app/orders" class="text-sm text-ebm-accent hover:underline mb-4 inline-block">
      ← 回訂單列表
    </RouterLink>

    <div v-if="!order" class="text-center py-20 text-ebm-text-muted">找不到此訂單。</div>

    <template v-else>
      <header class="flex justify-between items-start mb-8 flex-wrap gap-3">
        <div>
          <div class="text-xs text-ebm-text-muted uppercase tracking-wider">訂單編號</div>
          <h1 class="text-4xl font-black font-mono text-ebm-primary tracking-tight">#{{ order.id }}</h1>
        </div>
        <div class="text-right">
          <EbmBadge :variant="statusVariant[order.status]" dot>{{ statusLabel[order.status] }}</EbmBadge>
          <div class="text-xs text-ebm-text-muted mt-2">建立於 {{ order.orderDate.replace('T',' ').slice(0,16) }}</div>
        </div>
      </header>

      <div class="grid lg:grid-cols-3 gap-6">
        <!-- 左邊：明細 -->
        <div class="lg:col-span-2 space-y-4">
          <EbmCard>
            <h3 class="text-lg font-bold text-ebm-primary mb-4">訂購明細</h3>
            <table class="w-full text-sm">
              <thead class="text-xs text-ebm-text-muted uppercase tracking-wider">
                <tr class="border-b border-ebm-border">
                  <th class="py-2 text-left font-semibold">模組</th>
                  <th class="py-2 text-right font-semibold">單價</th>
                  <th class="py-2 text-right font-semibold">數量</th>
                  <th class="py-2 text-right font-semibold">小計</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-ebm-border">
                <tr v-for="it in order.items" :key="it.moduleId">
                  <td class="py-3">
                    <div class="flex items-center gap-2">
                      <span class="font-mono text-xs px-2 py-0.5 rounded-md bg-ebm-bg text-ebm-text-muted">{{ it.moduleId }}</span>
                      <span class="font-semibold">{{ it.moduleName }}</span>
                    </div>
                    <div class="text-xs text-ebm-text-muted mt-1">{{ it.description }}</div>
                  </td>
                  <td class="py-3 text-right font-mono">{{ fmt(it.unitPrice) }}</td>
                  <td class="py-3 text-right font-mono">{{ it.quantity.toLocaleString() }}</td>
                  <td class="py-3 text-right font-mono font-semibold">{{ fmt(it.subtotal) }}</td>
                </tr>
              </tbody>
              <tfoot class="border-t-2 border-ebm-primary">
                <tr>
                  <td colspan="3" class="py-3 text-right text-ebm-text-muted">總計</td>
                  <td class="py-3 text-right font-mono font-black text-ebm-primary text-lg">{{ fmt(order.total) }}</td>
                </tr>
              </tfoot>
            </table>
          </EbmCard>
        </div>

        <!-- 右邊：摘要 -->
        <div class="space-y-4">
          <EbmCard>
            <h3 class="text-base font-bold text-ebm-primary mb-3">產品資訊</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between"><span class="text-ebm-text-muted">產品</span><span class="font-semibold">{{ order.productName }}</span></div>
              <div class="flex justify-between"><span class="text-ebm-text-muted">Dongle</span><span class="font-mono">#{{ order.dongleSerial }}</span></div>
              <div class="flex justify-between"><span class="text-ebm-text-muted">類型</span><span>{{ order.isUpgrade ? '升級' : '新購' }}</span></div>
              <div class="flex justify-between"><span class="text-ebm-text-muted">授權</span>
                <span>{{ order.licenseType === 'buyout' ? 'Buyout 買斷' : `Day License ${order.purchaseDays} 天` }}</span>
              </div>
              <div class="flex justify-between"><span class="text-ebm-text-muted">付款方式</span>
                <span>{{ order.paymentMethod === 'bank-transfer' ? '匯款' : '扣儲值金' }}</span>
              </div>
              <div class="flex justify-between"><span class="text-ebm-text-muted">已燒錄</span>
                <span :class="order.burned ? 'text-ebm-success' : 'text-ebm-warning'">{{ order.burned ? '是' : '尚未' }}</span>
              </div>
            </div>
          </EbmCard>

          <EbmButton variant="secondary" full-width>下載 PDF 訂單</EbmButton>
          <EbmButton v-if="order.status === 'pending-payment'" variant="ghost" full-width>取消訂單</EbmButton>
        </div>
      </div>
    </template>
  </div>
</template>

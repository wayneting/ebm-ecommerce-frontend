<script setup lang="ts">
/**
 * Dashboard
 * 顯示歡迎訊息、快捷入口、即將到期 Dongles 與最近訂單。
 */
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useDongleStore } from '@/stores/dongle'
import { useOrderStore } from '@/stores/order'
import EbmCard from '@/components/ui/EbmCard.vue'
import EbmBadge from '@/components/ui/EbmBadge.vue'

const auth = useAuthStore()
const cart = useCartStore()
const dongleStore = useDongleStore()
const orderStore = useOrderStore()

const expiringSoon = computed(() =>
  dongleStore.dongles
    .filter((d) => d.purchaseDays > 0 && d.purchaseDays <= 30)
    .sort((a, b) => a.purchaseDays - b.purchaseDays),
)

const recentOrders = computed(() => orderStore.orders.slice(0, 3))

function formatCurrency(n: number): string {
  return 'NT$ ' + n.toLocaleString('en-US')
}
function formatDate(iso: string): string {
  return iso.slice(0, 10).replace(/-/g, '/')
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-10 space-y-8">
    <!-- Welcome banner -->
    <div class="bg-ebm-gradient-hero text-white rounded-xl p-8 relative overflow-hidden">
      <div class="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
        style="background: radial-gradient(circle, rgba(0,161,224,0.15), transparent 70%);" />
      <div class="relative z-10">
        <div class="text-xs text-white/60 uppercase tracking-widest mb-2">歡迎回來</div>
        <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">
          嗨，{{ auth.user?.displayName ?? '使用者' }}
        </h1>
        <p class="text-white/80 mt-2">
          儲值金餘額：<strong class="font-mono text-white">{{ formatCurrency(auth.user?.prepaidBalance ?? 0) }}</strong>
        </p>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <RouterLink to="/app/products" class="block">
        <EbmCard hoverable>
          <div class="h-12 w-12 rounded-xl flex items-center justify-center text-2xl mb-4"
            style="background:#E0F2FE; color:#00A1E0">🛒</div>
          <h3 class="text-lg font-bold text-ebm-primary">新購產品</h3>
          <p class="text-sm text-ebm-text-muted mt-1">瀏覽 EBM 六產品線</p>
        </EbmCard>
      </RouterLink>
      <RouterLink to="/app/upgrade" class="block">
        <EbmCard hoverable>
          <div class="h-12 w-12 rounded-xl flex items-center justify-center text-2xl mb-4"
            style="background:#FFEDD5; color:#F76E11">⬆️</div>
          <h3 class="text-lg font-bold text-ebm-primary">升級產品</h3>
          <p class="text-sm text-ebm-text-muted mt-1">從現有 Dongle 升級模組</p>
        </EbmCard>
      </RouterLink>
      <RouterLink to="/app/cart" class="block">
        <EbmCard hoverable>
          <div class="h-12 w-12 rounded-xl flex items-center justify-center text-2xl mb-4"
            style="background:#DCFCE7; color:#22C55E">🧺</div>
          <h3 class="text-lg font-bold text-ebm-primary">購物車</h3>
          <p class="text-sm text-ebm-text-muted mt-1">
            {{ cart.itemCount > 0 ? `${cart.itemCount} 項待結帳` : '尚無商品' }}
          </p>
        </EbmCard>
      </RouterLink>
    </div>

    <!-- 2 column: Expiring + Recent orders -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Expiring Dongles -->
      <EbmCard>
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-ebm-primary">⏰ 即將到期的 Dongle</h3>
          <RouterLink to="/app/dongles" class="text-xs text-ebm-accent hover:underline">全部 →</RouterLink>
        </div>
        <div v-if="expiringSoon.length === 0" class="text-sm text-ebm-text-muted text-center py-4">
          沒有即將到期的 Dongle 👍
        </div>
        <div v-else class="space-y-3">
          <div v-for="d in expiringSoon" :key="d.serial"
            class="flex justify-between items-center p-3 rounded-lg border border-ebm-border">
            <div>
              <div class="font-mono font-semibold text-ebm-primary">#{{ d.serial }}</div>
              <div class="text-xs text-ebm-text-muted mt-0.5">{{ d.productName }}</div>
            </div>
            <div class="text-right">
              <div class="font-mono font-bold text-lg" :class="d.purchaseDays <= 7 ? 'text-ebm-error' : 'text-amber-600'">
                {{ d.purchaseDays }} 天
              </div>
              <EbmBadge :variant="d.purchaseDays <= 7 ? 'error' : 'warning'" dot>
                {{ d.purchaseDays <= 7 ? '即將停用' : '即將到期' }}
              </EbmBadge>
            </div>
          </div>
        </div>
      </EbmCard>

      <!-- Recent orders -->
      <EbmCard>
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-ebm-primary">📋 最近訂單</h3>
          <RouterLink to="/app/orders" class="text-xs text-ebm-accent hover:underline">全部 →</RouterLink>
        </div>
        <div v-if="recentOrders.length === 0" class="text-sm text-ebm-text-muted text-center py-4">
          尚無訂單
        </div>
        <div v-else class="space-y-3">
          <div v-for="o in recentOrders" :key="o.id"
            class="flex justify-between items-center p-3 rounded-lg border border-ebm-border">
            <div>
              <div class="font-mono text-sm text-ebm-accent font-semibold">#{{ o.id }}</div>
              <div class="text-xs text-ebm-text-muted mt-0.5">
                {{ o.productName }} · {{ formatDate(o.orderDate) }}
              </div>
            </div>
            <div class="text-right">
              <div class="font-mono font-bold text-ebm-primary">{{ formatCurrency(o.total) }}</div>
              <EbmBadge :variant="o.status === 'paid-burned' ? 'success' : o.status === 'paid-not-burned' ? 'warning' : 'neutral'">
                {{ o.status === 'paid-burned' ? '已燒錄' : o.status === 'paid-not-burned' ? '已付款' : o.status }}
              </EbmBadge>
            </div>
          </div>
        </div>
      </EbmCard>
    </div>
  </div>
</template>

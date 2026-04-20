<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useDongleStore } from '@/stores/dongle'
import EbmCard from '@/components/ui/EbmCard.vue'
import EbmButton from '@/components/ui/EbmButton.vue'
import EbmBadge from '@/components/ui/EbmBadge.vue'

const dongleStore = useDongleStore()
const router = useRouter()

onMounted(() => dongleStore.fetchAll())

const fmt = (n: number) => n.toLocaleString()
const statusLabel: Record<string, string> = { 'active': '使用中', 'in-cart': '在購物車', 'trial': '試用中', 'expired': '已過期', 'disabled': '已停用' }
const statusVariant: Record<string, 'success' | 'warning' | 'primary' | 'neutral' | 'error'> = {
  'active': 'success', 'in-cart': 'primary', 'trial': 'warning', 'expired': 'neutral', 'disabled': 'error',
}

function goUpgrade(serial: string, productId: string) {
  router.push(`/app/products/${productId}/configure?upgradeDongle=${serial}`)
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-10">
    <header class="mb-8">
      <div class="text-ebm-accent text-sm font-semibold uppercase tracking-widest mb-1">我的 Dongle</div>
      <h1 class="text-3xl font-extrabold text-ebm-primary tracking-tight">Dongle 列表</h1>
      <p class="text-ebm-text-muted mt-2">每個 Dongle 是一組產品授權序號，可以升級加購新模組或延長 Day License。</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <EbmCard v-for="d in dongleStore.dongles" :key="d.serial">
        <div class="flex justify-between items-start mb-4">
          <div>
            <div class="text-xs text-ebm-text-muted uppercase tracking-wider">序號</div>
            <div class="font-mono font-black text-2xl text-ebm-primary">#{{ d.serial }}</div>
          </div>
          <EbmBadge :variant="statusVariant[d.status]" dot :pulse="d.status === 'trial' && d.purchaseDays <= 7">
            {{ statusLabel[d.status] }}
          </EbmBadge>
        </div>

        <div class="flex items-center gap-3 mb-4 pb-4 border-b border-ebm-border">
          <div class="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-xs bg-ebm-gradient-accent">
            {{ d.productName.slice(0, 2).toUpperCase() }}
          </div>
          <div>
            <div class="font-semibold text-ebm-primary">{{ d.productName }}</div>
            <div class="text-xs text-ebm-text-muted">{{ d.productId }}</div>
          </div>
        </div>

        <div class="space-y-2 text-sm mb-4">
          <div class="flex justify-between">
            <span class="text-ebm-text-muted">授權類型</span>
            <span class="font-semibold">{{ d.licenseType === 'buyout' ? 'Buyout 買斷' : 'Day License' }}</span>
          </div>
          <div v-if="d.licenseType !== 'buyout'" class="flex justify-between">
            <span class="text-ebm-text-muted">剩餘天數</span>
            <span class="font-mono font-bold" :class="d.purchaseDays <= 7 ? 'text-ebm-error' : d.purchaseDays <= 30 ? 'text-amber-600' : 'text-ebm-primary'">
              {{ d.purchaseDays }} 天
            </span>
          </div>
          <div v-if="d.expireDate" class="flex justify-between">
            <span class="text-ebm-text-muted">到期日</span>
            <span class="text-xs">{{ d.expireDate }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-ebm-text-muted">已燒錄模組</span>
            <span class="font-mono font-semibold">{{ d.installedModules.length }} 個</span>
          </div>
        </div>

        <div class="bg-ebm-bg rounded-lg p-3 mb-4 max-h-32 overflow-y-auto">
          <div v-for="m in d.installedModules" :key="m.moduleId" class="text-xs py-1 flex justify-between">
            <span><span class="font-mono text-ebm-text-muted">{{ m.moduleId }}</span> {{ m.moduleName }}</span>
            <span class="font-mono">× {{ fmt(m.quantity) }}</span>
          </div>
        </div>

        <div class="flex gap-2">
          <EbmButton
            variant="primary"
            size="sm"
            full-width
            :disabled="d.status === 'disabled' || d.status === 'in-cart'"
            @click="goUpgrade(d.serial, d.productId)"
          >
            升級
          </EbmButton>
          <RouterLink v-if="d.latestOrderId" :to="`/app/orders/${d.latestOrderId}`" class="flex-1">
            <EbmButton variant="secondary" size="sm" full-width>最近訂單</EbmButton>
          </RouterLink>
        </div>
      </EbmCard>
    </div>
  </div>
</template>

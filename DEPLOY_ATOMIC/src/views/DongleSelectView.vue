<script setup lang="ts">
/**
 * DongleSelectView — 升級流程第一步：選要升級的 Dongle
 */
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDongleStore } from '@/stores/dongle'
import EbmCard from '@/components/ui/EbmCard.vue'
import EbmBadge from '@/components/ui/EbmBadge.vue'
import EbmStepIndicator, { type Step } from '@/components/ui/EbmStepIndicator.vue'

const router = useRouter()
const dongleStore = useDongleStore()

onMounted(() => dongleStore.fetchAll())

const upgradable = computed(() =>
  dongleStore.dongles.filter((d) => d.status === 'active' || d.status === 'trial'),
)

const fmt = (n: number) => n.toLocaleString()
const statusLabel: Record<string, string> = { 'active': '使用中', 'in-cart': '在購物車', 'trial': '試用中', 'expired': '已過期', 'disabled': '已停用' }
const statusVariant: Record<string, 'success' | 'warning' | 'primary' | 'neutral' | 'error'> = {
  'active': 'success', 'in-cart': 'primary', 'trial': 'warning', 'expired': 'neutral', 'disabled': 'error',
}

const steps: Step[] = [
  { id: 1, title: '選擇 Dongle' },
  { id: 2, title: '配置升級' },
  { id: 3, title: '購物車' },
  { id: 4, title: '確認訂單' },
]

function onSelect(serial: string, productId: string) {
  router.push(`/app/products/${productId}/configure?upgradeDongle=${serial}`)
}
</script>

<template>
  <div class="bg-ebm-bg min-h-screen">
    <div class="bg-white border-b border-ebm-border py-6">
      <div class="max-w-5xl mx-auto px-6">
        <EbmStepIndicator :steps="steps" :current-index="0" />
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-10">
      <header class="mb-8">
        <div class="text-ebm-accent text-sm font-semibold uppercase tracking-widest mb-1">升級現有 Dongle</div>
        <h1 class="text-3xl font-extrabold text-ebm-primary tracking-tight">請選擇要升級的 Dongle</h1>
        <p class="text-ebm-text-muted mt-2">升級表示加購新模組或延長 Day License，會關聯到此 Dongle。</p>
      </header>

      <div v-if="upgradable.length === 0" class="text-center py-16 text-ebm-text-muted">
        沒有可升級的 Dongle。
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          v-for="d in upgradable"
          :key="d.serial"
          type="button"
          class="text-left w-full"
          @click="onSelect(d.serial, d.productId)"
        >
          <EbmCard hoverable>
            <div class="flex justify-between items-start mb-3">
              <div class="font-mono font-black text-xl text-ebm-primary">#{{ d.serial }}</div>
              <EbmBadge :variant="statusVariant[d.status]" dot>{{ statusLabel[d.status] }}</EbmBadge>
            </div>
            <div class="font-semibold text-ebm-primary">{{ d.productName }}</div>
            <div class="text-xs text-ebm-text-muted mb-3">
              {{ d.productId }} · {{ d.installedModules.length }} 已燒錄模組
            </div>
            <div class="text-xs text-ebm-text-muted">
              {{ d.licenseType === 'buyout'
                ? 'Buyout 買斷'
                : `剩 ${fmt(d.purchaseDays)} 天 · ${d.expireDate}` }}
            </div>
            <div class="mt-4 text-sm text-ebm-accent font-semibold">選擇此 Dongle →</div>
          </EbmCard>
        </button>
      </div>
    </div>
  </div>
</template>

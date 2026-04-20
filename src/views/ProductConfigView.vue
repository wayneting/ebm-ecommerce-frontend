<script setup lang="ts">
/**
 * ProductConfigView — 新購產品 · 配置模組（購買流程核心頁）
 *
 * URL: /app/products/:productId/configure
 *
 * 流程：
 * 1. 進入時：建立 draft cart item (cart.addNewPurchase)
 * 2. 用戶勾選模組、調數量、切換授權 → 即時更新 cart item + 試算
 * 3. 點「加入購物車」→ cart item 留在 store，跳到 /app/cart
 * 4. 點「取消」→ remove cart item，跳回 ProductList
 */
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'
import { licenseOptions } from '@/mocks/user'
import EbmButton from '@/components/ui/EbmButton.vue'
import EbmCard from '@/components/ui/EbmCard.vue'
import EbmBadge from '@/components/ui/EbmBadge.vue'
import EbmStepIndicator, { type Step } from '@/components/ui/EbmStepIndicator.vue'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cart = useCartStore()

const productId = computed(() => route.params.productId as string)
const product = computed(() => productStore.products.find((p) => p.id === productId.value))

const cartItemId = ref<string | null>(null)
const confirmed = ref(false)

const upgradeDongle = computed(() => route.query.upgradeDongle as string | undefined)

onMounted(async () => {
  if (productStore.products.length === 0) {
    await productStore.fetchAll()
  }
  if (!product.value) {
    router.replace('/app/products')
    return
  }
  const item = upgradeDongle.value
    ? cart.addUpgrade(product.value, upgradeDongle.value, 'buyout')
    : cart.addNewPurchase(product.value, 'buyout')
  cartItemId.value = item.cartItemId
})

// 離開頁面如果沒「加入購物車」，移除草稿
onBeforeRouteLeave(() => {
  if (!confirmed.value && cartItemId.value) {
    cart.remove(cartItemId.value)
  }
})

const currentItem = computed(() =>
  cartItemId.value ? cart.items.find((i) => i.cartItemId === cartItemId.value) : null,
)

const selectedCount = computed(() => {
  if (!currentItem.value) return 0
  return currentItem.value.moduleSelections.filter((s) => {
    const m = currentItem.value!.product.modules.find((x) => x.id === s.moduleId)
    return s.selected || m?.isNecessary
  }).length
})

const buyoutTotal = computed(() =>
  currentItem.value ? cart.itemBuyoutTotal(currentItem.value) : 0,
)
const discount = computed(() =>
  currentItem.value ? cart.itemDiscount(currentItem.value) : 0,
)
const itemTotal = computed(() =>
  currentItem.value ? cart.itemTotal(currentItem.value) : 0,
)
const currentLicense = computed(() =>
  licenseOptions.find((l) => l.type === currentItem.value?.licenseType),
)

function format(n: number) {
  return Math.round(n).toLocaleString('en-US')
}

function moduleStatus(moduleId: string): 'necessary' | 'selected' | 'unselected' {
  if (!currentItem.value) return 'unselected'
  const m = currentItem.value.product.modules.find((x) => x.id === moduleId)
  const sel = currentItem.value.moduleSelections.find((s) => s.moduleId === moduleId)
  if (m?.isNecessary) return 'necessary'
  return sel?.selected ? 'selected' : 'unselected'
}

function selectionQty(moduleId: string): number {
  return currentItem.value?.moduleSelections.find((s) => s.moduleId === moduleId)?.quantity ?? 1
}

function priceLabel(moduleId: string): string {
  const m = currentItem.value?.product.modules.find((x) => x.id === moduleId)
  if (!m) return ''
  if (m.priceType === 'per-unit') return `NT$ ${m.price}/${m.unit}`
  if (m.priceType === 'per-year') return `NT$ ${m.price.toLocaleString()}/${m.unit}`
  return '一次性'
}

function onToggle(moduleId: string) {
  if (!cartItemId.value) return
  cart.toggleModule(cartItemId.value, moduleId)
}

function onIncQty(moduleId: string) {
  if (!currentItem.value || !cartItemId.value) return
  const m = currentItem.value.product.modules.find((x) => x.id === moduleId)
  const sel = currentItem.value.moduleSelections.find((s) => s.moduleId === moduleId)
  if (!m || !sel) return
  const step = m.step ?? 1
  cart.setQuantity(cartItemId.value, moduleId, sel.quantity + step)
}

function onDecQty(moduleId: string) {
  if (!currentItem.value || !cartItemId.value) return
  const m = currentItem.value.product.modules.find((x) => x.id === moduleId)
  const sel = currentItem.value.moduleSelections.find((s) => s.moduleId === moduleId)
  if (!m || !sel) return
  const step = m.step ?? 1
  cart.setQuantity(cartItemId.value, moduleId, Math.max(step, sel.quantity - step))
}

function onAddToCart() {
  if (!cartItemId.value) return
  confirmed.value = true
  router.push('/app/cart')
}

function onCancel() {
  // onBeforeRouteLeave 會清
  router.push('/app/products')
}

const steps = computed<Step[]>(() =>
  upgradeDongle.value
    ? [
        { id: 1, title: '選擇 Dongle' },
        { id: 2, title: '配置升級' },
        { id: 3, title: '購物車' },
        { id: 4, title: '確認訂單' },
      ]
    : [
        { id: 1, title: '選擇產品' },
        { id: 2, title: '配置模組' },
        { id: 3, title: '購物車' },
        { id: 4, title: '確認訂單' },
      ],
)

const categoryLabel: Record<string, string> = {
  basic: '核心模組',
  device: '儀器接入',
  storage: '容量 / 授權',
  viewer: '檢視元件',
  ai: 'AI 模組',
  cloud: '雲端服務',
}

const modulesGrouped = computed(() => {
  if (!currentItem.value) return []
  const groups = new Map<string, typeof currentItem.value.product.modules>()
  for (const m of currentItem.value.product.modules) {
    if (!groups.has(m.category)) groups.set(m.category, [])
    groups.get(m.category)!.push(m)
  }
  return Array.from(groups.entries()).map(([category, modules]) => ({
    category,
    label: categoryLabel[category] ?? category,
    modules,
  }))
})

// sync licenseType UI
watch(
  () => currentItem.value?.licenseType,
  () => {},
)
</script>

<template>
  <div v-if="product && currentItem" class="bg-ebm-bg min-h-screen">
    <!-- Step indicator -->
    <div class="bg-white border-b border-ebm-border py-6">
      <div class="max-w-5xl mx-auto px-6">
        <EbmStepIndicator :steps="steps" :current-index="1" />
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-10">
      <!-- Product header -->
      <header class="mb-8 flex items-start gap-4">
        <div class="h-16 w-16 rounded-xl flex items-center justify-center text-white font-extrabold text-xl bg-ebm-gradient-accent flex-shrink-0">
          {{ product.logo }}
        </div>
        <div>
          <div class="flex items-center gap-2 mb-1">
            <div class="font-mono text-xs text-ebm-text-muted uppercase tracking-wider">{{ product.id }}</div>
            <span v-if="upgradeDongle" class="text-xs px-2 py-0.5 rounded-full bg-ebm-cta text-white font-bold">
              升級 · Dongle #{{ upgradeDongle }}
            </span>
          </div>
          <h1 class="text-3xl font-extrabold text-ebm-primary tracking-tight">{{ product.name }}</h1>
          <div class="text-sm text-ebm-text-muted">{{ product.taglineZh }} · {{ product.category }}</div>
        </div>
      </header>

      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Module groups -->
        <div class="lg:col-span-2 space-y-6">
          <EbmCard v-for="group in modulesGrouped" :key="group.category">
            <h3 class="text-lg font-bold text-ebm-primary mb-4">{{ group.label }}</h3>
            <div class="space-y-3">
              <label
                v-for="m in group.modules"
                :key="m.id"
                :class="[
                  'block rounded-xl border-2 p-4 transition-all cursor-pointer',
                  moduleStatus(m.id) !== 'unselected'
                    ? 'border-ebm-accent bg-blue-50/40'
                    : 'border-ebm-border bg-white hover:border-ebm-accent',
                ]"
              >
                <div class="flex items-start gap-3">
                  <input
                    type="checkbox"
                    :checked="moduleStatus(m.id) !== 'unselected'"
                    :disabled="m.isNecessary"
                    class="h-5 w-5 mt-0.5 rounded accent-ebm-accent"
                    @change="onToggle(m.id)"
                  >
                  <div class="flex-1">
                    <div class="flex items-start justify-between gap-4">
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                          <span class="font-mono text-xs px-2 py-0.5 rounded-md bg-ebm-bg text-ebm-text-muted">{{ m.id }}</span>
                          <span class="font-semibold text-ebm-primary">{{ m.name }}</span>
                          <EbmBadge v-if="m.isNecessary" variant="primary">必選</EbmBadge>
                          <EbmBadge v-if="m.isOnlyOne && !m.isNecessary" variant="neutral">限購 1 個</EbmBadge>
                        </div>
                        <div class="text-sm text-ebm-text-muted mt-1">{{ m.description }}</div>
                        <div v-if="m.detailDescription" class="text-xs text-ebm-text-muted mt-1 italic">
                          💡 {{ m.detailDescription }}
                        </div>
                        <div v-if="m.associatedModuleIds" class="text-xs text-ebm-accent mt-1">
                          🔗 自動帶入：{{ m.associatedModuleIds.join(', ') }}
                        </div>
                      </div>
                      <div class="text-right flex-shrink-0">
                        <div class="font-mono font-bold text-ebm-primary">
                          NT$ {{ format(cart.moduleSubtotal(currentItem, m.id)) }}
                        </div>
                        <div class="text-xs text-ebm-text-muted">{{ priceLabel(m.id) }}</div>
                      </div>
                    </div>

                    <!-- Per-unit quantity controls -->
                    <div
                      v-if="moduleStatus(m.id) !== 'unselected' && m.priceType === 'per-unit'"
                      class="flex items-center gap-2 mt-3"
                    >
                      <span class="text-xs text-ebm-text-muted">數量：</span>
                      <button
                        type="button"
                        class="h-8 w-8 rounded-md border border-ebm-border hover:border-ebm-accent text-ebm-text-muted"
                        @click.prevent="onDecQty(m.id)"
                      >−</button>
                      <div class="w-24 h-8 px-2 rounded-md border border-ebm-border text-sm text-center font-mono flex items-center justify-center">
                        {{ selectionQty(m.id).toLocaleString() }}
                      </div>
                      <button
                        type="button"
                        class="h-8 w-8 rounded-md border border-ebm-border hover:border-ebm-accent text-ebm-text-muted"
                        @click.prevent="onIncQty(m.id)"
                      >+</button>
                      <span class="text-xs text-ebm-text-muted">{{ m.unit }}（每 {{ m.step }} 為一檔）</span>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </EbmCard>
        </div>

        <!-- Right: Price Summary -->
        <div class="lg:sticky lg:top-6 lg:h-fit">
          <div class="bg-ebm-primary text-white rounded-xl p-6">
            <div class="text-xs text-white/60 uppercase tracking-widest mb-4">報價小計</div>

            <!-- License selector -->
            <div class="mb-5">
              <div class="text-xs text-white/70 mb-2">授權類型</div>
              <div class="space-y-1.5">
                <label v-for="lt in licenseOptions" :key="lt.type"
                  class="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio"
                    :checked="currentItem.licenseType === lt.type"
                    class="accent-ebm-cta"
                    @change="cart.setLicenseType(cartItemId!, lt.type)"
                  >
                  <span>{{ lt.label }}</span>
                  <span v-if="lt.discountRate" class="text-xs px-1.5 py-0.5 rounded-md bg-ebm-cta text-white ml-auto">
                    -{{ Math.round(lt.discountRate * 100) }}%
                  </span>
                </label>
              </div>
            </div>

            <div class="text-xs text-white/60 border-t border-white/20 pt-4 mb-2">
              已選 <strong class="text-white">{{ selectedCount }}</strong> 個模組
            </div>

            <div class="py-3 space-y-2 text-sm border-b border-white/20">
              <div class="flex justify-between text-white/70">
                <span>Buyout 小計</span>
                <span class="font-mono">NT$ {{ format(buyoutTotal) }}</span>
              </div>
              <div v-if="discount > 0" class="flex justify-between text-ebm-cta">
                <span>{{ currentLicense?.label }} 折扣</span>
                <span class="font-mono">− NT$ {{ format(discount) }}</span>
              </div>
            </div>

            <div class="pt-4">
              <div class="text-xs text-white/60">總計</div>
              <div class="text-3xl font-black font-mono mt-1">NT$ {{ format(itemTotal) }}</div>
              <div v-if="currentLicense?.days" class="text-xs text-white/60 mt-1">
                Day License · {{ currentLicense.days }} 天
              </div>
            </div>

            <EbmButton variant="primary" full-width class="mt-5" @click="onAddToCart">
              加入購物車 →
            </EbmButton>
            <button
              class="w-full mt-2 py-2 text-sm text-white/50 hover:text-white"
              @click="onCancel"
            >
              取消並返回
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

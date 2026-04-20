<script setup lang="ts">
/**
 * CartView — 購物車-訂購清單
 */
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth_v2'
import { licenseOptions } from '@/mocks/user'
import EbmButton from '@/components/ui/EbmButton.vue'
import EbmCard from '@/components/ui/EbmCard.vue'
import EbmStepIndicator, { type Step } from '@/components/ui/EbmStepIndicator.vue'

const cart = useCartStore()
const auth = useAuthStore()
const router = useRouter()

const steps: Step[] = [
  { id: 1, title: '選擇產品' },
  { id: 2, title: '配置模組' },
  { id: 3, title: '購物車' },
  { id: 4, title: '確認訂單' },
]

function format(n: number) {
  return Math.round(n).toLocaleString('en-US')
}

function licenseLabel(type: string) {
  return licenseOptions.find((l) => l.type === type)?.label ?? type
}

const canCheckout = computed(() => cart.items.length > 0)

function goCheckout() {
  if (canCheckout.value) router.push('/app/checkout')
}

function selectedModules(cartItemId: string) {
  const item = cart.items.find((i) => i.cartItemId === cartItemId)
  if (!item) return []
  return item.product.modules
    .filter((m) => {
      const sel = item.moduleSelections.find((s) => s.moduleId === m.id)
      return m.isNecessary || sel?.selected
    })
    .map((m) => {
      const sel = item.moduleSelections.find((s) => s.moduleId === m.id)
      return {
        id: m.id,
        name: m.name,
        description: m.description,
        price: m.price,
        quantity: sel?.quantity ?? 1,
        subtotal: cart.moduleSubtotal(item, m.id),
        priceType: m.priceType,
        unit: m.unit,
      }
    })
}
</script>

<template>
  <div class="bg-ebm-bg min-h-screen">
    <!-- Step indicator -->
    <div class="bg-white border-b border-ebm-border py-6">
      <div class="max-w-5xl mx-auto px-6">
        <EbmStepIndicator :steps="steps" :current-index="2" />
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-10">
      <h1 class="text-3xl font-extrabold text-ebm-primary tracking-tight mb-8">購物車 · 訂購清單</h1>

      <div v-if="cart.items.length === 0" class="text-center py-20">
        <div class="mx-auto h-20 w-20 rounded-full bg-ebm-bg flex items-center justify-center mb-6 text-4xl">🧺</div>
        <h3 class="text-xl font-bold text-ebm-primary mb-2">購物車是空的</h3>
        <p class="text-sm text-ebm-text-muted mb-6">瀏覽 EBM 產品型錄，挑選適合的解決方案。</p>
        <RouterLink to="/app/products">
          <EbmButton variant="primary">瀏覽產品 →</EbmButton>
        </RouterLink>
      </div>

      <div v-else class="grid lg:grid-cols-3 gap-6">
        <!-- Cart items -->
        <div class="lg:col-span-2 space-y-4">
          <EbmCard v-for="item in cart.items" :key="item.cartItemId" padding="sm">
            <!-- Item header -->
            <div class="px-2 py-3 flex justify-between items-center border-b border-ebm-border">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-xs bg-ebm-gradient-accent">
                  {{ item.product.logo }}
                </div>
                <div>
                  <div class="font-semibold text-ebm-primary">{{ item.product.name }}</div>
                  <div class="text-xs text-ebm-text-muted">
                    {{ item.isUpgrade ? `升級 · Dongle #${item.dongleId}` : '新購' }}
                    · {{ licenseLabel(item.licenseType) }}
                  </div>
                </div>
              </div>
              <button
                class="h-8 w-8 rounded-md hover:bg-ebm-bg text-ebm-text-muted hover:text-ebm-error transition-colors"
                :title="'移除 ' + item.product.name"
                @click="cart.remove(item.cartItemId)"
              >
                <svg class="h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
                </svg>
              </button>
            </div>

            <!-- Modules -->
            <div class="divide-y divide-ebm-border">
              <div v-for="sm in selectedModules(item.cartItemId)" :key="sm.id"
                class="px-2 py-2.5 flex justify-between items-center text-sm">
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <span class="font-mono text-xs px-2 py-0.5 rounded-md bg-ebm-bg text-ebm-text-muted flex-shrink-0">
                    {{ sm.id }}
                  </span>
                  <span class="truncate">
                    {{ sm.name }}
                    <span v-if="sm.priceType !== 'fixed'" class="text-xs text-ebm-text-muted">
                      × {{ sm.quantity.toLocaleString() }} {{ sm.unit }}
                    </span>
                  </span>
                </div>
                <span class="font-mono text-ebm-primary flex-shrink-0 ml-2">NT$ {{ format(sm.subtotal) }}</span>
              </div>
            </div>

            <!-- Item subtotal -->
            <div class="px-2 py-3 bg-ebm-bg -mx-4 -mb-4 mt-2 border-t border-ebm-border rounded-b-xl px-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-ebm-text-muted">小計</span>
                <div class="text-right">
                  <div v-if="cart.itemDiscount(item) > 0" class="text-xs text-ebm-text-muted">
                    Buyout: NT$ {{ format(cart.itemBuyoutTotal(item)) }} · 折扣: -NT$ {{ format(cart.itemDiscount(item)) }}
                  </div>
                  <div class="text-lg font-bold text-ebm-primary font-mono">
                    NT$ {{ format(cart.itemTotal(item)) }}
                  </div>
                </div>
              </div>
            </div>
          </EbmCard>

          <RouterLink to="/app/products" class="inline-block text-sm text-ebm-accent hover:underline">
            ← 繼續選購
          </RouterLink>
        </div>

        <!-- Right: Summary -->
        <div class="lg:sticky lg:top-6 lg:h-fit">
          <EbmCard>
            <h3 class="text-lg font-bold text-ebm-primary mb-4">訂購總覽</h3>
            <div class="space-y-2 text-sm mb-4">
              <div class="flex justify-between">
                <span class="text-ebm-text-muted">商品數</span>
                <span class="font-mono font-semibold">{{ cart.itemCount }} 項</span>
              </div>
              <div class="flex justify-between">
                <span class="text-ebm-text-muted">Buyout 總計</span>
                <span class="font-mono">NT$ {{ format(cart.grandBuyoutTotal) }}</span>
              </div>
              <div v-if="cart.grandDiscount > 0" class="flex justify-between text-ebm-cta">
                <span>授權折扣</span>
                <span class="font-mono">− NT$ {{ format(cart.grandDiscount) }}</span>
              </div>
            </div>
            <div class="pt-4 border-t border-ebm-border mb-4">
              <div class="text-xs text-ebm-text-muted">總計</div>
              <div class="text-3xl font-black text-ebm-primary font-mono mt-1">
                NT$ {{ format(cart.grandTotal) }}
              </div>
            </div>
            <div class="text-xs text-ebm-text-muted mb-5 p-3 bg-ebm-bg rounded-lg">
              💰 可用儲值金：<strong class="text-ebm-primary">NT$ {{ format(auth.user?.prepaidBalance ?? 0) }}</strong>
            </div>
            <EbmButton variant="primary" full-width :disabled="!canCheckout" @click="goCheckout">
              下一步 · 確認訂單 →
            </EbmButton>
          </EbmCard>
        </div>
      </div>
    </div>
  </div>
</template>

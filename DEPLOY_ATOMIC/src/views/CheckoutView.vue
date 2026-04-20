<script setup lang="ts">
/**
 * CheckoutView — 確認訂單並送出
 */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useOrderStore } from '@/stores/order'
import { licenseOptions } from '@/mocks/user'
import type { Order, PaymentMethod } from '@/types/models'
import EbmButton from '@/components/ui/EbmButton.vue'
import EbmCard from '@/components/ui/EbmCard.vue'
import EbmStepIndicator, { type Step } from '@/components/ui/EbmStepIndicator.vue'

const cart = useCartStore()
const auth = useAuthStore()
const orderStore = useOrderStore()
const router = useRouter()

const paymentMethod = ref<PaymentMethod>('bank-transfer')
const submitting = ref(false)
const note = ref('')

const steps: Step[] = [
  { id: 1, title: '選擇產品' },
  { id: 2, title: '配置模組' },
  { id: 3, title: '購物車' },
  { id: 4, title: '確認訂單' },
]

const canUsePrepaid = computed(() =>
  (auth.user?.prepaidBalance ?? 0) >= cart.grandTotal,
)

function format(n: number) {
  return Math.round(n).toLocaleString('en-US')
}

async function submit() {
  const firstItem = cart.items[0]
  if (!firstItem) return
  submitting.value = true

  // Mock 建立訂單 — 把 cart items 轉成 Order
  const licenseOpt = licenseOptions.find((l) => l.type === firstItem.licenseType)
  const total = cart.grandTotal

  const { orderId } = await cart.checkout()

  // 把第一個 item 當代表建 Order（mock 簡化）
  const newOrder: Order = {
    id: orderId,
    orderDate: new Date().toISOString(),
    total,
    paymentMethod: paymentMethod.value,
    status: paymentMethod.value === 'prepaid-balance' ? 'paid-not-burned' : 'pending-payment',
    dongleSerial: firstItem.dongleId ?? '8' + String(Math.floor(Math.random() * 999999)).padStart(6, '0'),
    productId: firstItem.product.id,
    productName: firstItem.product.name,
    isUpgrade: firstItem.isUpgrade,
    licenseType: firstItem.licenseType,
    purchaseDays: licenseOpt?.days ?? null,
    burned: false,
    items: firstItem.product.modules
      .filter((m) => m.isNecessary || firstItem.moduleSelections.find((s) => s.moduleId === m.id)?.selected)
      .map((m) => {
        const sel = firstItem.moduleSelections.find((s) => s.moduleId === m.id)!
        return {
          moduleId: m.id,
          moduleName: m.name,
          description: m.description,
          unitPrice: m.price,
          quantity: sel.quantity,
          subtotal: cart.moduleSubtotal(firstItem, m.id),
        }
      }),
  }
  orderStore.prependOrder(newOrder)

  submitting.value = false
  router.push({ path: '/app/orders/success', query: { id: orderId } })
}
</script>

<template>
  <div class="bg-ebm-bg min-h-screen">
    <div class="bg-white border-b border-ebm-border py-6">
      <div class="max-w-5xl mx-auto px-6">
        <EbmStepIndicator :steps="steps" :current-index="3" />
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-6 py-10">
      <h1 class="text-3xl font-extrabold text-ebm-primary tracking-tight mb-8">確認訂單</h1>

      <div v-if="cart.items.length === 0" class="text-center py-20 text-ebm-text-muted">
        購物車是空的，請先
        <RouterLink to="/app/products" class="text-ebm-accent hover:underline">挑選產品</RouterLink>。
      </div>

      <div v-else class="grid lg:grid-cols-3 gap-6">
        <!-- Order Summary -->
        <div class="lg:col-span-2 space-y-4">
          <EbmCard>
            <h3 class="text-lg font-bold text-ebm-primary mb-4">訂購商品</h3>
            <div v-for="item in cart.items" :key="item.cartItemId" class="py-3 border-b border-ebm-border last:border-0">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-xs bg-ebm-gradient-accent">
                    {{ item.product.logo }}
                  </div>
                  <div>
                    <div class="font-semibold text-ebm-primary">{{ item.product.name }}</div>
                    <div class="text-xs text-ebm-text-muted">
                      {{ item.isUpgrade ? '升級' : '新購' }} ·
                      {{ licenseOptions.find((l) => l.type === item.licenseType)?.label }}
                    </div>
                  </div>
                </div>
                <div class="font-mono font-bold text-ebm-primary">NT$ {{ format(cart.itemTotal(item)) }}</div>
              </div>
            </div>
          </EbmCard>

          <EbmCard>
            <h3 class="text-lg font-bold text-ebm-primary mb-4">付款方式</h3>
            <div class="space-y-3">
              <label
                class="flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer"
                :class="paymentMethod === 'bank-transfer' ? 'border-ebm-accent bg-blue-50/40' : 'border-ebm-border'"
              >
                <input type="radio" v-model="paymentMethod" value="bank-transfer" class="accent-ebm-accent">
                <div class="flex-1">
                  <div class="font-semibold text-ebm-primary">匯款</div>
                  <div class="text-xs text-ebm-text-muted mt-0.5">訂單送出後，將收到匯款帳戶資訊</div>
                </div>
              </label>
              <label
                class="flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer"
                :class="[
                  paymentMethod === 'prepaid-balance' ? 'border-ebm-accent bg-blue-50/40' : 'border-ebm-border',
                  !canUsePrepaid && 'opacity-50 cursor-not-allowed'
                ]"
              >
                <input
                  type="radio"
                  v-model="paymentMethod"
                  value="prepaid-balance"
                  class="accent-ebm-accent"
                  :disabled="!canUsePrepaid"
                >
                <div class="flex-1">
                  <div class="font-semibold text-ebm-primary">扣儲值金</div>
                  <div class="text-xs text-ebm-text-muted mt-0.5">
                    可用餘額：NT$ {{ format(auth.user?.prepaidBalance ?? 0) }}
                    <span v-if="!canUsePrepaid" class="text-ebm-error ml-1">（餘額不足，無法使用）</span>
                  </div>
                </div>
              </label>
            </div>
          </EbmCard>

          <EbmCard>
            <h3 class="text-lg font-bold text-ebm-primary mb-4">訂單備註（選填）</h3>
            <textarea
              v-model="note"
              rows="3"
              class="w-full px-4 py-2.5 rounded-lg border border-ebm-border text-sm focus:outline-none focus:border-ebm-accent focus:ring-4 focus:ring-ebm-accent/15"
              placeholder="發票抬頭、聯絡窗口、安裝地點等..."
            />
          </EbmCard>
        </div>

        <!-- Right: Final summary + submit -->
        <div class="lg:sticky lg:top-6 lg:h-fit">
          <EbmCard>
            <h3 class="text-lg font-bold text-ebm-primary mb-4">訂單總計</h3>
            <div class="space-y-2 text-sm mb-4">
              <div class="flex justify-between">
                <span class="text-ebm-text-muted">Buyout 小計</span>
                <span class="font-mono">NT$ {{ format(cart.grandBuyoutTotal) }}</span>
              </div>
              <div v-if="cart.grandDiscount > 0" class="flex justify-between text-ebm-cta">
                <span>授權折扣</span>
                <span class="font-mono">− NT$ {{ format(cart.grandDiscount) }}</span>
              </div>
            </div>
            <div class="pt-4 border-t border-ebm-border mb-5">
              <div class="text-xs text-ebm-text-muted">應付金額</div>
              <div class="text-3xl font-black text-ebm-primary font-mono mt-1">
                NT$ {{ format(cart.grandTotal) }}
              </div>
            </div>
            <EbmButton variant="primary" full-width :loading="submitting" @click="submit">
              {{ submitting ? '處理中...' : '送出訂單' }}
            </EbmButton>
            <RouterLink to="/app/cart" class="block text-center text-sm text-ebm-text-muted mt-3 hover:text-ebm-primary">
              ← 返回購物車
            </RouterLink>
          </EbmCard>
        </div>
      </div>
    </div>
  </div>
</template>

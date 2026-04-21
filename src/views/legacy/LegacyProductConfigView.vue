<script setup lang="ts">
/**
 * Legacy · 新購產品-自訂（1:1 照抄舊版 ASP.NET 頁面結構）
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import LegacyLayout from '@/layouts/LegacyLayout.vue'
import { useCartStore } from '@/stores/cart'
import { useProductStore } from '@/stores/product'
import { useAuthStore } from '@/stores/auth_v2'
import type { ProductModule } from '@/types/models'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cart = useCartStore()
const auth = useAuthStore()

const productId = computed(() => route.params.productId as string)
const product = computed(() =>
  productStore.products.find((p) => p.id === productId.value),
)

const cartItemId = ref<string | null>(null)
const showAll = ref(true)
const showDetailIds = ref<Set<string>>(new Set())
const isDayLicense = ref(false)
const dayLicenseCount = ref(0)
const lastIsDayLicense = ref(false)

onMounted(async () => {
  if (productStore.products.length === 0) {
    await productStore.fetchAll()
  }
  if (product.value) {
    const item = cart.addNewPurchase(product.value, 'buyout')
    cartItemId.value = item.cartItemId
  }
})

// 離開頁面時移除草稿 cart item，避免殘留
onBeforeUnmount(() => {
  if (cartItemId.value) {
    try {
      cart.remove(cartItemId.value)
    } catch {
      // ignore
    }
  }
})

const currentItem = computed(() =>
  cartItemId.value
    ? cart.items.find((i) => i.cartItemId === cartItemId.value)
    : null,
)

// 同步日計費狀態到 store
watch([isDayLicense, dayLicenseCount], ([isDay, days]) => {
  if (!cartItemId.value) return
  if (isDay) {
    cart.setLicenseType(cartItemId.value, days === 90 ? 'day90' : 'day365')
  } else if (lastIsDayLicense.value) {
    cart.setLicenseType(cartItemId.value, 'buyout')
  }
  lastIsDayLicense.value = isDay
})

const visibleModules = computed(() => {
  if (!product.value || !currentItem.value) return []
  if (showAll.value) return product.value.modules
  return product.value.modules.filter((m) => {
    const sel = currentItem.value!.moduleSelections.find((s) => s.moduleId === m.id)
    return m.isNecessary || sel?.selected
  })
})

const selectedModules = computed(() => {
  if (!product.value || !currentItem.value) return []
  return product.value.modules.filter((m) => {
    const sel = currentItem.value!.moduleSelections.find((s) => s.moduleId === m.id)
    return m.isNecessary || sel?.selected
  })
})

function selectionFor(moduleId: string) {
  return currentItem.value?.moduleSelections.find((s) => s.moduleId === moduleId)
}

function isSelected(moduleId: string) {
  const m = product.value?.modules.find(x => x.id === moduleId)
  if (!m) return false
  if (m.isNecessary) return true
  return selectionFor(moduleId)?.selected ?? false
}

function toggle(m: ProductModule) {
  if (!cartItemId.value || m.isNecessary) return
  cart.toggleModule(cartItemId.value, m.id)
}

function updateQuantity(m: ProductModule, event: Event) {
  if (!cartItemId.value || m.isOnlyOne) return
  const input = event.target as HTMLInputElement
  const qty = parseInt(input.value, 10)
  if (!isNaN(qty) && qty > 0) {
    cart.setQuantity(cartItemId.value, m.id, qty)
  } else {
    // 復原為目前數量
    input.value = String(quantityFor(m))
  }
}

function quantityFor(m: ProductModule) {
  return selectionFor(m.id)?.quantity ?? 1
}

function subtotalFor(m: ProductModule) {
  if (!currentItem.value) return 0
  return cart.moduleSubtotal(currentItem.value, m.id)
}

function toggleDetail(id: string) {
  const s = new Set(showDetailIds.value)
  if (s.has(id)) s.delete(id)
  else s.add(id)
  showDetailIds.value = s
}

function anchorLinkFor(id: string) {
  return `#MODULE-${id}`
}

function formatNum(n: number): string {
  return n.toLocaleString('en-US')
}

function quantityLabel(m: ProductModule): string {
  if (m.isOnlyOne) return '(限購1個)'
  if (m.priceType === 'per-unit' && m.step) return `(每 ${m.step} ${m.unit} 為一檔)`
  return ''
}

// 金額計算相關
const dayLicenseUnitPrice = computed(() => {
  if (!currentItem.value) return 0
  const buyoutTotal = cart.itemBuyoutTotal(currentItem.value)
  // 簡易模擬：買斷價 / 365 乘以 1.2 作為日單價
  return Math.round((buyoutTotal / 365) * 1.2)
})

const grandTotal = computed(() => {
  if (!currentItem.value) return 0
  if (isDayLicense.value) {
    return dayLicenseUnitPrice.value * dayLicenseCount.value
  }
  return cart.itemTotal(currentItem.value)
})

function forceRecalculate() {
  // Mock recalculate, reactive vars handle it natively
}

function clearAndRefill() {
  if (confirm('確定要清空重填嗎?')) {
    if (cartItemId.value && product.value) {
      cart.remove(cartItemId.value)
      const item = cart.addNewPurchase(product.value, 'buyout')
      cartItemId.value = item.cartItemId
      isDayLicense.value = false
      dayLicenseCount.value = 0
    }
  }
}
</script>

<template>
  <LegacyLayout v-if="product && currentItem">
    <!-- POC 切換 banner -->
    <div class="bg-amber-50 border border-amber-200 rounded p-2 mb-4 text-xs text-amber-900 flex items-center justify-between">
      <span>
        1:1 復刻版 · 功能／欄位／按鈕與 ASP.NET 舊系統完全一致。
      </span>
      <RouterLink
        :to="`/app/products/${productId}/configure`"
        class="underline font-semibold hover:text-amber-950"
      >
        切換到「現代化介面」版本 →
      </RouterLink>
    </div>

    <!-- Main content container relative for absolute sidebar -->
    <div class="relative w-full">
      <h2 class="text-[1.5em] font-bold text-black border-b border-[#ccc] pb-1 mb-4 italic">
        新購：{{ product.id }} - {{ product.name }}
        <span class="text-base font-normal text-gray-500 not-italic">(價格試算)</span>
      </h2>

      <!-- Left Column: Modules -->
      <div id="BUYPRODUCT_MODULES_WARPPER" class="border border-[#ccc] rounded p-2 bg-white" style="width: 780px;">
        <div class="m-1 px-2 py-1 text-sm">
          <button
            type="button"
            class="text-blue-700 hover:underline"
            :class="!showAll && 'font-bold underline'"
            @click="showAll = false"
          >
            只顯示已購買項目
          </button>
          <span class="mx-2 text-gray-400">|</span>
          <button
            type="button"
            class="text-blue-700 hover:underline"
            :class="showAll && 'font-bold underline'"
            @click="showAll = true"
          >
            顯示所有項目
          </button>
        </div>

        <div
          v-for="m in visibleModules"
          :key="m.id"
          :id="`MODULE-${m.id}`"
          class="m-1 p-2 border rounded bg-white transition-colors"
          :class="[
            isSelected(m.id)
              ? 'border-[#ff9900] bg-[#ff9900]'
              : 'border-[#ccc]',
            m.isNecessary && 'bg-orange-400 border-[#ff9900]',
          ]"
        >
          <div class="flex items-start gap-3">
            <div class="w-10 flex flex-col items-center flex-shrink-0 pt-1">
              <input
                type="checkbox"
                class="h-4 w-4"
                :checked="isSelected(m.id)"
                :disabled="m.isNecessary"
                @change="toggle(m)"
              >
              <div v-if="m.isNecessary" class="text-[10px] text-gray-800 font-bold mt-1">
                (必選)
              </div>
            </div>

            <div class="flex-shrink-0" style="width: 300px;">
              <div class="px-1 py-1 font-bold flex text-black">
                <div class="flex-shrink-0 font-mono text-sm" style="width: 7em;">{{ m.id }}</div>
                <div class="text-sm">{{ m.name }}</div>
              </div>
              <div class="px-1 py-0.5 text-xs text-gray-600 float-left" style="max-width: 200px;" :class="isSelected(m.id) ? 'text-black' : ''">
                {{ m.description }}
              </div>
              <div class="px-1 py-0.5 text-right float-right">
                <button
                  type="button"
                  class="text-xs text-blue-700 hover:underline"
                  @click="toggleDetail(m.id)"
                >
                  詳細說明
                </button>
              </div>
              <div class="clear-both"></div>
              <div
                v-show="showDetailIds.has(m.id) && m.detailDescription"
                class="px-1 py-1 text-xs text-gray-700 bg-gray-50 rounded mt-1 border border-gray-200"
              >
                {{ m.detailDescription }}
              </div>
            </div>

            <div class="flex-shrink-0 px-2" style="width: 110px;">
              <div class="text-sm font-bold text-black border-b border-gray-100 mb-1" :class="isSelected(m.id) ? 'border-orange-200' : ''">單價</div>
              <div class="flex mt-1">
                <span class="text-sm font-bold" style="width: 25px;">NT</span>
                <span class="flex-1 text-right font-mono text-sm font-bold" style="width: 60px;">
                  {{ formatNum(m.price) }}
                </span>
              </div>
            </div>

            <div class="flex-shrink-0 px-2" style="width: 80px;">
              <div class="text-sm font-bold text-black border-b border-gray-100 mb-1" :class="isSelected(m.id) ? 'border-orange-200' : ''">數量</div>
              <input
                type="text"
                class="w-14 h-7 border border-gray-300 text-right font-mono text-sm px-2 mt-1 bg-white"
                :readonly="m.isOnlyOne"
                :value="quantityFor(m)"
                @change="updateQuantity(m, $event)"
              >
              <div class="text-[10px] text-gray-800 mt-0.5">
                {{ quantityLabel(m) }}
              </div>
            </div>

            <div class="flex-shrink-0 px-2 ml-auto" style="width: 130px;">
              <div class="text-sm font-bold text-black border-b border-gray-100 mb-1 text-right" :class="isSelected(m.id) ? 'border-orange-200' : ''">小計</div>
              <div class="flex mt-1 justify-end">
                <span class="text-sm font-bold" style="width: 25px;">NT</span>
                <span class="text-right font-mono text-sm font-bold text-black ml-1">
                  {{ formatNum(subtotalFor(m)) }}
                </span>
              </div>
            </div>
          </div>

          <!-- 必須先購買 (Depend) -->
          <div
            v-if="m.dependModuleIds?.length"
            class="mt-2 text-xs text-gray-800 font-bold"
          >
            <span class="font-bold">必須先購買：</span>
            <template v-for="(depId, idx) in m.dependModuleIds" :key="depId">
              <span v-if="idx > 0" class="mx-1 font-normal">和</span>
              <a
                :href="anchorLinkFor(depId)"
                class="hover:underline"
                :class="isSelected(depId) ? 'text-green-600' : 'text-red-600'"
              >
                {{ depId }}({{ isSelected(depId) ? '已購買' : '尚未購買' }})
              </a>
            </template>
          </div>

          <!-- 關聯子項目 (Against) -->
          <div
            v-if="m.associatedModuleIds?.length"
            class="mt-1 text-xs text-gray-800"
          >
            <span class="font-semibold text-gray-900">關聯子項目：</span>
            <template v-for="(assocId, idx) in m.associatedModuleIds" :key="assocId">
              <a
                :href="anchorLinkFor(assocId)"
                class="text-blue-700 hover:underline inline-block mx-0.5"
              >
                {{ assocId }}
              </a>
              <span v-if="idx < m.associatedModuleIds.length - 1">,</span>
            </template>
          </div>
        </div>

        <div v-if="visibleModules.length === 0" class="m-3 p-3 text-center text-sm text-gray-500">
          目前沒有已購買的項目。點「顯示所有項目」查看全部可選模組。
        </div>
      </div>

      <!-- Right Column: Sidebar (Absolute positioning like old system) -->
      <div id="BUYPRODUCT_SIDEBAR_WARPPER" class="absolute top-0 right-0" style="width: 150px; height: 100%;">
        <div id="BUYPRODUCT_SIDEBAR" class="sticky top-4 w-full">
          <!-- 金額面板 -->
          <div class="p-1 border border-[#ccc] bg-[#000080] text-white text-sm font-bold mb-0">金額</div>
          <div class="p-1 border border-[#ccc] border-t-0 bg-white">
            
            <div class="p-1 align-bottom">
              <input id="UseDayLicense" type="checkbox" v-model="isDayLicense" class="mr-1">
              <label for="UseDayLicense">以日計費</label>
            </div>

            <div v-show="isDayLicense" class="mt-1">
              <div class="p-1 text-black">
                <div class="font-bold">以日計費-單價</div>
                <div class="float-left" style="width: 3em;">NT</div>
                <div class="float-left text-right" style="width: 5em;">{{ formatNum(dayLicenseUnitPrice) }}</div>
                <div class="clear-both"></div>
              </div>
              <div class="p-1 text-red-600 font-bold mb-2">           
                <label for="DayLicenseCount" class="block mb-1">購買日數</label>
                <input id="DayLicenseCount" type="number" v-model.number="dayLicenseCount" class="w-12 text-right border border-gray-400 px-1">
              </div>
            </div>

            <div class="p-1 text-red-600 font-bold text-sm bg-gray-50 border border-red-100 rounded">
              <div>應付金額</div>
              <div class="float-left" style="width: 2em;">NT</div>
              <div class="float-left text-right text-base" style="width: 5.5em;">{{ formatNum(grandTotal) }}</div>
              <div class="clear-both"></div>
              <a href="javascript:void(0);" @click="forceRecalculate" class="block text-[9px] text-blue-700 hover:underline mt-1">(重新計算)</a>
            </div>

            <div class="p-1 mt-2">
              <input type="button" value="僅供評估價格" disabled class="w-full bg-gray-200 text-gray-500 border border-gray-300 rounded text-xs py-1" title="此序號僅為評估價格使用，不可用於實際購買">
            </div>

            <div class="p-1 mt-1 text-xs">
              <div class="font-bold">可用儲值金額</div>
              <div class="float-left" style="width: 3em;">NT</div>
              <div class="float-left text-right" style="width: 5em;">{{ formatNum(auth.user?.prepaidBalance ?? 0) }}</div>  
              <div class="clear-both"></div>
            </div>
          </div>

          <!-- 操作按鈕 -->
          <div class="p-2 border border-[#ccc] bg-white mt-3 flex flex-col gap-1">
            <input type="button" value="套用產品套裝" class="w-full py-1 px-2 border border-gray-400 bg-[#efefef] rounded-sm text-xs cursor-pointer hover:bg-gray-200">
            <input type="button" value="儲存自訂產品套裝" class="w-full py-1 px-2 border border-gray-400 bg-[#efefef] rounded-sm text-xs cursor-pointer hover:bg-gray-200">
            <input type="button" value="清空重填" @click="clearAndRefill" class="w-full py-1 px-2 border border-gray-400 bg-[#efefef] rounded-sm text-xs cursor-pointer hover:bg-gray-200">
            <input type="button" value="回Dongle列表" @click="router.push('/legacy/dongles')" class="w-full py-1 px-2 border border-gray-400 bg-[#efefef] rounded-sm text-xs cursor-pointer hover:bg-gray-200 mt-1">
          </div>

          <!-- 已選項目 -->
          <div class="p-1 border border-[#ccc] bg-gray-500 text-white text-sm font-bold mt-3 mb-0">已選項目</div>
          <div class="p-2 border border-[#ccc] border-t-0 bg-white" style="max-height: 400px; overflow-y: auto;">
            <div v-for="m in selectedModules" :key="m.id" class="text-black text-[11px] mb-1 leading-snug">
              <a :href="anchorLinkFor(m.id)" class="text-blue-700 hover:underline break-words" :title="`${m.id} ${m.name}\n${m.description}`">
                {{ m.name }}
              </a>
              <span class="text-gray-600 ml-1">x{{ quantityFor(m) }}</span>
            </div>
          </div>

        </div>
      </div>
      <div class="clear-both pb-20"></div>
    </div>
  </LegacyLayout>

  <div v-else class="max-w-4xl mx-auto px-6 py-20 text-center text-gray-500">
    找不到產品 {{ productId }}。
    <RouterLink to="/app/products" class="text-blue-700 hover:underline ml-2">回產品列表</RouterLink>
  </div>
</template>

<style scoped>
/* Mock old system styles */
input[type="button"] {
  font-family: inherit;
}
</style>

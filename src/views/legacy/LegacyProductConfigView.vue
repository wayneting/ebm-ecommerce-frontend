<script setup lang="ts">
/**
 * Legacy · 新購產品-自訂（1:1 照抄舊版 ASP.NET 頁面結構）
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import LegacyLayout from '@/layouts/LegacyLayout.vue'
import { useCartStore } from '@/stores/cart'
import { useProductStore } from '@/stores/product'
import type { ProductModule } from '@/types/models'

const route = useRoute()
const productStore = useProductStore()
const cart = useCartStore()

const productId = computed(() => route.params.productId as string)
const product = computed(() =>
  productStore.products.find((p) => p.id === productId.value),
)

const cartItemId = ref<string | null>(null)
const showAll = ref(true)
const showDetailIds = ref<Set<string>>(new Set())

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
  if (cartItemId.value) cart.remove(cartItemId.value)
})

const currentItem = computed(() =>
  cartItemId.value
    ? cart.items.find((i) => i.cartItemId === cartItemId.value)
    : null,
)

const visibleModules = computed(() => {
  if (!product.value || !currentItem.value) return []
  if (showAll.value) return product.value.modules
  return product.value.modules.filter((m) => {
    const sel = currentItem.value!.moduleSelections.find((s) => s.moduleId === m.id)
    return m.isNecessary || sel?.selected
  })
})

function selectionFor(moduleId: string) {
  return currentItem.value?.moduleSelections.find((s) => s.moduleId === moduleId)
}

function isSelected(m: ProductModule) {
  if (m.isNecessary) return true
  return selectionFor(m.id)?.selected ?? false
}

function toggle(m: ProductModule) {
  if (!cartItemId.value || m.isNecessary) return
  cart.toggleModule(cartItemId.value, m.id)
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

    <!-- Main content -->
    <div>
      <h2 class="text-[1.5em] font-bold text-black border-b border-[#ccc] pb-1 mb-4 italic">
        新購：{{ product.id }} - {{ product.name }}
        <span class="text-base font-normal text-gray-500 not-italic">(價格試算)</span>
      </h2>

      <div class="border border-[#ccc] rounded p-2 bg-white" style="width: 100%; max-width: 820px;">
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
            isSelected(m)
              ? 'border-blue-700 bg-blue-50/40'
              : 'border-[#ccc]',
            m.isNecessary && 'bg-blue-50/60 border-blue-700',
          ]"
        >
          <div class="flex items-start gap-3">
            <div class="w-10 flex flex-col items-center flex-shrink-0 pt-1">
              <input
                type="checkbox"
                class="h-4 w-4 accent-blue-700"
                :checked="isSelected(m)"
                :disabled="m.isNecessary"
                @change="toggle(m)"
              >
              <div v-if="m.isNecessary" class="text-[10px] text-gray-500 mt-1">
                (必選)
              </div>
            </div>

            <div class="flex-shrink-0" style="width: 300px;">
              <div class="px-1 py-1 font-bold flex text-black">
                <div class="flex-shrink-0 font-mono text-sm" style="width: 7em;">{{ m.id }}</div>
                <div class="text-sm">{{ m.name }}</div>
              </div>
              <div class="px-1 py-0.5 text-xs text-gray-600 float-left" style="max-width: 200px;">
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
              <div class="text-sm font-bold text-black border-b border-gray-100 mb-1">單價</div>
              <div class="flex mt-1">
                <span class="text-sm" style="width: 25px;">NT</span>
                <span class="flex-1 text-right font-mono text-sm" style="width: 60px;">
                  {{ formatNum(m.price) }}
                </span>
              </div>
            </div>

            <div class="flex-shrink-0 px-2" style="width: 80px;">
              <div class="text-sm font-bold text-black border-b border-gray-100 mb-1">數量</div>
              <input
                type="text"
                class="w-14 h-7 border border-gray-300 text-right font-mono text-sm px-2 mt-1 bg-white"
                readonly
                :value="quantityFor(m)"
              >
              <div class="text-[10px] text-gray-500 mt-0.5">
                {{ quantityLabel(m) }}
              </div>
            </div>

            <div class="flex-shrink-0 px-2 ml-auto" style="width: 130px;">
              <div class="text-sm font-bold text-black border-b border-gray-100 mb-1 text-right">小計</div>
              <div class="flex mt-1 justify-end">
                <span class="text-sm" style="width: 25px;">NT</span>
                <span class="text-right font-mono text-sm font-bold text-black ml-1">
                  {{ formatNum(subtotalFor(m)) }}
                </span>
              </div>
            </div>
          </div>

          <div
            v-if="m.associatedModuleIds?.length"
            class="pl-14 mt-2 text-xs text-gray-700"
          >
            <span class="font-semibold text-gray-900">關聯子項目：</span>
            <template v-for="(assocId, idx) in m.associatedModuleIds" :key="assocId">
              <a
                :href="anchorLinkFor(assocId)"
                class="text-blue-700 hover:underline"
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
    </div>
  </LegacyLayout>

  <div v-else class="max-w-4xl mx-auto px-6 py-20 text-center text-gray-500">
    找不到產品 {{ productId }}。
    <RouterLink to="/app/products" class="text-blue-700 hover:underline ml-2">回產品列表</RouterLink>
  </div>
</template>

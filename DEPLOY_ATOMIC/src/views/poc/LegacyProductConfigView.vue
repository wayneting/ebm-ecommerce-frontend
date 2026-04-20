<script setup lang="ts">
/**
 * POC · 新購產品-自訂（照抄舊版 ASP.NET 頁面結構）
 *
 * 對照舊系統 HTML：「EBMtech 電子商務平臺 - 線上購買/升級軟體產品 - 新購產品-自訂.html」
 *
 * 做法：結構、欄位、按鈕文字、操作流程 1:1 複製舊版；只把視覺套到 Tailwind v4 + EBM tokens。
 * 用於與現有獨立模組版本 (/app/products/:id/configure) 並行對比。
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
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
  <div v-if="product && currentItem" class="bg-white min-h-screen">
    <!-- 頁面標題區（對應舊版 titlebar / h1 / menu） -->
    <div class="bg-white border-b border-ebm-border">
      <!-- 右上快速連結（對應舊版 titlebar） -->
      <div class="max-w-6xl mx-auto px-6 py-2 text-xs text-right border-b border-ebm-border">
        <RouterLink to="/app/cart" class="text-ebm-accent hover:underline">購物車({{ cart.itemCount }})</RouterLink>
        <span class="mx-2 text-ebm-text-muted">|</span>
        <RouterLink to="/app/orders" class="text-ebm-accent hover:underline">訂單列表</RouterLink>
        <span class="mx-2 text-ebm-text-muted">|</span>
        <RouterLink to="/app/dongles" class="text-ebm-accent hover:underline">Dongle列表</RouterLink>
        <span class="mx-2 text-ebm-text-muted">|</span>
        <span class="font-bold text-ebm-primary">vivi( Vivi )</span>
        <span class="mx-2 text-ebm-text-muted">|</span>
        <RouterLink to="/app/account" class="text-ebm-accent hover:underline">帳戶設定</RouterLink>
        <span class="mx-2 text-ebm-text-muted">|</span>
        <RouterLink to="/admin" class="text-ebm-accent hover:underline">管理界面</RouterLink>
        <span class="mx-2 text-ebm-text-muted">|</span>
        <a href="#" class="text-ebm-accent hover:underline">登出</a>
      </div>

      <!-- 主 Header + Menu（對應舊版 header + menucontainer） -->
      <div class="max-w-6xl mx-auto px-6 pt-4">
        <h1 class="text-2xl font-bold text-ebm-primary">EBMtech 電子商務平臺</h1>
      </div>
      <div class="max-w-6xl mx-auto px-6 flex gap-0 border-b border-ebm-border mt-3">
        <RouterLink
          to="/app"
          class="px-4 py-2 text-sm border-t border-l border-r border-ebm-border -mb-px text-ebm-text-muted hover:text-ebm-primary rounded-t"
        >
          首頁
        </RouterLink>
        <RouterLink
          to="/app/products"
          class="px-4 py-2 text-sm border-t border-l border-r border-ebm-border -mb-px text-ebm-text-muted hover:text-ebm-primary rounded-t"
        >
          產品列表
        </RouterLink>
        <RouterLink
          to="/app/upgrade"
          class="px-4 py-2 text-sm border-t border-l border-r border-ebm-border border-b-0 -mb-px bg-white text-ebm-primary font-semibold rounded-t"
        >
          新購/升級產品
        </RouterLink>
      </div>
    </div>

    <!-- POC 切換 banner -->
    <div class="bg-amber-50 border-b border-amber-200">
      <div class="max-w-6xl mx-auto px-6 py-2 text-xs text-amber-900 flex items-center justify-between">
        <span>
          POC · 此頁為「舊版結構照抄」實作，功能／欄位／按鈕與 ASP.NET 舊系統 1:1 對應，僅套用 EBM design tokens 視覺。
        </span>
        <RouterLink
          :to="`/app/products/${productId}/configure`"
          class="underline font-semibold hover:text-amber-950"
        >
          切換到現有「獨立模組」版本 →
        </RouterLink>
      </div>
    </div>

    <!-- Main content -->
    <div class="max-w-6xl mx-auto px-6 py-4">
      <!-- 頁面標題（對應舊版 <h2>） -->
      <h2 class="text-xl font-bold text-ebm-primary mb-3">
        新購：{{ product.id }} - {{ product.name }}
        <span class="text-base font-normal text-ebm-text-muted">(價格試算)</span>
      </h2>

      <!-- Module wrapper（對應舊版 BUYPRODUCT_MODULES_WARPPER） -->
      <div class="border border-ebm-border rounded p-2 bg-white" style="width: 100%; max-width: 820px;">
        <!-- 顯示切換（對應舊版 "只顯示已購買項目 | 顯示所有項目"） -->
        <div class="m-1 px-2 py-1 text-sm">
          <button
            type="button"
            class="text-ebm-accent hover:underline"
            :class="!showAll && 'font-bold underline'"
            @click="showAll = false"
          >
            只顯示已購買項目
          </button>
          <span class="mx-2 text-ebm-text-muted">|</span>
          <button
            type="button"
            class="text-ebm-accent hover:underline"
            :class="showAll && 'font-bold underline'"
            @click="showAll = true"
          >
            顯示所有項目
          </button>
        </div>

        <!-- Module blocks (v-for) -->
        <div
          v-for="m in visibleModules"
          :key="m.id"
          :id="`MODULE-${m.id}`"
          class="m-1 p-2 border rounded bg-white transition-colors"
          :class="[
            isSelected(m)
              ? 'border-ebm-accent bg-blue-50/40'
              : 'border-ebm-border',
            m.isNecessary && 'bg-blue-50/60 border-ebm-accent',
          ]"
        >
          <div class="flex items-start gap-3">
            <!-- [1] Checkbox col (40px) -->
            <div class="w-10 flex flex-col items-center flex-shrink-0 pt-1">
              <input
                type="checkbox"
                class="h-4 w-4 accent-ebm-accent"
                :checked="isSelected(m)"
                :disabled="m.isNecessary"
                @change="toggle(m)"
              >
              <div v-if="m.isNecessary" class="text-[10px] text-ebm-text-muted mt-1">
                (必選)
              </div>
            </div>

            <!-- [2] Info col (300px) -->
            <div class="flex-shrink-0" style="width: 300px;">
              <div class="px-1 py-1 font-bold flex text-ebm-primary">
                <div class="flex-shrink-0 font-mono text-sm" style="width: 7em;">{{ m.id }}</div>
                <div class="text-sm">{{ m.name }}</div>
              </div>
              <div class="px-1 py-0.5 text-xs text-ebm-text-muted float-left" style="max-width: 200px;">
                {{ m.description }}
              </div>
              <div class="px-1 py-0.5 text-right float-right">
                <button
                  type="button"
                  class="text-xs text-ebm-accent hover:underline"
                  @click="toggleDetail(m.id)"
                >
                  詳細說明
                </button>
              </div>
              <div class="clear-both"></div>
              <div
                v-show="showDetailIds.has(m.id) && m.detailDescription"
                class="px-1 py-1 text-xs text-ebm-text bg-ebm-bg rounded mt-1"
              >
                {{ m.detailDescription }}
              </div>
            </div>

            <!-- [3] 單價 col -->
            <div class="flex-shrink-0 px-2" style="width: 110px;">
              <div class="text-sm font-bold text-ebm-primary">單價</div>
              <div class="flex mt-1">
                <span class="text-sm" style="width: 25px;">NT</span>
                <span class="flex-1 text-right font-mono text-sm" style="width: 60px;">
                  {{ formatNum(m.price) }}
                </span>
              </div>
            </div>

            <!-- [4] 數量 col -->
            <div class="flex-shrink-0 px-2" style="width: 80px;">
              <div class="text-sm font-bold text-ebm-primary">數量</div>
              <input
                type="text"
                class="w-14 h-7 border border-ebm-border text-right font-mono text-sm px-2 mt-1 bg-white"
                readonly
                :value="quantityFor(m)"
              >
              <div class="text-[10px] text-ebm-text-muted mt-0.5">
                {{ quantityLabel(m) }}
              </div>
            </div>

            <!-- [5] 小計 col (right-aligned) -->
            <div class="flex-shrink-0 px-2 ml-auto" style="width: 130px;">
              <div class="text-sm font-bold text-ebm-primary">小計</div>
              <div class="flex mt-1">
                <span class="text-sm" style="width: 25px;">NT</span>
                <span class="flex-1 text-right font-mono text-sm font-bold text-ebm-primary">
                  {{ formatNum(subtotalFor(m)) }}
                </span>
              </div>
            </div>
          </div>

          <!-- 關聯子項目（對應舊版 DEPEND_NOTE） -->
          <div
            v-if="m.associatedModuleIds?.length"
            class="pl-14 mt-2 text-xs text-ebm-text"
          >
            <span class="font-semibold">關聯子項目：</span>
            <template v-for="(assocId, idx) in m.associatedModuleIds" :key="assocId">
              <a
                :href="anchorLinkFor(assocId)"
                class="text-ebm-accent hover:underline"
              >
                {{ assocId }}
              </a>
              <span v-if="idx < m.associatedModuleIds.length - 1">,</span>
            </template>
          </div>
        </div>

        <div v-if="visibleModules.length === 0" class="m-3 p-3 text-center text-sm text-ebm-text-muted">
          目前沒有已購買的項目。點「顯示所有項目」查看全部可選模組。
        </div>
      </div>
    </div>

    <!-- Footer（對應舊版 footer） -->
    <div class="max-w-6xl mx-auto px-6 py-4 mt-4 border-t border-ebm-border text-xs text-ebm-text-muted">
      <span>Copyright (C) 2010 EBM Technologies. All Rights Reserved.</span>
      <span class="ml-4">
        <a href="http://www.ebmtech.com/" class="text-ebm-accent hover:underline">www.ebmtech.com</a>
      </span>
    </div>
  </div>

  <div v-else class="max-w-4xl mx-auto px-6 py-20 text-center text-ebm-text-muted">
    找不到產品 {{ productId }}。
    <RouterLink to="/app/products" class="text-ebm-accent hover:underline ml-2">回產品列表</RouterLink>
  </div>
</template>

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { CartItem, LicenseType, ModuleSelection, Product } from '@/types/models'
import { licenseOptions } from '@/mocks/user'

/**
 * Cart Store
 *
 * 負責：
 * - 新增 / 更新 / 移除 購物車 item
 * - 計算每個模組 subtotal、cart item 小計、總計、折扣
 * - 「必選」模組自動勾選
 * - 「關聯子項目」模組選主帶子
 * - 儲值金扣款模擬
 *
 * Mock：資料全存 ref，重整會清空（真實環境應持久化到後端 `/api/shopping-cart/detail`）
 */
export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  // ───── Helpers ─────
  function newCartItemId() {
    return 'ci_' + Date.now() + '_' + Math.floor(Math.random() * 1000)
  }

  function initialSelections(product: Product): ModuleSelection[] {
    return product.modules.map((m) => ({
      moduleId: m.id,
      selected: m.isNecessary,
      quantity: m.priceType === 'per-unit'
        ? Math.max(m.step ?? 1, 1)
        : 1,
    }))
  }

  function findSelection(item: CartItem, moduleId: string) {
    return item.moduleSelections.find((s) => s.moduleId === moduleId)
  }

  // ───── Actions ─────
  function addNewPurchase(product: Product, licenseType: LicenseType = 'buyout') {
    const item: CartItem = {
      cartItemId: newCartItemId(),
      product,
      dongleId: null,
      isUpgrade: false,
      licenseType,
      moduleSelections: initialSelections(product),
      createdAt: new Date().toISOString(),
    }
    items.value.push(item)
    return item
  }

  function addUpgrade(product: Product, dongleId: string, licenseType: LicenseType = 'buyout') {
    const item: CartItem = {
      cartItemId: newCartItemId(),
      product,
      dongleId,
      isUpgrade: true,
      licenseType,
      moduleSelections: initialSelections(product),
      createdAt: new Date().toISOString(),
    }
    items.value.push(item)
    return item
  }

  function remove(cartItemId: string) {
    items.value = items.value.filter((i) => i.cartItemId !== cartItemId)
  }

  function clear() {
    items.value = []
  }

  function toggleModule(cartItemId: string, moduleId: string) {
    const item = items.value.find((i) => i.cartItemId === cartItemId)
    if (!item) return
    const sel = findSelection(item, moduleId)
    const module = item.product.modules.find((m) => m.id === moduleId)
    if (!sel || !module) return
    if (module.isNecessary) return // 必選不可取消
    sel.selected = !sel.selected

    // 關聯子項目：selected 時自動帶出，unselect 時不動（保守）
    if (sel.selected && module.associatedModuleIds) {
      for (const assocId of module.associatedModuleIds) {
        const assocSel = findSelection(item, assocId)
        if (assocSel) assocSel.selected = true
      }
    }
  }

  function setQuantity(cartItemId: string, moduleId: string, qty: number) {
    const item = items.value.find((i) => i.cartItemId === cartItemId)
    if (!item) return
    const sel = findSelection(item, moduleId)
    const module = item.product.modules.find((m) => m.id === moduleId)
    if (!sel || !module) return
    const step = module.step ?? 1
    const safe = Math.max(step, Math.round(qty / step) * step)
    sel.quantity = safe
  }

  function setLicenseType(cartItemId: string, licenseType: LicenseType) {
    const item = items.value.find((i) => i.cartItemId === cartItemId)
    if (item) item.licenseType = licenseType
  }

  // ───── Computed ─────
  const moduleSubtotal = (item: CartItem, moduleId: string): number => {
    const module = item.product.modules.find((m) => m.id === moduleId)
    const sel = findSelection(item, moduleId)
    if (!module || !sel) return 0
    if (!sel.selected && !module.isNecessary) return 0
    if (module.priceType === 'per-unit') return module.price * sel.quantity
    if (module.priceType === 'per-year') return module.price * sel.quantity
    return module.price
  }

  const itemBuyoutTotal = (item: CartItem): number =>
    item.product.modules.reduce((sum, m) => sum + moduleSubtotal(item, m.id), 0)

  const itemDiscount = (item: CartItem): number => {
    const opt = licenseOptions.find((l) => l.type === item.licenseType)
    if (!opt) return 0
    return Math.round(itemBuyoutTotal(item) * opt.discountRate)
  }

  const itemTotal = (item: CartItem): number => itemBuyoutTotal(item) - itemDiscount(item)

  const itemCount = computed(() => items.value.length)
  const grandBuyoutTotal = computed(() =>
    items.value.reduce((sum, it) => sum + itemBuyoutTotal(it), 0),
  )
  const grandDiscount = computed(() =>
    items.value.reduce((sum, it) => sum + itemDiscount(it), 0),
  )
  const grandTotal = computed(() =>
    items.value.reduce((sum, it) => sum + itemTotal(it), 0),
  )

  async function checkout() {
    // Mock：延遲後清空購物車，回傳假訂單號
    await new Promise((r) => setTimeout(r, 800))
    const orderId = '000' + String(Math.floor(Math.random() * 100000)).padStart(5, '0')
    clear()
    return { orderId }
  }

  return {
    items,
    itemCount,
    grandBuyoutTotal, grandDiscount, grandTotal,
    addNewPurchase, addUpgrade, remove, clear,
    toggleModule, setQuantity, setLicenseType,
    moduleSubtotal, itemBuyoutTotal, itemDiscount, itemTotal,
    checkout,
  }
})

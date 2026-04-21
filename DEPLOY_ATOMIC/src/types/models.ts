/**
 * 前端領域模型（domain model）
 *
 * 這些型別是**前端用的乾淨結構**，不是 api.json 的 raw schema。
 * 原因：api.json 的欄位用 PascalCase、帶一堆後端內部欄位，不適合直接用。
 * 這一層用 camelCase + 業務導向命名，store 層負責轉換。
 *
 * 未來後端對接時：
 *   - 在 store 的 async action 裡做 api.* → domain model 的 mapper
 *   - view 層永遠只看 domain model，不碰 api schema
 */

// ========= User =========
export interface User {
  userId: string
  displayName: string
  email: string
  phone: string
  prepaidBalance: number // 儲值金
  language: 'zh-TW' | 'en-US'
  isAdmin: boolean
}

// ========= Product =========
export interface Product {
  id: string // PROD001
  name: string // EBM PACS
  category: string // Medical Imaging Storage
  taglineZh: string
  description: string
  logo: string // 2-char abbrev
  basePrice: number // 起始價（展示用）
  modules: ProductModule[]
}

export type ModuleCategory = 'basic' | 'device' | 'storage' | 'viewer' | 'ai' | 'cloud'
export type PriceType = 'fixed' | 'per-unit' | 'per-year'

export interface ProductModule {
  id: string // BA001
  name: string // Basic Module
  description: string
  detailDescription?: string
  category: ModuleCategory
  priceType: PriceType
  price: number
  unit?: string // 筆 / 年 / 個
  step?: number // 每 N 為一檔
  isNecessary: boolean
  isOnlyOne: boolean
  maxQuantity?: number
  associatedModuleIds?: string[] // 選此必帶（關聯子項目）
  dependModuleIds?: string[] // 必須先購買（前置條件）
  requiresOneOf?: string[][] // 選此必選至少一組（陣列 of 陣列）
}

// ========= Cart =========
export interface CartItem {
  cartItemId: string
  product: Product
  dongleId: string | null // 升級 = 關聯現有 Dongle；新購 = null（下單時配新序號）
  isUpgrade: boolean
  licenseType: LicenseType
  /** 每個模組的選購狀態與數量 */
  moduleSelections: ModuleSelection[]
  createdAt: string
}

export interface ModuleSelection {
  moduleId: string
  selected: boolean
  quantity: number
}

export type LicenseType = 'buyout' | 'day90' | 'day365'

export interface LicenseOption {
  type: LicenseType
  label: string
  days: number | null
  discountRate: number // 0 = no discount, 0.75 = 75% off
}

// ========= Dongle =========
export interface Dongle {
  serial: string // 8000001
  productId: string // PROD001
  productName: string
  status: DongleStatus
  inCart: boolean
  latestOrderId: string | null
  latestOrderDate: string | null
  installedModules: InstalledModule[] // 目前已燒錄功能
  purchaseDays: number // 剩餘天數（Day License）；null 代表 Buyout
  expireDate: string | null
  licenseType: LicenseType
}

export type DongleStatus = 'active' | 'in-cart' | 'trial' | 'expired' | 'disabled'

export interface InstalledModule {
  moduleId: string
  moduleName: string
  description: string
  quantity: number
}

// ========= Order =========
export interface Order {
  id: string // 00010605
  orderDate: string
  total: number
  paymentMethod: PaymentMethod
  status: OrderStatus
  dongleSerial: string
  productId: string
  productName: string
  isUpgrade: boolean
  licenseType: LicenseType
  purchaseDays: number | null
  items: OrderItem[]
  burned: boolean // 是否已燒錄
}

export interface OrderItem {
  moduleId: string
  moduleName: string
  description: string
  unitPrice: number
  quantity: number
  subtotal: number
}

export type PaymentMethod = 'bank-transfer' | 'prepaid-balance'
export type OrderStatus =
  | 'pending-payment'
  | 'paid-not-burned'
  | 'paid-burned'
  | 'cancelled'
  | 'refunded'

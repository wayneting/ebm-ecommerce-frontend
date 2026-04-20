/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * API Response → Domain Model mapper
 *
 * 後端 EBMECAPI 用 PascalCase（ID / Name / Detial_Description...）
 * 前端 domain model 用 camelCase（id / name / detailDescription）
 *
 * Stores 的 fetchXxx 在 await apiClient.post() 後呼叫這裡的 mapper，
 * 讓 view 層永遠只看 camelCase 乾淨結構。
 */

import type {
  User,
  Product,
  ProductModule,
  ModuleCategory,
  Order,
  OrderItem,
  Dongle,
  InstalledModule,
  LicenseType,
  OrderStatus,
  PaymentMethod,
} from '@/types/models'

function categoryOf(id: string): ModuleCategory {
  if (id.startsWith('BA')) return 'basic'
  if (id.startsWith('DI')) return 'device'
  if (id.startsWith('SI')) return 'storage'
  if (id.startsWith('VU')) return 'viewer'
  if (id.startsWith('AI')) return 'ai'
  if (id.startsWith('CLOUD')) return 'cloud'
  return 'basic'
}

export function mapUser(raw: any): User {
  return {
    userId: raw?.UserID ?? '',
    displayName: raw?.DisplayName ?? raw?.Name ?? '',
    email: raw?.Email ?? '',
    phone: raw?.Phone ?? '',
    prepaidBalance: Number(raw?.Prepaid ?? 0),
    language: raw?.Language === 'en-US' ? 'en-US' : 'zh-TW',
    isAdmin: Boolean(raw?.IsAdmin),
  }
}

export function mapModule(raw: any): ProductModule {
  const priceFromInfo = raw?.ModulePriceTypeInfos?.[0]?.PriceFormular
  const price = Number(priceFromInfo ?? raw?.Price ?? 0) || 0
  const id: string = raw?.ID ?? ''
  return {
    id,
    name: raw?.Name ?? '',
    description: raw?.Description ?? '',
    detailDescription: raw?.Detial_Description || raw?.Detial_Description2 || undefined,
    category: categoryOf(id),
    priceType: 'fixed',
    price,
    isNecessary: Boolean(raw?.IsNecessary),
    isOnlyOne: Boolean(raw?.IsOnlyOne),
    maxQuantity: raw?.IsOnlyOne ? 1 : undefined,
    associatedModuleIds:
      (raw?.AgainstOrderIDs as string[] | undefined) ?? undefined,
  }
}

export function mapProduct(raw: any): Product {
  const name: string = raw?.Name ?? ''
  return {
    id: raw?.ID ?? '',
    name,
    category: raw?.Category ?? '',
    taglineZh: raw?.TaglineZh ?? '',
    description: raw?.Description ?? '',
    logo: name.slice(0, 2).toUpperCase(),
    basePrice: Number(raw?.BasePrice ?? 0),
    modules: (raw?.ModuleInfos ?? []).map(mapModule),
  }
}

function mapOrderItem(raw: any): OrderItem {
  return {
    moduleId: raw?.ModuleID ?? '',
    moduleName: raw?.ModuleName ?? '',
    description: raw?.Description ?? '',
    unitPrice: Number(raw?.UnitPrice ?? 0),
    quantity: Number(raw?.Quantity ?? 1),
    subtotal: Number(raw?.Subtotal ?? 0),
  }
}

export function mapOrder(raw: any): Order {
  return {
    id: raw?.OrderNumber ?? String(raw?.Id ?? ''),
    orderDate: raw?.OrderDate ?? '',
    total: Number(raw?.Total ?? 0),
    paymentMethod: (raw?.PaymentMethod === 'PrepaidBalance'
      ? 'prepaid-balance'
      : 'bank-transfer') as PaymentMethod,
    status: (raw?.Status ?? 'pending-payment') as OrderStatus,
    dongleSerial: raw?.DongleSerial ?? '',
    productId: raw?.ProductID ?? '',
    productName: raw?.ProductName ?? '',
    isUpgrade: Boolean(raw?.IsUpgrade),
    licenseType: (raw?.LicenseType ?? 'buyout') as LicenseType,
    purchaseDays: raw?.PurchaseDays ?? null,
    burned: Boolean(raw?.Burned),
    items: (raw?.Items ?? []).map(mapOrderItem),
  }
}

function mapInstalledModule(raw: any): InstalledModule {
  return {
    moduleId: raw?.ModuleID ?? '',
    moduleName: raw?.ModuleName ?? '',
    description: raw?.Description ?? '',
    quantity: Number(raw?.Quantity ?? 1),
  }
}

export function mapDongle(raw: any): Dongle {
  return {
    serial: raw?.Serial ?? '',
    productId: raw?.ProductID ?? '',
    productName: raw?.ProductName ?? '',
    status: raw?.Status ?? 'active',
    inCart: Boolean(raw?.InCart),
    latestOrderId: raw?.LatestOrderID ?? null,
    latestOrderDate: raw?.LatestOrderDate ?? null,
    licenseType: (raw?.LicenseType ?? 'buyout') as LicenseType,
    purchaseDays: Number(raw?.PurchaseDays ?? 0),
    expireDate: raw?.ExpireDate ?? null,
    installedModules: (raw?.InstalledModules ?? []).map(mapInstalledModule),
  }
}

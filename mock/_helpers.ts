/**
 * Mock shared helpers — 把 camelCase seed 轉成 PascalCase API schema。
 *
 * Mock handlers 會 import 這裡的 mapper，確保回應格式 = EBMECAPI v1 契約。
 * Store 層拿到 API response 時會再 map 回 domain model（camelCase）。
 */

import type { Product, ProductModule, Order, Dongle } from '../src/types/models'

// ProductModule → BuyProductModuleInfo（PascalCase）
export function moduleToBuyInfo(m: ProductModule, parentProductId: string) {
  return {
    ParentProductID: parentProductId,
    ID: m.id,
    Name: m.name,
    Description: m.description,
    Detial_Description: m.detailDescription ?? '',
    IsOnlyOne: m.isOnlyOne,
    IsNecessary: m.isNecessary,
    Currency: 'NT',
    AgainstOrderIDJoinValues: '',
    AgainstOrderIDs: (m.associatedModuleIds ?? []) as string[],
    IsUpgrade: false,
    AllowOrderLogicRule: '',
    Selected: m.isNecessary,
    OrderAmount: m.isNecessary ? 1 : 0,
    AlreadyOrderAmount: 0,
    Price: m.price,
    Subtotal: m.isNecessary ? m.price : 0,
    AllowOrder: true,
  }
}

// Product → BuyProductInfo
export function productToBuyInfo(product: Product, opts: { serial?: string; isUpgrade?: boolean } = {}) {
  const necessaryTotal = product.modules
    .filter((m) => m.isNecessary)
    .reduce((s, m) => s + m.price, 0)

  return {
    ProductSetEditMode: 'None',
    Serial: opts.serial ?? 'EvaluationDongle',
    ID: product.id,
    Name: product.name,
    UseDayLicense: false,
    DayLicenseCount: 0,
    IsUpgrade: opts.isUpgrade ?? false,
    ActionTypeDescription: opts.isUpgrade ? '升級' : '新購',
    SourceProductSetKey: '00000000-0000-0000-0000-000000000000',
    ProductID: product.id,
    OldTotal: 0,
    NewTotal: necessaryTotal,
    LicenseExpiredDate: null,
    RemainDayLicenseCount: 0,
    OldUnitPriceForDayLicense: 0,
    OldTotalForDayLicense: 0,
    TotalForDayLicense: Math.round(necessaryTotal * 0.25), // 假設 Day License 優惠 75%
    TotalForBuyoutLicense: necessaryTotal,
    UpgradeCostForDayLicense: 0,
    UnitPriceForDayLicense: 0,
    ModuleInfos: product.modules.map((m) => moduleToBuyInfo(m, product.id)),
  }
}

// Product → ProductInfo (simpler, for list)
export function productToProductInfo(product: Product) {
  return {
    ID: product.id,
    Name: product.name,
    ModuleInfos: product.modules.map((m) => ({
      ParentProductID: product.id,
      ID: m.id,
      Name: m.name,
      Description: m.description,
      Detial_Description: m.detailDescription ?? '',
      Detial_Description2: '',
      IsOnlyOne: m.isOnlyOne,
      IsNecessary: m.isNecessary,
      ModulePriceTypeInfos: [
        {
          PriceTypeID: m.priceType === 'fixed' ? 1 : 2,
          PriceTypeDesc: m.priceType,
          PriceFormular: String(m.price),
        },
      ],
      AgainstOrders: '',
      AllowOrderLogicRule: '',
    })),
  }
}

// Order → OrderInfo
export function orderToPascal(o: Order) {
  return {
    Id: parseInt(o.id, 10),
    OrderNumber: o.id,
    OrderDate: o.orderDate,
    Total: o.total,
    PaymentMethod: o.paymentMethod === 'bank-transfer' ? 'BankTransfer' : 'PrepaidBalance',
    Status: o.status,
    StatusId: statusCodeOf(o.status),
    DongleSerial: o.dongleSerial,
    ProductID: o.productId,
    ProductName: o.productName,
    IsUpgrade: o.isUpgrade,
    LicenseType: o.licenseType,
    PurchaseDays: o.purchaseDays,
    Burned: o.burned,
    Items: o.items.map((it) => ({
      ModuleID: it.moduleId,
      ModuleName: it.moduleName,
      Description: it.description,
      UnitPrice: it.unitPrice,
      Quantity: it.quantity,
      Subtotal: it.subtotal,
    })),
  }
}

function statusCodeOf(s: Order['status']): number {
  return { 'pending-payment': 1, 'paid-not-burned': 2, 'paid-burned': 3, cancelled: 4, refunded: 5 }[s] ?? 0
}

// Dongle → WarehouseInfo
export function dongleToPascal(d: Dongle) {
  return {
    Serial: d.serial,
    ProductID: d.productId,
    ProductName: d.productName,
    Status: d.status,
    InCart: d.inCart,
    LatestOrderID: d.latestOrderId,
    LatestOrderDate: d.latestOrderDate,
    LicenseType: d.licenseType,
    PurchaseDays: d.purchaseDays,
    ExpireDate: d.expireDate,
    InstalledModules: d.installedModules.map((m) => ({
      ModuleID: m.moduleId,
      ModuleName: m.moduleName,
      Description: m.description,
      Quantity: m.quantity,
    })),
  }
}

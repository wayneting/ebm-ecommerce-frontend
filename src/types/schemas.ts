/**
 * API Schema Aliases
 *
 * 把 openapi-typescript 自動產生的 `components["schemas"]["Xxx"]` 取短名，
 * 讓 store 層寫 mapper 時清爽一點。
 *
 * 使用：
 *   import type { ProductInfo, LoginRequest } from '@/types/schemas'
 *
 * 自動更新：
 *   npx openapi-typescript "../api-prod.json" -o src/types/api.ts
 */

import type { components } from '@/types/api'

type S = components['schemas']

export type LoginRequest = S['LoginRequest']
export type EmptyRequest = S['EmptyRequest']
export type IdRequest = S['IdRequest']
export type IntIdRequest = S['IntIdRequest']
export type GuidKeyRequest = S['GuidKeyRequest']

export type ProductInfo = S['ProductInfo']
export type ModuleInfo = S['ModuleInfo']
export type ModulePriceTypeInfo = S['ModulePriceTypeInfo']
export type ModuleSortInfo = S['ModuleSortInfo']

export type BuyProductInfo = S['BuyProductInfo']
export type BuyProductModuleInfo = S['BuyProductModuleInfo']
export type ProductSetEditMode = S['ProductSetEditMode']

export type GetBuyNewRequest = S['GetBuyNewRequest']
export type GetBuyNewWithSetRequest = S['GetBuyNewWithSetRequest']
export type GetBuyUpgradeRequest = S['GetBuyUpgradeRequest']
export type EditCartRequest = S['EditCartRequest']
export type EditProductSetRequest = S['EditProductSetRequest']

export type DeleteShoppingCartItemRequest = S['DeleteShoppingCartItemRequest']
export type ChangeOrderStatusRequest = S['ChangeOrderStatusRequest']

export type GetReportRequest = S['GetReportRequest']
export type GetUserReportRequest = S['GetUserReportRequest']

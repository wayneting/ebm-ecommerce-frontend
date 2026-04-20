/**
 * Production mock server 啟動入口
 *
 * 研發測試階段：讓 production build 也走 mock，確保 Cloud Run 上能看到假資料（81 模組 / 訂單 / Dongle）。
 * 真正接後端 API 時：把 `.env.production` 的 VITE_USE_MOCK 改為 false，重新 build 即可關閉。
 */
import { createProdMockServer } from 'vite-plugin-mock/client'

import authMock from '../mock/auth'
import productMock from '../mock/product'
import buyMock from '../mock/buy'
import shoppingCartMock from '../mock/shoppingCart'
import orderMock from '../mock/order'
import warehouseMock from '../mock/warehouse'
import userMock from '../mock/user'

export function setupProdMockServer() {
  createProdMockServer([
    ...authMock,
    ...productMock,
    ...buyMock,
    ...shoppingCartMock,
    ...orderMock,
    ...warehouseMock,
    ...userMock,
  ])
}

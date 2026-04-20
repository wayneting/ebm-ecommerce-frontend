import { type MockMethod } from 'vite-plugin-mock'
import { findProductById } from '../src/mocks/products'
import { productToBuyInfo } from './_helpers'

// 簡易 in-memory 購物車狀態（每次重啟 dev server 會清空）
const cartItems: Array<{ CartKey: string; Serial: string; ProductID: string }> = [
  { CartKey: 'ck_demo_001', Serial: '8000001', ProductID: 'PROD001' },
]

export default [
  {
    url: '/ECAPI/api/shopping-cart/detail',
    method: 'post',
    response: () => {
      const items = cartItems
        .map((c) => {
          const p = findProductById(c.ProductID)
          if (!p) return null
          const buy = productToBuyInfo(p, { serial: c.Serial })
          return { ...buy, CartKey: c.CartKey }
        })
        .filter(Boolean)
      const total = items.reduce((s, it) => s + (it?.TotalForBuyoutLicense ?? 0), 0)
      return {
        Items: items,
        TotalCount: items.length,
        GrandTotal: total,
        PrepaidBalance: 50_000,
      }
    },
  },
  {
    url: '/ECAPI/api/shopping-cart/delete',
    method: 'post',
    response: ({ body }: { body: { Key?: string } }) => {
      const key = body?.Key
      const idx = cartItems.findIndex((c) => c.CartKey === key)
      if (idx >= 0) cartItems.splice(idx, 1)
      return { Success: true }
    },
  },
  {
    url: '/ECAPI/api/shopping-cart/checkout',
    method: 'post',
    response: () => {
      const orderId = '000' + String(Math.floor(Math.random() * 100000)).padStart(5, '0')
      cartItems.length = 0
      return {
        Success: true,
        OrderID: orderId,
        OrderNumber: orderId,
        Message: '訂單建立成功',
      }
    },
  },
] as MockMethod[]

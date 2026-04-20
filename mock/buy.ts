import { type MockMethod } from 'vite-plugin-mock'
import { findProductById, products } from '../src/mocks/products'
import { productToBuyInfo } from './_helpers'

export default [
  {
    url: '/ECAPI/api/buy/select-product',
    method: 'post',
    response: () => ({
      Items: products.map((p) => ({ ID: p.id, Name: p.name })),
    }),
  },
  {
    url: '/ECAPI/api/buy/select-productset',
    method: 'post',
    response: () => ({ Items: [] }),
  },
  {
    url: '/ECAPI/api/buy/new',
    method: 'post',
    response: ({ body }: { body: { ProductId?: string; Serial?: string } }) => {
      const p = findProductById(body?.ProductId ?? '')
      if (!p) return null
      return productToBuyInfo(p, { serial: body?.Serial, isUpgrade: false })
    },
  },
  {
    url: '/ECAPI/api/buy/new-with-set',
    method: 'post',
    response: ({ body }: { body: { ProductId?: string; Serial?: string } }) => {
      const p = findProductById(body?.ProductId ?? '')
      if (!p) return null
      return productToBuyInfo(p, { serial: body?.Serial, isUpgrade: false })
    },
  },
  {
    url: '/ECAPI/api/buy/upgrade',
    method: 'post',
    response: ({ body }: { body: { Serial?: string } }) => {
      // 升級流程：假設升級 PROD001
      const p = findProductById('PROD001')
      if (!p) return null
      return productToBuyInfo(p, { serial: body?.Serial ?? '8000001', isUpgrade: true })
    },
  },
  {
    url: '/ECAPI/api/buy/validate-count-total',
    method: 'post',
    response: ({ body }: { body: { ModuleInfos?: Array<{ Selected: boolean; Price: number; OrderAmount: number }> } }) => {
      const mods = body?.ModuleInfos ?? []
      const selected = mods.filter((m) => m.Selected)
      const total = selected.reduce((s, m) => s + m.Price * (m.OrderAmount || 1), 0)
      return {
        NewTotal: total,
        TotalForBuyoutLicense: total,
        TotalForDayLicense: Math.round(total * 0.25),
        ModuleInfos: mods.map((m) => ({ ...m, Subtotal: m.Selected ? m.Price * (m.OrderAmount || 1) : 0 })),
      }
    },
  },
  {
    url: '/ECAPI/api/buy/use-productset-and-validate-count-total',
    method: 'post',
    response: ({ body }: { body: { ModuleInfos?: unknown[] } }) => ({
      ModuleInfos: body?.ModuleInfos ?? [],
      NewTotal: 0,
    }),
  },
  {
    url: '/ECAPI/api/buy/edit/cart',
    method: 'post',
    response: ({ body }: { body: { CartKey?: string } }) => {
      const p = findProductById('PROD001')
      if (!p) return null
      return productToBuyInfo(p, { serial: body?.CartKey })
    },
  },
  {
    url: '/ECAPI/api/buy/edit/productset',
    method: 'post',
    response: () => ({ Success: true }),
  },
  {
    url: '/ECAPI/api/buy/save',
    method: 'post',
    response: () => ({
      Success: true,
      CartKey: 'cart_' + Date.now(),
      Message: '已加入購物車',
    }),
  },
] as MockMethod[]

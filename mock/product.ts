import { type MockMethod } from 'vite-plugin-mock'
import { products, findProductById } from '../src/mocks/products'
import { productToProductInfo } from './_helpers'

export default [
  {
    url: '/ECAPI/api/admin/products/list',
    method: 'post',
    response: () => ({
      Items: products.map(productToProductInfo),
      TotalCount: products.length,
    }),
  },
  {
    url: '/ECAPI/api/admin/products/detail',
    method: 'post',
    response: ({ body }: { body: { Id?: string | number } }) => {
      const id = String(body?.Id ?? '')
      const p = findProductById(id)
      return p ? productToProductInfo(p) : null
    },
  },
  {
    url: '/ECAPI/api/admin/products/table',
    method: 'post',
    response: () => ({
      Items: products.map((p) => ({
        ID: p.id,
        Name: p.name,
        ModuleCount: p.modules.length,
        BasePrice: p.basePrice,
      })),
      TotalCount: products.length,
    }),
  },
  {
    url: '/ECAPI/api/admin/products/modules',
    method: 'post',
    response: ({ body }: { body: { Id?: string } }) => {
      const p = findProductById(body?.Id ?? '')
      if (!p) return { Modules: [] }
      return { Modules: productToProductInfo(p).ModuleInfos }
    },
  },
] as MockMethod[]

import { type MockMethod } from 'vite-plugin-mock'
import { userOrders } from '../src/mocks/orders'
import { orderToPascal } from './_helpers'

export default [
  {
    url: '/ECAPI/api/orders/list',
    method: 'post',
    response: () => ({
      Items: userOrders.map(orderToPascal),
      TotalCount: userOrders.length,
    }),
  },
  {
    url: '/ECAPI/api/admin/orders/list',
    method: 'post',
    response: () => ({
      Items: userOrders.map(orderToPascal),
      TotalCount: userOrders.length,
    }),
  },
  {
    url: '/ECAPI/api/orders/detail',
    method: 'post',
    response: ({ body }: { body: { Id?: number | string } }) => {
      const id = String(body?.Id ?? '')
      const o = userOrders.find((x) => x.id === id || parseInt(x.id, 10) === Number(id))
      return o ? orderToPascal(o) : null
    },
  },
  {
    url: '/ECAPI/api/orders/cancel',
    method: 'post',
    response: () => ({ Success: true }),
  },
  {
    url: '/ECAPI/api/admin/orders/status',
    method: 'post',
    response: ({ body }: { body: { Id?: number; StatusId?: number } }) => ({
      Success: true,
      Id: body?.Id ?? 0,
      StatusId: body?.StatusId ?? 0,
    }),
  },
] as MockMethod[]

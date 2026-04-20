import { type MockMethod } from 'vite-plugin-mock'
import { userDongles } from '../src/mocks/dongles'
import { dongleToPascal } from './_helpers'

export default [
  {
    url: '/ECAPI/api/warehouse/list',
    method: 'post',
    response: () => ({
      Items: userDongles.map(dongleToPascal),
      TotalCount: userDongles.length,
    }),
  },
  {
    url: '/ECAPI/api/admin/warehouse/list',
    method: 'post',
    response: () => ({
      Items: userDongles.map(dongleToPascal),
      TotalCount: userDongles.length,
    }),
  },
  {
    url: '/ECAPI/api/admin/warehouse/assign',
    method: 'post',
    response: () => ({ Success: true }),
  },
  {
    url: '/ECAPI/api/warehouse/notes',
    method: 'post',
    response: () => ({ Notes: [] }),
  },
  {
    url: '/ECAPI/api/warehouse/notes/update',
    method: 'post',
    response: () => ({ Success: true }),
  },
  {
    url: '/ECAPI/api/admin/warehouse/delete',
    method: 'post',
    response: () => ({ Success: true }),
  },
] as MockMethod[]

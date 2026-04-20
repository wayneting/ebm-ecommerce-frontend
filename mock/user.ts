import { type MockMethod } from 'vite-plugin-mock'
import { mockUser } from '../src/mocks/user'
import { adminUsers, registrations } from '../src/mocks/admin'

export default [
  {
    url: '/ECAPI/api/users/list',
    method: 'post',
    response: () => ({
      Items: adminUsers.map((u) => ({
        UserID: u.userId,
        DisplayName: u.displayName,
        Email: u.email,
        Phone: u.phone,
        Prepaid: u.prepaidBalance,
        Language: u.language,
        IsAdmin: u.isAdmin,
        CreatedAt: u.createdAt,
        LastLoginAt: u.lastLoginAt,
        Status: u.status,
      })),
      TotalCount: adminUsers.length,
    }),
  },
  {
    url: '/ECAPI/api/users/detail',
    method: 'post',
    response: () => ({
      UserID: mockUser.userId,
      DisplayName: mockUser.displayName,
      Email: mockUser.email,
      Phone: mockUser.phone,
      Prepaid: mockUser.prepaidBalance,
      Language: mockUser.language,
      IsAdmin: mockUser.isAdmin,
    }),
  },
  {
    url: '/ECAPI/api/users/create',
    method: 'post',
    response: () => ({ Success: true, UserID: 'new_user_' + Date.now() }),
  },
  {
    url: '/ECAPI/api/users/edit',
    method: 'post',
    response: () => ({ Success: true }),
  },
  {
    url: '/ECAPI/api/users/delete',
    method: 'post',
    response: () => ({ Success: true }),
  },
  {
    url: '/ECAPI/api/users/prepaid',
    method: 'post',
    response: () => ({ Balance: mockUser.prepaidBalance }),
  },
  {
    url: '/ECAPI/api/users/access',
    method: 'post',
    response: () => ({ Roles: mockUser.isAdmin ? ['admin', 'user'] : ['user'] }),
  },
  {
    url: '/ECAPI/api/users/me/password',
    method: 'post',
    response: () => ({ Success: true }),
  },
  // Register （註冊審核）
  {
    url: '/ECAPI/api/register',
    method: 'post',
    response: () => ({ Success: true, Message: '申請已送出' }),
  },
  {
    url: '/ECAPI/api/register/info',
    method: 'post',
    response: ({ body }: { body: { Id?: number } }) => {
      const r = registrations.find((x) => x.id === body?.Id)
      if (!r) return null
      return {
        Id: r.id,
        UserID: r.userId,
        DisplayName: r.displayName,
        Email: r.email,
        Phone: r.phone,
        Company: r.company,
        AppliedAt: r.appliedAt,
        Status: r.status,
        Note: r.note ?? '',
      }
    },
  },
  {
    url: '/ECAPI/api/admin/register/list',
    method: 'post',
    response: () => ({
      Items: registrations.map((r) => ({
        Id: r.id,
        UserID: r.userId,
        DisplayName: r.displayName,
        Email: r.email,
        Phone: r.phone,
        Company: r.company,
        AppliedAt: r.appliedAt,
        Status: r.status,
        Note: r.note ?? '',
      })),
      TotalCount: registrations.length,
    }),
  },
  {
    url: '/ECAPI/api/admin/register/accept',
    method: 'post',
    response: () => ({ Success: true }),
  },
  {
    url: '/ECAPI/api/admin/register/ignore',
    method: 'post',
    response: () => ({ Success: true }),
  },
] as MockMethod[]

import { type MockMethod } from 'vite-plugin-mock'
import { mockUser } from '../src/mocks/user'

export default [
  {
    url: '/ECAPI/api/auth/login',
    method: 'post',
    response: ({ body }: { body: { UserID?: string; Password?: string } }) => ({
      Token: 'mock_jwt_' + Date.now(),
      UserID: body?.UserID ?? mockUser.userId,
      Name: mockUser.displayName,
      IsAdmin: mockUser.isAdmin,
    }),
  },
  {
    url: '/ECAPI/api/auth/logout',
    method: 'post',
    response: () => ({ Success: true }),
  },
  {
    url: '/ECAPI/api/auth/me',
    method: 'post',
    response: () => ({
      UserID: mockUser.userId,
      Name: mockUser.displayName,
      DisplayName: mockUser.displayName,
      Email: mockUser.email,
      Phone: mockUser.phone,
      Prepaid: mockUser.prepaidBalance,
      Language: mockUser.language,
      IsAdmin: mockUser.isAdmin,
    }),
  },
  {
    url: '/ECAPI/api/auth/checkLoginStatus',
    method: 'post',
    response: () => ({ LoggedIn: true }),
  },
  {
    url: '/ECAPI/api/auth/forgot-password',
    method: 'post',
    response: () => ({ Success: true, Message: '已寄發重設密碼信' }),
  },
] as MockMethod[]

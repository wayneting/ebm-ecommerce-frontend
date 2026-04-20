import type { User, LicenseOption } from '@/types/models'

export const mockUser: User = {
  userId: 'vivi',
  displayName: 'Vivi',
  email: 'vivi@ebmtech.com',
  phone: '716',
  prepaidBalance: 50_000,
  language: 'zh-TW',
  isAdmin: false,
}

export const licenseOptions: LicenseOption[] = [
  { type: 'buyout', label: 'Buyout（買斷）', days: null, discountRate: 0 },
  { type: 'day365', label: 'Day License 365 天', days: 365, discountRate: 0.5 },
  { type: 'day90', label: 'Day License 90 天', days: 90, discountRate: 0.75 },
]

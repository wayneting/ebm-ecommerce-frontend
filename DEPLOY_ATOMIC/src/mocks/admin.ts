/**
 * Admin-only mock data
 */
import type { User } from '@/types/models'

export interface AdminUser extends User {
  createdAt: string
  lastLoginAt: string | null
  status: 'active' | 'disabled' | 'pending'
}

export interface Registration {
  id: number
  userId: string
  displayName: string
  email: string
  phone: string
  company: string
  appliedAt: string
  status: 'pending' | 'accepted' | 'ignored'
  note?: string
}

export const adminUsers: AdminUser[] = [
  { userId: 'vivi', displayName: 'Vivi', email: 'vivi@ebmtech.com', phone: '716', prepaidBalance: 50_000, language: 'zh-TW', isAdmin: false, createdAt: '2024-06-12', lastLoginAt: '2026-04-17T10:12:00', status: 'active' },
  { userId: 'admin', displayName: 'Administrator', email: 'admin@ebmtech.com', phone: '700', prepaidBalance: 0, language: 'zh-TW', isAdmin: true, createdAt: '2023-01-01', lastLoginAt: '2026-04-17T14:30:00', status: 'active' },
  { userId: 'wayne', displayName: 'Wayne Ting', email: 'wayne@ebmtech.com', phone: '728', prepaidBalance: 100_000, language: 'zh-TW', isAdmin: true, createdAt: '2024-03-05', lastLoginAt: '2026-04-17T19:40:00', status: 'active' },
  { userId: 'dr_chen', displayName: '陳醫師', email: 'chen@hospital-a.com', phone: '2388-1000', prepaidBalance: 20_000, language: 'zh-TW', isAdmin: false, createdAt: '2025-08-20', lastLoginAt: '2026-04-10T08:05:00', status: 'active' },
  { userId: 'test01', displayName: 'Test Account', email: 'test@example.com', phone: '', prepaidBalance: 0, language: 'en-US', isAdmin: false, createdAt: '2026-02-14', lastLoginAt: null, status: 'disabled' },
]

export const registrations: Registration[] = [
  { id: 1001, userId: 'newhospital_it', displayName: '李 IT', email: 'it@newhospital.com', phone: '07-123-4567', company: '高雄某醫院', appliedAt: '2026-04-16T11:23:00', status: 'pending', note: '欲評估 MobiPACS 行動方案' },
  { id: 1002, userId: 'clinic_kaoh', displayName: '張醫師', email: 'k-chang@clinic-k.com', phone: '07-222-3333', company: '高雄某診所', appliedAt: '2026-04-15T09:40:00', status: 'pending' },
  { id: 1003, userId: 'central_pm', displayName: '王 PM', email: 'pm@central-hospital.com', phone: '04-2233-1234', company: '某醫學中心', appliedAt: '2026-04-14T16:50:00', status: 'accepted' },
  { id: 1004, userId: 'suspicious', displayName: 'Spam Robot', email: 'asdf@tempmail.com', phone: '', company: '', appliedAt: '2026-04-13T03:12:00', status: 'ignored', note: '自動判定可疑' },
]

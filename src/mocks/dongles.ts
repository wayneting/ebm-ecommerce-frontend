import type { Dongle } from '@/types/models'

/**
 * Mock 使用者持有的 Dongle 清單
 *
 * 模仿舊系統：Dongle #8000001 綁 PROD001 EBM PACS，目前狀態「在購物車」
 * 加入其他幾個 Dongle 讓列表看起來真實
 */
export const userDongles: Dongle[] = [
  {
    serial: '8000001',
    productId: 'PROD001',
    productName: 'EBM PACS',
    status: 'in-cart',
    inCart: true,
    latestOrderId: '00010605',
    latestOrderDate: '2026-04-08T14:43:02',
    licenseType: 'day90',
    purchaseDays: 76,
    expireDate: '2026-07-02',
    installedModules: [
      { moduleId: 'DI001', moduleName: 'CR Connection', description: '允許一臺 CR 儀器傳入影像', quantity: 1 },
      { moduleId: 'DI003', moduleName: 'CT Connection', description: '允許一臺 CT 儀器傳入影像', quantity: 1 },
      { moduleId: 'SI004', moduleName: '5,000 Studies', description: '影像儲存筆數', quantity: 5000 },
    ],
  },
  {
    serial: '8000034',
    productId: 'PROD003',
    productName: 'AgileRIS',
    status: 'active',
    inCart: false,
    latestOrderId: '00010502',
    latestOrderDate: '2025-10-14T09:12:00',
    licenseType: 'buyout',
    purchaseDays: 0,
    expireDate: null,
    installedModules: [
      { moduleId: 'AR001', moduleName: 'RIS Core', description: 'RIS 核心引擎', quantity: 1 },
      { moduleId: 'AR010', moduleName: '放射師授權', description: '每位放射師一份', quantity: 12 },
      { moduleId: 'AR020', moduleName: 'Voice-to-Text', description: '語音轉報告', quantity: 1 },
    ],
  },
  {
    serial: '8000089',
    productId: 'PROD004',
    productName: 'ImageQC',
    status: 'trial',
    inCart: false,
    latestOrderId: '00010607',
    latestOrderDate: '2026-04-14T11:30:00',
    licenseType: 'day90',
    purchaseDays: 3,
    expireDate: '2026-04-20',
    installedModules: [
      { moduleId: 'QC001', moduleName: 'QC Core', description: '品管引擎', quantity: 1 },
      { moduleId: 'QC010', moduleName: '技師授權', description: '每位技師一份', quantity: 5 },
    ],
  },
]

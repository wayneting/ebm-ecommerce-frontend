/**
 * Mock 產品 + 模組資料
 *
 * 資料結構模仿舊系統的 PROD001 EBM PACS：
 * - BA* = Basic（必選、底層模組）
 * - DI* = Device Interface（儀器接入）
 * - SI* = Storage/Image（容量、計費單位）
 * - VU* = Viewer（檢視元件）
 * - AI* = AI 模組（新增）
 * - CLOUD* = 雲端（新增）
 */

import type { Product } from '@/types/models'

export const products: Product[] = [
  // ═══════════════════════════════════════════════════════════
  // PROD001 EBM PACS
  // ═══════════════════════════════════════════════════════════
  {
    id: 'PROD001',
    name: 'EBM PACS',
    category: 'Medical Imaging Storage',
    taglineZh: '醫學影像儲傳系統',
    description: '企業級 PACS，支援 DICOM 3.0 標準、多種儀器接入、AI 輔助診斷、雲端備份。',
    logo: 'MP',
    basePrice: 300_001,
    modules: [
      {
        id: 'BA001', name: 'Basic Module',
        description: '基礎模組',
        detailDescription: '至少必須加買 SI004（5,000 Studies），DI001~DI011 至少一個，VU001 至少一個',
        category: 'basic', priceType: 'fixed', price: 1,
        isNecessary: true, isOnlyOne: true, maxQuantity: 1,
        requiresOneOf: [['SI004'], ['DI001', 'DI002', 'DI003', 'DI012'], ['VU001']],
      },
      {
        id: 'BA002', name: 'Enhanced Module',
        description: 'Enhanced Module',
        detailDescription: 'Support MSSQL 2012 and True 64bit OS',
        category: 'basic', priceType: 'fixed', price: 300_000,
        isNecessary: false, isOnlyOne: true, maxQuantity: 1,
        associatedModuleIds: ['SI026', 'VU030', 'VU036', 'VU037', 'VU038', 'VU044', 'VU046'],
      },
      {
        id: 'DI001', name: 'CR Connection',
        description: '允許一臺 CR 儀器傳入影像',
        detailDescription: '若有多臺 CR 時，必須購買足夠的接入執照',
        category: 'device', priceType: 'fixed', price: 5_000,
        isNecessary: false, isOnlyOne: false,
      },
      {
        id: 'DI002', name: 'DR Connection',
        description: '允許一臺 DR 儀器傳入影像',
        category: 'device', priceType: 'fixed', price: 5_000,
        isNecessary: false, isOnlyOne: false,
      },
      {
        id: 'DI003', name: 'CT Connection',
        description: '允許一臺 CT 儀器傳入影像',
        category: 'device', priceType: 'fixed', price: 5_000,
        isNecessary: false, isOnlyOne: false,
      },
      {
        id: 'DI012', name: 'Multi-modality Connection',
        description: '允許一臺任何種類的儀器傳入影像',
        detailDescription: '通用授權，涵蓋 CR/DR/CT/MR/US 等所有 modality',
        category: 'device', priceType: 'fixed', price: 12_000,
        isNecessary: false, isOnlyOne: false,
      },
      {
        id: 'SI004', name: '5,000 Studies 儲存量',
        description: '可以在線儲存影像檢查筆數',
        category: 'storage', priceType: 'per-unit', price: 45,
        unit: '筆', step: 1000,
        isNecessary: false, isOnlyOne: false,
      },
      {
        id: 'SI026', name: 'Premium Storage',
        description: '高效能儲存池（Enhanced 專用）',
        category: 'storage', priceType: 'fixed', price: 80_000,
        isNecessary: false, isOnlyOne: true, maxQuantity: 1,
      },
      {
        id: 'VU001', name: 'Basic Viewer',
        description: '標準 2D 檢視器',
        category: 'viewer', priceType: 'fixed', price: 20_000,
        isNecessary: false, isOnlyOne: false,
      },
      {
        id: 'VU030', name: '3D Reconstruction',
        description: '3D 重建 viewer',
        category: 'viewer', priceType: 'fixed', price: 60_000,
        isNecessary: false, isOnlyOne: false,
      },
      {
        id: 'AI001', name: 'AI 輔助診斷',
        description: '氣胸自動偵測（≥95% 準確率）· FDA Class II',
        detailDescription: 'Chest X-ray 上自動檢出 pneumothorax 病灶，平均報告時間從 12 min 縮短至 3.5 min',
        category: 'ai', priceType: 'fixed', price: 180_000,
        isNecessary: false, isOnlyOne: true, maxQuantity: 1,
      },
      {
        id: 'CLOUD001', name: '雲端異地備份',
        description: 'AWS S3 異地備份（HIPAA 合規）',
        category: 'cloud', priceType: 'per-year', price: 15_000,
        unit: '年', step: 1,
        isNecessary: false, isOnlyOne: false,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // PROD002 MobiPACS (簡化版)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'PROD002', name: 'MobiPACS',
    category: 'Mobile Medical Imaging',
    taglineZh: '行動醫學影像平台',
    description: '專為 iOS / Android 打造的行動 PACS 客戶端，支援離線暫存、雲端同步。',
    logo: 'MB', basePrice: 80_000,
    modules: [
      { id: 'MB001', name: 'iOS Client', description: 'iPhone / iPad 原生 app',
        category: 'basic', priceType: 'fixed', price: 40_000,
        isNecessary: true, isOnlyOne: true, maxQuantity: 1 },
      { id: 'MB002', name: 'Android Client', description: 'Android 原生 app',
        category: 'basic', priceType: 'fixed', price: 40_000,
        isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'MB010', name: '使用者授權', description: '每使用者一份',
        category: 'storage', priceType: 'per-unit', price: 1_200, unit: '人', step: 1,
        isNecessary: true, isOnlyOne: false },
      { id: 'MB020', name: '離線模式', description: '離線查閱與同步', category: 'storage',
        priceType: 'fixed', price: 25_000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // PROD003 AgileRIS
  // ═══════════════════════════════════════════════════════════
  {
    id: 'PROD003', name: 'AgileRIS',
    category: 'Radiology Information System',
    taglineZh: '雲原生放射資訊系統',
    description: '零學習曲線的雲原生 RIS，從報告產製到排程、影像存取一站完成。',
    logo: 'AR', basePrice: 180_000,
    modules: [
      { id: 'AR001', name: 'RIS Core', description: 'RIS 核心引擎（必選）',
        category: 'basic', priceType: 'fixed', price: 100_000, isNecessary: true, isOnlyOne: true, maxQuantity: 1 },
      { id: 'AR010', name: '放射師授權', description: '每位放射師一份',
        category: 'storage', priceType: 'per-unit', price: 2_500, unit: '人', step: 1, isNecessary: true, isOnlyOne: false },
      { id: 'AR020', name: 'Voice-to-Text', description: '語音轉報告', category: 'ai',
        priceType: 'fixed', price: 60_000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'AR030', name: 'HL7 整合', description: '與 HIS / EMR 雙向介接',
        category: 'device', priceType: 'fixed', price: 80_000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // PROD004 ImageQC
  // ═══════════════════════════════════════════════════════════
  {
    id: 'PROD004', name: 'ImageQC',
    category: 'Quality Control',
    taglineZh: '自動化影像品管',
    description: 'AI 驅動的放射科品管系統，自動檢出技術缺陷、產生品管報告。',
    logo: 'QC', basePrice: 85_000,
    modules: [
      { id: 'QC001', name: 'QC Core', description: '品管引擎（必選）', category: 'basic', priceType: 'fixed', price: 60_000, isNecessary: true, isOnlyOne: true, maxQuantity: 1 },
      { id: 'QC010', name: '技師授權', description: '每位技師一份', category: 'storage', priceType: 'per-unit', price: 1_500, unit: '人', step: 1, isNecessary: true, isOnlyOne: false },
      { id: 'QC020', name: '月報自動產出', description: '每月自動產 PDF 品管報告', category: 'ai', priceType: 'fixed', price: 25_000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // PROD005 EPS Pi
  // ═══════════════════════════════════════════════════════════
  {
    id: 'PROD005', name: 'EPS Pi',
    category: 'Interactive Quote Navigator',
    taglineZh: '引導式產品報價系統（IPQN）',
    description: '業務端引導式報價工具，5 分鐘內完成客製化方案與試算。',
    logo: 'EP', basePrice: 120_000,
    modules: [
      { id: 'EP001', name: 'IPQN Core', description: '引導式問答引擎（必選）', category: 'basic', priceType: 'fixed', price: 80_000, isNecessary: true, isOnlyOne: true, maxQuantity: 1 },
      { id: 'EP010', name: '業務帳號', description: '每位業務一份', category: 'storage', priceType: 'per-unit', price: 3_000, unit: '人', step: 1, isNecessary: true, isOnlyOne: false },
      { id: 'EP020', name: 'CRM 整合', description: '同步 Salesforce / HubSpot', category: 'device', priceType: 'fixed', price: 50_000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // PROD006 ExCD
  // ═══════════════════════════════════════════════════════════
  {
    id: 'PROD006', name: 'ExCD',
    category: 'Clinical Document Management',
    taglineZh: '企業級臨床文件管理',
    description: '完整的醫療文件 DMS，含全文檢索、版本控管、審計追蹤。',
    logo: 'EX', basePrice: 95_000,
    modules: [
      { id: 'EX001', name: 'DMS Core', description: '文件管理核心（必選）', category: 'basic', priceType: 'fixed', price: 70_000, isNecessary: true, isOnlyOne: true, maxQuantity: 1 },
      { id: 'EX010', name: '文件容量', description: '可儲存文件數', category: 'storage', priceType: 'per-unit', price: 25, unit: '份', step: 1000, isNecessary: true, isOnlyOne: false },
      { id: 'EX020', name: '全文檢索', description: 'Elasticsearch 全文搜尋引擎', category: 'storage', priceType: 'fixed', price: 35_000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
    ],
  },
]

export const findProductById = (id: string): Product | undefined =>
  products.find((p) => p.id === id)

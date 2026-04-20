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
      { id: 'BA001', name: 'Basic Module', description: '基礎模組', detailDescription: '至少必須加買SI004(5,000 Studies),DI001~DI011至少一個,VU001至少一個', category: 'basic', priceType: 'fixed', price: 1, isNecessary: true, isOnlyOne: true, maxQuantity: 1 },
      { id: 'BA002', name: 'Enhanced Module', description: 'Enhanced Module', detailDescription: 'Support MSSQL 2012 and True 64bit OS', category: 'basic', priceType: 'fixed', price: 300000, isNecessary: false, isOnlyOne: true, maxQuantity: 1, associatedModuleIds: ['SI026', 'VU030', 'VU036', 'VU037', 'VU038', 'VU044', 'VU046'] },
      { id: 'DI001', name: 'CR Connection', description: '允許一臺CR儀器傳入影像', detailDescription: '若有多臺CR時，必須購買足夠的接入執照。', category: 'device', priceType: 'fixed', price: 5000, isNecessary: false, isOnlyOne: false, associatedModuleIds: ['SI028'] },
      { id: 'DI002', name: 'DR Connection', description: '允許一臺DR儀器傳入影像', detailDescription: '若有多臺DR時，必須購買足夠的接入執照。', category: 'device', priceType: 'fixed', price: 5000, isNecessary: false, isOnlyOne: false, associatedModuleIds: ['SI028'] },
      { id: 'DI003', name: 'CT Connection', description: '允許一臺CT傳入影像', detailDescription: '若有多臺CT時，必須購買足夠的接入執照。', category: 'device', priceType: 'fixed', price: 7500, isNecessary: false, isOnlyOne: false, associatedModuleIds: ['SI028', 'VU004', 'VU005', 'VU008'] },
      { id: 'DI004', name: 'MR Connection', description: '允許一臺MRI傳入影像', detailDescription: '若有多臺MRI時，必須購買足夠的接入執照。', category: 'device', priceType: 'fixed', price: 7500, isNecessary: false, isOnlyOne: false, associatedModuleIds: ['SI028', 'VU004', 'VU005', 'VU008'] },
      { id: 'DI005', name: 'US-BW Connection', description: '允許一臺灰階超音波傳入影像', detailDescription: '若有多臺黑白超音波要接入時，需逐一購買接入執照', category: 'device', priceType: 'fixed', price: 2500, isNecessary: false, isOnlyOne: false, associatedModuleIds: ['SI028'] },
      { id: 'DI006', name: 'US-CL Connection', description: '允許一臺彩色超音波傳入影像 (允許灰階及彩色超音波)', detailDescription: '若有多臺彩色超音波要接入時，需逐一購買接入執照', category: 'device', priceType: 'fixed', price: 5000, isNecessary: false, isOnlyOne: false, associatedModuleIds: ['SI028'] },
      { id: 'DI007', name: 'PET Connection', description: '允許一臺PET傳入影像', detailDescription: '若有多臺PET時，必須購買足夠的接入執照。', category: 'device', priceType: 'fixed', price: 10000, isNecessary: false, isOnlyOne: false, associatedModuleIds: ['SI028', 'VU004', 'VU005', 'VU008'] },
      { id: 'DI008', name: 'XA Connection', description: '允許一臺XA傳入影像', detailDescription: '若有多臺XA時，必須購買足夠的接入執照。', category: 'device', priceType: 'fixed', price: 7500, isNecessary: false, isOnlyOne: false, associatedModuleIds: ['SI028'] },
      { id: 'DI009', name: 'MG Connection', description: '允許一臺MG傳入影像', detailDescription: '若有多臺MG時，必須購買足夠的接入執照。', category: 'device', priceType: 'fixed', price: 10000, isNecessary: false, isOnlyOne: false, associatedModuleIds: ['SI028', 'VU010'] },
      { id: 'DI010', name: 'ECG Connection', description: '允許一臺DICOM ECG傳入影像', detailDescription: '若有多臺ECG時，必須購買足夠的接入執照。', category: 'device', priceType: 'fixed', price: 2500, isNecessary: false, isOnlyOne: false, associatedModuleIds: ['SI028'] },
      { id: 'DI011', name: 'Other Connection', description: '允許一臺Other儀器傳入影像 (或未列在DIooo的儀器)', detailDescription: '若有多臺Secondary Capture時，必須購買足夠的接入執照。', category: 'device', priceType: 'fixed', price: 1000, isNecessary: false, isOnlyOne: false, associatedModuleIds: ['SI028', 'VU010'] },
      { id: 'DI012', name: 'Multi-modality Connection', description: '允許一臺任何種類的儀器傳入影像', detailDescription: '若有多臺Multi-modality時，必須購買足夠的接入執照。', category: 'device', priceType: 'fixed', price: 25000, isNecessary: false, isOnlyOne: false, associatedModuleIds: ['SI028', 'VU004', 'VU005', 'VU008', 'VU010'] },
      { id: 'DI013', name: 'DICOM RF', description: '允許一臺RF傳入影像', detailDescription: '若有多臺RF時，必須購買足夠的接入執照。', category: 'device', priceType: 'fixed', price: 5000, isNecessary: false, isOnlyOne: false, associatedModuleIds: ['SI028'] },
      { id: 'SI001', name: 'Print Center', description: '數位化洗片中心', detailDescription: '病人在檢查完畢後，洗片卻忘記帶走，造成對X光片的浪費。只需將要洗片的影像，交由數位化洗片中心來統一管理，患者來櫃臺取片時，前臺人員按要求洗片即可。如此不但可避免X光片的浪費，也可確保二次洗片時的品質與初次洗片相同。', category: 'storage', priceType: 'fixed', price: 250000, isNecessary: false, isOnlyOne: true, maxQuantity: 1, associatedModuleIds: ['VU025'] },
      { id: 'SI002', name: '128 Connections', description: '128 連線數', detailDescription: '舊有系統受限於CPU演算能力，無法提升效能，連帶影響用戶的影像閱覽的速度，現在得益於CPU的演進及效能提升，新版伺服器可以同時驅動多個CPU，並加以性能優化，由原本64個連線數，提高為128個連線數。', category: 'storage', priceType: 'fixed', price: 90000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'SI004', name: '5,000 Studies', description: '可以在線儲存5000個檢查', detailDescription: '最基本的配直就是5,000筆檢查。系統會自動先進先出，一直將最新的影像保存在伺服器中。每多買一組“在約線儲存5,000個檢查”模組，就可以延長在線的容量。此為程式控制，即使加大伺服器硬碟，也不會改變其數值。', category: 'storage', priceType: 'fixed', price: 5000, isNecessary: false, isOnlyOne: false, associatedModuleIds: ['SI028'] },
      { id: 'SI005', name: 'Worklist SCU', description: 'Worklist SCU的接入許可', detailDescription: '本選項並不包括將RIS/HIS資料饋入Worklist Server的功能。此部份需合併RIS/HIS的 broker動作，才能使用。', category: 'storage', priceType: 'fixed', price: 25000, isNecessary: false, isOnlyOne: false, associatedModuleIds: ['SI025'] },
      { id: 'SI006', name: 'Coercion', description: '病患基本資料置換', detailDescription: '利用傳入影像的病歷號，到外部提供的資料庫中，找到第一筆符合條件的資料，並依設定，將對應的欄位帶入影像中。', category: 'storage', priceType: 'fixed', price: 50000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'SI007', name: 'VOC PP-100', description: 'EPSON PP-100光碟燒錄機的使用授權', detailDescription: '還需要有VU002模組，才可以燒錄Viewer On CD.若要用來備份影像資料，需多買一個SI009', category: 'storage', priceType: 'fixed', price: 25000, isNecessary: false, isOnlyOne: true, maxQuantity: 1, associatedModuleIds: ['VU002'] },
      { id: 'SI008', name: 'ILM 1GB', description: '資料搬移 1GB', detailDescription: '資料生命周期管理(Information Lifecycle Management ;ILM) 可自動將比較早期傳入的影像自動搬移到價格較低的磁碟上。', category: 'storage', priceType: 'fixed', price: 25, isNecessary: false, isOnlyOne: false },
      { id: 'SI009', name: 'Advanced Server Archive', description: '進階備份系統', category: 'storage', priceType: 'fixed', price: 3000000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'SI010', name: 'Auto Route', description: '自動轉傳影像到其他設備', detailDescription: '自動轉傳影像到其他設備，目的地若不是 EBM 產品，則需要加購 SI011。', category: 'storage', priceType: 'fixed', price: 25000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'SI011', name: 'Store to 3rd party', description: '傳影像到3rd party軟件', category: 'storage', priceType: 'fixed', price: 100000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'SI012', name: 'Schedule', description: '開單/排程/報到系統', detailDescription: '開單/排程/報到系統，價格包含整合、修改、測試及教育訓練工時，建議以放射科使用為主，若需新增放射科以外的科室或全院使用，需再另以工時計價。', category: 'storage', priceType: 'fixed', price: 1200000, isNecessary: false, isOnlyOne: false },
      { id: 'SI013', name: 'RIS', description: '放射科報告系統', category: 'storage', priceType: 'fixed', price: 150000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'SI015', name: 'Run On Workstation', description: '允許將 Server 安裝在 Windows Client OS', category: 'storage', priceType: 'fixed', price: 1, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'SI016', name: 'Secondary Storage', description: 'Save Images to Secondary Storage', category: 'storage', priceType: 'fixed', price: 750000, isNecessary: false, isOnlyOne: true, maxQuantity: 1, associatedModuleIds: ['SI009'] },
      { id: 'SI017', name: 'DDC', description: 'Allow Run DDC', category: 'storage', priceType: 'fixed', price: 300000, isNecessary: false, isOnlyOne: false },
      { id: 'SI020', name: 'Can install server on new OS', description: 'Can install server on new OS', category: 'storage', priceType: 'fixed', price: 1, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'SI022', name: 'UniECG Concurrent License', description: 'UniECG Concurrent License', detailDescription: 'ECG Report licenses for user to log in online at same time', category: 'storage', priceType: 'fixed', price: 50000, isNecessary: false, isOnlyOne: false },
      { id: 'SI025', name: 'Advanced Worklist', description: 'Advanced Worklist', detailDescription: 'Allow to separate worklist by scheduled procedure location', category: 'storage', priceType: 'fixed', price: 150000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'SI026', name: 'AI Module', description: 'AI Module', category: 'storage', priceType: 'fixed', price: 500000, isNecessary: false, isOnlyOne: false },
      { id: 'SI028', name: 'QC', description: 'QC', category: 'storage', priceType: 'fixed', price: 350000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU001', name: 'Concurrent License', description: '同時上線執照', detailDescription: '每個使用者上線時，會佔用一個執照。當執照數量不足時，新的使用者就無法登可由系統說定自動Log out時間', category: 'viewer', priceType: 'fixed', price: 10000, isNecessary: false, isOnlyOne: false, associatedModuleIds: ['SI022', 'VU044', 'VU048'] },
      { id: 'VU002', name: 'VOC@1000', description: '可燒錄1000片光碟，並附上免費的Viewer', detailDescription: '用戶需自備Wiondow支援燒錄功能的光碟機。由於光碟機經常有相容性問題，購買前請先與本公司確認。每燒一張光碟就自動扣1次，有介面可以讓用戶檢查，當前所剩的數量。', category: 'viewer', priceType: 'fixed', price: 5000, isNecessary: false, isOnlyOne: false },
      { id: 'VU003', name: 'Save as JPEG', description: '影像另存功能', detailDescription: '只有在動態影像或將影像Stack起來時，才能存成AVI格式', category: 'viewer', priceType: 'fixed', price: 2500, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU004', name: 'MPR', description: '多平面重組', detailDescription: '每次產生一組新的MPR影像序列，並可與原影像序列同步互動', category: 'viewer', priceType: 'fixed', price: 5000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU005', name: 'Real-time MPR', description: '實時多平面重組', detailDescription: '可在同一介面，實時看到多個平面的重組結果', category: 'viewer', priceType: 'fixed', price: 500000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU006', name: 'JPEG2000', description: '下載影像可壓縮', detailDescription: '支援傳送、儲存影像時使用 JPEG2000 的壓縮格式，但伺服器的硬體等級較講究。扣除系統與 DB Server 使用的資源以外，還要有 ＞4G的記憶體以及 >2顆的空閒CPU。', category: 'viewer', priceType: 'fixed', price: 2500, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU007', name: 'Orthopedic view', description: '骨科測量模組', detailDescription: '骨科模組的功能很專業，需要特別教User使用。', category: 'viewer', priceType: 'fixed', price: 100000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU008', name: 'Image Fusion', description: '影像融合', detailDescription: '重疊時可以調整不同的透明度以及色彩，以突顯病徵。', category: 'viewer', priceType: 'fixed', price: 50000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU009', name: 'Web 3D', description: '可用IE操作的三維功能', detailDescription: '顯示卡版本 xxxx', category: 'viewer', priceType: 'fixed', price: 500000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU010', name: 'Basic Hanging Protocol', description: '數字乳房攝影看片流程', detailDescription: '需要訓練使用者設定', category: 'viewer', priceType: 'fixed', price: 25000, isNecessary: false, isOnlyOne: true, maxQuantity: 1, associatedModuleIds: ['VU031', 'VU043', 'VU044'] },
      { id: 'VU011', name: 'Multi-frame', description: '動態視圖模組', detailDescription: '動態模組運作時，需要較好的顯示卡以及較大的記憶體。尤其在高分辨率影像或多組影像同時播放時。', category: 'viewer', priceType: 'fixed', price: 5000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU012', name: 'Windows Print', description: 'Windows打印功能', detailDescription: '可以調整n x m、 直橫、縮放及四角文字...', category: 'viewer', priceType: 'fixed', price: 2500, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU013', name: 'DICOM Print', description: 'DICOM打印功能', detailDescription: '除支持一般DICOM打印外，也支持虛擬成單張膠片的安全打印。可解決打印機內存不足的問題。', category: 'viewer', priceType: 'fixed', price: 5000, isNecessary: false, isOnlyOne: true, maxQuantity: 1, associatedModuleIds: ['SI001'] },
      { id: 'VU014', name: 'NET Meeting', description: '會議功能', detailDescription: 'EBM自有之通訊協定，可利用低頻寬通訊，達到即時互動的效果。會診醫師間看到的影像內容一致，且能看到其他會診醫師的鼠標移動。', category: 'viewer', priceType: 'fixed', price: 25000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU015', name: 'WADO', description: '支持WADO功能', detailDescription: '適用於其他系統的整合功能。', category: 'viewer', priceType: 'fixed', price: 500000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU016', name: 'DICOM ECG', description: 'DICOM ECG模組', detailDescription: '也可以變換不同的顯示格式，利如12 x1, 4x3...', category: 'viewer', priceType: 'fixed', price: 75000, isNecessary: false, isOnlyOne: true, maxQuantity: 1, associatedModuleIds: ['SI022'] },
      { id: 'VU017', name: 'Evidence Doc', description: 'Evidence模組', detailDescription: '符合IHE Evidence Doc的產生要件，可對影像做註記，並在不同系統間傳遞。', category: 'viewer', priceType: 'fixed', price: 10000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU018', name: 'DICOM SC', description: 'SC模組', detailDescription: '當影像伺服器不支持Evidence Doc時，就可用這個模組來註記影像並送到影像伺服器中儲存。', category: 'viewer', priceType: 'fixed', price: 2500, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU019', name: 'Subtraction', description: '減影功能', detailDescription: '可選不同的Key frame做為減影的參考值。支持多種減影方式xxx', category: 'viewer', priceType: 'fixed', price: 30000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU020', name: 'Stack Filter', description: '疊影運算模組', detailDescription: '在原影像操作介面就能使用，不需使用其他程式。', category: 'viewer', priceType: 'fixed', price: 2500, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU021', name: 'Gamma Curve', description: '伽碼校正', detailDescription: '突破傳統線性調整限制，能呈現更好的影像品質。', category: 'viewer', priceType: 'fixed', price: 2500, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU022', name: 'SIGMOID', description: 'SIGMOID曲線', detailDescription: '突破傳統線性調整限制，能呈現更好的影像品質。', category: 'viewer', priceType: 'fixed', price: 2500, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU023', name: 'Palette', description: '調色盤', detailDescription: '對突顯病灶有幫助', category: 'viewer', priceType: 'fixed', price: 2500, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU024', name: 'Ultrasound View', description: '超音測量工具', detailDescription: '對彩超在血管診斷上有許多助益', category: 'viewer', priceType: 'fixed', price: 25000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU025', name: 'DICOM Print Advance', description: 'DICOM排版打印', category: 'viewer', priceType: 'fixed', price: 300000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU026', name: 'Matrix View', description: '以病人為中心的檢查總覽', category: 'viewer', priceType: 'fixed', price: 10000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU027', name: 'Viewer Call External App', description: '外部程式整合', category: 'viewer', priceType: 'fixed', price: 10000, isNecessary: false, isOnlyOne: true, maxQuantity: 1, associatedModuleIds: ['VU002'] },
      { id: 'VU028', name: 'Tile Display', description: '堆疊序列平鋪顯示', category: 'viewer', priceType: 'fixed', price: 2500, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU029', name: 'Viewer Over Two Monitors', description: '橫跨2個螢幕顯示', category: 'viewer', priceType: 'fixed', price: 10000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU030', name: 'Hyper Boost Access', description: '大資料影像快速呈現', category: 'viewer', priceType: 'fixed', price: 25000, isNecessary: false, isOnlyOne: true, maxQuantity: 1, associatedModuleIds: ['VU036'] },
      { id: 'VU031', name: 'Mammo Workstation', description: 'Mammo Workstation', category: 'viewer', priceType: 'fixed', price: 25000, isNecessary: false, isOnlyOne: true, maxQuantity: 1, associatedModuleIds: ['VU032', 'VU036'] },
      { id: 'VU032', name: 'Mammo Multiple Hanging Protocol', description: '乳房影像多重掛片原則', category: 'viewer', priceType: 'fixed', price: 750000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU033', name: 'Seat License', description: 'iDO Viewer設備上線執照', category: 'viewer', priceType: 'fixed', price: 75000, isNecessary: false, isOnlyOne: false, associatedModuleIds: ['VU039'] },
      { id: 'VU034', name: 'Open DICOM CD/DVD', description: 'Open DICOM CD/DVD having DICOMDIR', category: 'viewer', priceType: 'fixed', price: 5000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU035', name: 'Query/Retrieve Other Server', description: 'Query/Retrieve Other Server', category: 'viewer', priceType: 'fixed', price: 750000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU036', name: 'Mammo Tomo Hanging Protocol', description: 'Mammo Tomo Hanging Protocol', category: 'viewer', priceType: 'fixed', price: 25000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU037', name: 'Open CT Images more than 3000', description: 'Open CT Images more than 3000', category: 'viewer', priceType: 'fixed', price: 150000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU038', name: 'Ophthalmology Tomo', description: 'Ophthalmology Tomo', category: 'viewer', priceType: 'fixed', price: 90000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU039', name: 'Support MobiPACS Pro', description: 'Support MobiPACS Pro', category: 'viewer', priceType: 'fixed', price: 150000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU043', name: 'General Hanging Protocol', description: 'General Hanging Protocol', category: 'viewer', priceType: 'fixed', price: 50000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU044', name: 'Pangea Dental', description: 'Hanging Protocol for Dental Images', category: 'viewer', priceType: 'fixed', price: 1800000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU045', name: 'WEB7210', description: 'Support Win 10 client When server is version 7.2', category: 'viewer', priceType: 'fixed', price: 150000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU046', name: 'WEB8210', description: 'Support Win 10 client when server is version 8.2', category: 'viewer', priceType: 'fixed', price: 75000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU047', name: 'Curved MPR', description: 'Curved MPR', category: 'viewer', priceType: 'fixed', price: 30000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
      { id: 'VU048', name: 'HTML5 Viewer', description: 'HTML5 Viewer', category: 'viewer', priceType: 'fixed', price: 600000, isNecessary: false, isOnlyOne: true, maxQuantity: 1, associatedModuleIds: ['VU049'] },
      { id: 'VU049', name: 'Advanced HTML5 Viewer', description: 'Advanced HTML5 Viewer', category: 'viewer', priceType: 'fixed', price: 480000, isNecessary: false, isOnlyOne: true, maxQuantity: 1 },
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

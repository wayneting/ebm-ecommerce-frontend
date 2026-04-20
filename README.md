# EBM Technologies 電子商務平台前端

Vue 3 + TypeScript + Tailwind CSS v4 · 對應後端 `EBMECAPI v1` (.NET WebAPI)

> **研發測試階段**：目前使用本地 mock 資料驅動 UI，未呼叫後端。登入流程已暫時 bypass，所有頁面可直接存取以利測試。API 穩定後再接回。

---

## 快速開始

需求：Node.js >= 22.12（或 20.19+）、npm >= 10

```bash
npm install
npm run dev     # http://localhost:5173
```

---

## 可用指令

| 指令 | 說明 |
| --- | --- |
| `npm run dev` | 啟動開發伺服器（Vite HMR） |
| `npm run build` | 正式 build（含 type-check，輸出至 `dist/`） |
| `npm run build-only` | 只 build 不跑 type-check |
| `npm run type-check` | 執行 `vue-tsc` 型別檢查 |
| `npm run preview` | 預覽 production build |
| `npm run lint` | ESLint + Oxlint 自動修正 |
| `npm run format` | Prettier 格式化 `src/` |

---

## 技術棧

- **Vue 3.5** Composition API + `<script setup>`
- **TypeScript 6**（嚴格模式）
- **Vite 8** + **Tailwind CSS v4**（`@tailwindcss/vite` plugin）
- **Pinia 3** 狀態管理
- **Vue Router 4** client-side routing

---

## 專案結構

```
src/
├── App.vue                  應用外殼（全站 header + router-view）
├── main.ts
├── env.d.ts
│
├── assets/
│   └── main.css             Tailwind v4 @theme · EBM design tokens
│
├── components/
│   └── ui/                  通用 UI 元件（Ebm* 命名）
│       ├── EbmButton.vue
│       ├── EbmCard.vue
│       ├── EbmInput.vue
│       ├── EbmBadge.vue
│       ├── EbmStepIndicator.vue
│       └── EbmModal.vue
│
├── layouts/
│   └── AdminLayout.vue      Admin 後台側邊導覽 + 主內容 slot
│
├── views/                   路由頁面
│   ├── DashboardView.vue
│   ├── ProductListView.vue
│   ├── ProductConfigView.vue
│   ├── DongleSelectView.vue
│   ├── DongleListView.vue
│   ├── CartView.vue
│   ├── CheckoutView.vue
│   ├── OrderSuccessView.vue
│   ├── OrderListView.vue
│   ├── OrderDetailView.vue
│   ├── AccountView.vue
│   ├── StyleguideView.vue
│   └── admin/
│       ├── AdminDashboardView.vue
│       ├── AdminProductListView.vue
│       ├── AdminOrderListView.vue
│       └── AdminUserListView.vue
│
├── router/
│   └── index.ts             Vue Router 路由定義
│
├── stores/                  Pinia stores
│   ├── auth.ts
│   ├── cart.ts
│   ├── product.ts
│   ├── dongle.ts
│   ├── order.ts
│   └── admin.ts
│
├── mocks/                   本地測試資料
│   ├── products.ts
│   ├── dongles.ts
│   ├── orders.ts
│   ├── user.ts
│   └── admin.ts
│
├── types/
│   └── models.ts            前端 domain model（camelCase）
│
└── api/
    └── client.ts            HTTP 客戶端（Bearer JWT，API 接上後使用）
```

---

## 路由總覽

**客戶端**

| 路徑 | 頁面 |
| --- | --- |
| `/app` | 儀表板 |
| `/app/products` | 產品列表 |
| `/app/products/:productId/configure` | 配置模組（新購／升級）|
| `/app/upgrade` | 選擇要升級的 Dongle |
| `/app/cart` | 購物車 |
| `/app/checkout` | 確認訂單 |
| `/app/orders/success` | 下單成功 |
| `/app/orders` | 訂單列表 |
| `/app/orders/:id` | 訂單詳情 |
| `/app/dongles` | Dongle 列表 |
| `/app/account` | 帳戶設定 |

**後台**

| 路徑 | 頁面 |
| --- | --- |
| `/admin` | 後台儀表板 |
| `/admin/products` | 產品管理 |
| `/admin/orders` | 訂單管理 |
| `/admin/users` | 使用者與註冊管理 |

**開發用**

| 路徑 | 頁面 |
| --- | --- |
| `/styleguide` | 元件規範測試頁 |

---

## Design tokens

Design tokens 定義在 `src/assets/main.css` 的 `@theme` block，Tailwind v4 會自動產對應的 utility class（如 `bg-ebm-primary`、`text-ebm-cta`、`shadow-ebm`）。

```css
@theme {
  --color-ebm-primary: #0B2447;
  --color-ebm-secondary: #19376D;
  --color-ebm-accent: #00A1E0;
  --color-ebm-cta: #F76E11;
  /* ... */
}
```

**修改 design tokens 時，請同步更新專案外的 `components.html` 與 `cpq-design-language/references/design-tokens.md`**，確保規範、Living Styleguide、運行時三處一致。

---

## 接 API 的方向

目前各 Pinia store 的 async action 使用假延遲回傳本地 mock：

```ts
async function fetchAll() {
  await new Promise((r) => setTimeout(r, 200))
  return seedData
}
```

API 穩定後，把這層改成：

```ts
import { apiClient } from '@/api/client'

async function fetchAll() {
  const data = await apiClient.post('/api/admin/products/list', {})
  return data.map(mapToDomainModel)
}
```

Views 和 components 完全不動（都只看 `src/types/models.ts` 的 domain model）。

### 認證

`src/api/client.ts` 已實作 Bearer JWT：從 `localStorage['ebm_token']` 讀 token 並加上 `Authorization` header。登入流程實作後呼叫 `setToken(token)` 儲存即可。

### 開發時後端代理

`vite.config.ts` 已設定將 `/ECAPI/*` proxy 到 `http://localhost:5000`，本機開發可直接打到本機後端。若後端位置不同請修改 `server.proxy` 設定。

---

## 命名規約

- **UI 元件**以 `Ebm` 前綴，置於 `src/components/ui/`
- **View** 以 `*View.vue` 結尾
- 元件一律 `<script setup lang="ts">` + `withDefaults(defineProps<Props>(), {...})` 模式
- 不要引入第三方 UI 庫（Element Plus、Naive UI 等），UI 全部自建以維持品牌一致

---

## 測試階段注意

| 項目 | 狀態 | 說明 |
| --- | --- | --- |
| 登入流程 | **已 bypass** | `src/stores/auth.ts` 初始化即設為已登入狀態，無需驗證 |
| API 呼叫 | Mock | 所有 store 回傳本地假資料 |
| 資料持久化 | 無 | 重新整理會還原 |
| 付款 | Mock | `/app/checkout` 送出會產生假訂單編號 |

---

## 相關文件

- `DEPLOY.md` — Google Cloud Run 部署指南
- `HANDOFF.md` — 接手團隊完整手冊（含 API 對接、Troubleshooting）

---

## License

Internal project · EBM Technologies.

# EBM 電子商務平台 · 前端部署交接手冊

**版本** v1.0 · **交接日期** 2026-04-17 · **交接人** 丁偉能 (Wayne Ting) / `ebm.wayne.ting1115@gmail.com`

---

## 目錄

1. [專案概覽](#1-專案概覽)
2. [技術棧與架構](#2-技術棧與架構)
3. [本地開發環境](#3-本地開發環境)
4. [程式碼導覽](#4-程式碼導覽)
5. [GCP Cloud Run 部署（核心任務）](#5-gcp-cloud-run-部署核心任務)
6. [後端整合（日後）](#6-後端整合日後)
7. [已知限制與 TODO](#7-已知限制與-todo)
8. [Troubleshooting](#8-troubleshooting)
9. [交接檢查清單](#9-交接檢查清單)
10. [參考資源](#10-參考資源)

---

## 1. 專案概覽

### 1.1 背景

**EBM Technologies** 是醫療 IT / B2B 軟體供應商，產品面向放射科與醫院 IT 採購。此專案是舊系統 (`ASP.NET MVC + jQuery 1.4`，約 2011 架構) 的**前端完整重寫**。

- **商業模型**：Dongle（硬體序號授權）+ Module（模組化計價）+ Day License（試用天數），與一般 SaaS 訂閱制不同
- **六條產品線**：MobiPACS / ImageQC / AgileRIS / EPS Pi / Camera Pi / ExCD
- **後端 API**：EBMECAPI v1（OpenAPI 3.0.1），.NET WebAPI，65 個 endpoints / 48 schemas

### 1.2 交付內容

| 資產 | 位置 | 說明 |
|---|---|---|
| **前端專案源碼** | `frontend/` | 本次交接核心，Vue 3 + TS + Tailwind v4 |
| **部署資產** | `frontend/Dockerfile` `nginx.conf` `deploy.sh` `cloudbuild.yaml` | 直接可用 |
| **設計規範** | `../components.html` | 11 章 Living Styleguide（2634 行）|
| **設計 skill** | `../files/cpq-design-language.zip` | Design system 規範來源 |
| **API 規格** | `../api.json` | OpenAPI 3.0.1 · 65 endpoints |
| **舊系統參考** | `../舊系統網站html/` `../舊系統畫面/` | 舊版 UI 與流程 |

### 1.3 目前狀態（交接時）

| 項目 | 完成度 | 備註 |
|---|---|---|
| 客戶端 12 個頁面 | ✅ 100% | 登入 / Dashboard / 產品 / 配置 / 購物車 / 結帳 / 成功 / 訂單列表 / 訂單詳情 / Dongle 列表 / 升級流程 / 帳戶設定 |
| Admin 後台 4 個頁面 | ✅ 80% | 儀表板 / 產品管理 / 訂單管理 / 使用者管理 · 產品編輯表單尚未獨立 |
| UI 元件庫 | ✅ | 6 個 `Ebm*` 元件（Button / Card / Input / Badge / StepIndicator / Modal） |
| Mock API | ✅ | 所有功能能端到端跑，無後端亦可 demo |
| **後端 .NET 專案** | ❌ | **尚未產出**，日後開發 |
| **Cloud Run 部署** | ⏳ | Artifacts 已備妥，待上線團隊執行 |

### 1.4 接手團隊的工作範圍

1. **立即**：把前端推上 Google Cloud Run（第 5 章）
2. **未來**：後端 .NET WebAPI 開始後，同樣方式上 Cloud Run，並更新前端 `nginx.conf` 反向代理（第 6 章）

---

## 2. 技術棧與架構

### 2.1 技術選型理由

| 層 | 選擇 | 理由 |
|---|---|---|
| Frontend framework | **Vue 3.5 Composition API** | 團隊偏好、TS 相容性佳、生態成熟 |
| Language | **TypeScript 6** | 48 個 API schema 需要強型別保護 |
| Build tool | **Vite 8** | HMR 最快、生態友善、原生 ESM |
| CSS | **Tailwind CSS v4** (`@tailwindcss/vite` plugin) | CSS-first config，跟 `skill` 的 tokens 哲學一致 |
| State | **Pinia 3** | Vue 官方推薦、TS 友善 |
| Router | **Vue Router 4** | SFC 導向 |
| Package manager | **npm** | Node 內建 |
| Deploy | **Cloud Run + Artifact Registry** (asia-east1) | Serverless、按秒計費、SSL 自動 |

**不使用**：Element Plus / Naive UI / PrimeVue 等 UI 庫（Wayne 明確偏好純自建 + Tailwind，保持品牌一致）。

### 2.2 目錄結構

```
frontend/
├── public/                      # 靜態資源
├── src/
│   ├── App.vue                  # 根元件（含 nav / footer）
│   ├── main.ts                  # entry point
│   ├── env.d.ts
│   │
│   ├── assets/
│   │   └── main.css             # ⭐ Tailwind v4 + EBM @theme tokens
│   │
│   ├── components/
│   │   ├── ui/                  # 通用 UI 元件（Ebm* 開頭）
│   │   │   ├── EbmButton.vue
│   │   │   ├── EbmCard.vue
│   │   │   ├── EbmInput.vue
│   │   │   ├── EbmBadge.vue
│   │   │   ├── EbmStepIndicator.vue
│   │   │   └── EbmModal.vue
│   │   └── commerce/            # （預留）EBM 特有商務元件
│   │
│   ├── layouts/
│   │   └── AdminLayout.vue      # Admin 後台 shell
│   │
│   ├── views/                   # 路由頁面
│   │   ├── MarketingView.vue    # 未登入首頁
│   │   ├── LoginView.vue
│   │   ├── DashboardView.vue
│   │   ├── ProductListView.vue
│   │   ├── ProductConfigView.vue # 模組配置（核心）
│   │   ├── CartView.vue
│   │   ├── CheckoutView.vue
│   │   ├── OrderSuccessView.vue
│   │   ├── OrderListView.vue
│   │   ├── OrderDetailView.vue
│   │   ├── DongleListView.vue
│   │   ├── DongleSelectView.vue
│   │   ├── AccountView.vue
│   │   ├── StyleguideView.vue   # UI 元件測試頁
│   │   └── admin/
│   │       ├── AdminDashboardView.vue
│   │       ├── AdminProductListView.vue
│   │       ├── AdminOrderListView.vue
│   │       └── AdminUserListView.vue
│   │
│   ├── router/
│   │   └── index.ts             # 19 個路由
│   │
│   ├── stores/                  # Pinia stores
│   │   ├── auth.ts              # 使用者登入狀態
│   │   ├── cart.ts              # ⭐ 購物車 + 試算邏輯
│   │   ├── product.ts
│   │   ├── dongle.ts
│   │   ├── order.ts
│   │   └── admin.ts
│   │
│   ├── mocks/                   # Mock data
│   │   ├── products.ts          # 6 產品 + 30+ 模組
│   │   ├── dongles.ts
│   │   ├── orders.ts
│   │   ├── user.ts
│   │   └── admin.ts             # adminUsers + registrations
│   │
│   ├── types/
│   │   ├── models.ts            # ⭐ 前端 domain model（camelCase）
│   │   └── api.ts               # API schema（PascalCase, 未來從 openapi-typescript 產）
│   │
│   └── api/
│       ├── client.ts            # fetch wrapper (POST → /ECAPI)
│       └── endpoints/
│           └── auth.ts
│
├── index.html
├── vite.config.ts               # 含 tailwindcss() + /ECAPI proxy
├── tsconfig.*.json
├── package.json
├── Dockerfile                   # ⭐ Multi-stage (Node build + nginx serve)
├── nginx.conf                   # ⭐ SPA fallback + /ECAPI 反向代理 placeholder
├── .dockerignore
├── deploy.sh                    # ⭐ 一鍵部署腳本（已 chmod +x）
├── cloudbuild.yaml              # GitHub CI/CD trigger 設定
├── DEPLOY.md                    # 詳細部署指南
├── README.md                    # 專案說明
└── HANDOFF.md                   # 本手冊
```

### 2.3 設計系統三源同步規則 ⚠️

Design tokens（色票、字級、spacing、radius、shadow）存在**三個地方**，修改時**必須同時更新**：

1. `../files/cpq-design-language.zip` 解壓後 `references/design-tokens.md`（skill 規範）
2. `../components.html` 的 `<style>` + `tailwind.config` 區塊（Living Styleguide）
3. `frontend/src/assets/main.css` 的 `@theme` block（**運行時 source of truth**）

三者不同步會造成 UI 跟規範文件脫鉤。**建議日後把 tokens 抽成獨立 npm package**，打破三源分歧。

### 2.4 命名規約

- **UI 元件**：`Ebm` 前綴（`EbmButton.vue`、`EbmCard.vue`）
- **Views**：`*View.vue`（`DashboardView.vue`）
- **Stores**：camelCase（`auth.ts`、`cart.ts`）
- **Composables**（未來）：`use*`（`useDongles.ts`）
- **Types**：`models.ts`（前端 domain）vs `api.ts`（後端 schema）

---

## 3. 本地開發環境

### 3.1 前置需求

| 工具 | 最低版本 | 說明 |
|---|---|---|
| Node.js | **22.12** 或 20.19+ | 寫於 `package.json` engines |
| npm | 10+ | Node 內建 |
| gcloud CLI | latest | 部署用，[安裝指引](https://cloud.google.com/sdk/docs/install) |
| Git | 2.x+ | version control |

### 3.2 啟動步驟

```bash
cd frontend
npm install          # 第一次或 package.json 改動後
npm run dev          # http://localhost:5173
```

第一次 `npm install` 會裝 316 個 packages，約 40 秒。

### 3.3 常用指令

```bash
npm run dev          # 開發伺服器，HMR 熱重載
npm run build        # 正式 build（含 type-check，輸出到 dist/）
npm run build-only   # 只 build 不跑 type-check
npm run type-check   # 只跑 TS 型別檢查
npm run preview      # 預覽 dist/（測 production build）
npm run lint         # ESLint + Oxlint 自動修
npm run format       # Prettier 格式化 src/
```

### 3.4 Demo 模式注意

目前 `src/stores/auth.ts` 中的 `autoLoginForDemo()` 會**自動登入**（方便 demo）。正式上線前**移除** `App.vue` 中 `onMounted(() => auth.autoLoginForDemo())` 這一行，登入頁的 `handleLogin()` 裡的 mock 也要替換成真實 `authApi.login()`。

---

## 4. 程式碼導覽

### 4.1 路由結構（19 個路由）

| 路徑 | 元件 | 說明 |
|---|---|---|
| `/` | MarketingView | 未登入首頁（AgileRIS 行銷）|
| `/login` | LoginView | 登入 |
| `/styleguide` | StyleguideView | UI 元件測試頁 |
| `/app` | DashboardView | 登入後首頁 |
| `/app/products` | ProductListView | 六產品選購 |
| `/app/products/:productId/configure` | ProductConfigView | 配置模組（新購）|
| `/app/products/:productId/configure?upgradeDongle=:serial` | ProductConfigView | 配置模組（升級）|
| `/app/upgrade` | DongleSelectView | 選 Dongle 升級 |
| `/app/cart` | CartView | 購物車 |
| `/app/checkout` | CheckoutView | 確認訂單 |
| `/app/orders/success` | OrderSuccessView | 下單成功 |
| `/app/orders` | OrderListView | 訂單列表 |
| `/app/orders/:id` | OrderDetailView | 訂單詳情 |
| `/app/dongles` | DongleListView | Dongle 列表 |
| `/app/account` | AccountView | 帳戶設定 |
| `/admin` | AdminDashboardView | 後台儀表板 |
| `/admin/products` | AdminProductListView | 產品管理 |
| `/admin/orders` | AdminOrderListView | 訂單管理 |
| `/admin/users` | AdminUserListView | 使用者管理 |

路由 guard 尚未啟用（Demo 模式自動登入）。正式上線前要加 `beforeEach` 檢查 `auth.isLoggedIn`。

### 4.2 核心業務邏輯 · Cart Store

`src/stores/cart.ts` 是整個 Commerce 的靈魂。主要職責：

- 新增 CartItem（新購 / 升級）
- 勾選/取消模組、調整數量、切換授權類型
- 計算每個模組 subtotal（含 fixed / per-unit / per-year 三種計價類型）
- 計算 item 小計、折扣（Day License 75% off）、grand total
- 必選模組自動勾選
- 關聯子項目自動帶出（`associatedModuleIds`）
- Checkout 送出（mock 模式建假訂單、真實環境要 call `/api/shopping-cart/checkout`）

### 4.3 UI 元件用法範例

```vue
<script setup lang="ts">
import EbmButton from '@/components/ui/EbmButton.vue'
import EbmInput from '@/components/ui/EbmInput.vue'

const email = ref('')
const err = ref('')
</script>

<template>
  <EbmInput v-model="email" type="email" label="Email" required :error="err" />
  <EbmButton variant="primary" size="md" :loading="saving" @click="save">
    送出
  </EbmButton>
</template>
```

### 4.4 Mock Data 替換成真 API 的方向

目前所有 stores 的 async actions 都是：

```ts
async function fetchAll() {
  await new Promise((r) => setTimeout(r, 200))
  return seedData
}
```

未來接真 API 時，只要改這一層：

```ts
async function fetchAll() {
  const response = await apiClient.post('/api/admin/products/list', {})
  return response.products.map(mapRawToDomainModel)
}
```

Views / components **完全不動**（domain model 介面已隔離）。

---

## 5. GCP Cloud Run 部署（核心任務）

### 5.1 GCP 專案資訊

| 項目 | 值 |
|---|---|
| Project ID | _（待 Wayne 填入）_ |
| Region | `asia-east1` |
| Billing account | _（待 Wayne 填入）_ |
| Service name | `ebm-frontend` |
| Artifact Registry repo | `ebm-ecommerce`（Docker format）|
| Resources | 1 vCPU / 256Mi / min=0 / max=3 |

### 5.2 第一次部署前置（只做一次，~10 分鐘）

```bash
# 確認 gcloud 已登入、已設定 project
gcloud auth list
gcloud config get-value project

# 步驟 1：啟用需要的 APIs
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com

# 步驟 2：建立 Artifact Registry repository（只建一次）
gcloud artifacts repositories create ebm-ecommerce \
  --repository-format=docker \
  --location=asia-east1 \
  --description="EBM Technologies 電子商務平台所有 container images"

# 步驟 3：授權 Cloud Build 可以 push + deploy
PROJECT_ID=$(gcloud config get-value project)
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
CB_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${CB_SA}" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${CB_SA}" \
  --role="roles/run.admin"

gcloud iam service-accounts add-iam-policy-binding "${CB_SA}" \
  --member="serviceAccount:${CB_SA}" \
  --role="roles/iam.serviceAccountUser"
```

### 5.3 日常部署（~3-5 分鐘/次）

進入 `frontend/` 資料夾，執行：

```bash
./deploy.sh
```

腳本自動：
1. 讀取當前 gcloud project
2. 用 git commit SHA 當 image tag
3. `gcloud builds submit` → Cloud Build 跑 Dockerfile multi-stage
4. `gcloud run deploy` 起新版本
5. 印出 live URL

**覆寫預設值**：

```bash
REGION=us-central1 ./deploy.sh                  # 換區域
SERVICE=ebm-frontend-staging ./deploy.sh        # 換 service 名
MIN_INSTANCES=1 ./deploy.sh                     # 避免冷啟動
MEMORY=512Mi CPU=2 ./deploy.sh                  # 放大規格
```

### 5.4 自動 CI/CD（選用 · 推薦）

`cloudbuild.yaml` 已寫好。設 GitHub trigger：

1. Cloud Console → **Cloud Build → Triggers → Create Trigger**
2. Source → 連 GitHub repo（要先授權 Google Cloud Build App）
3. Event → **Push to branch**
4. Branch → `^main$`
5. Configuration → **Cloud Build configuration file**
6. File location → `frontend/cloudbuild.yaml`
7. Save

之後 `git push origin main` 會自動 build + deploy。

### 5.5 部署後驗證 Checklist

```bash
# 取得 Live URL
URL=$(gcloud run services describe ebm-frontend --region asia-east1 --format='value(status.url)')

# 1. 健康檢查
curl "$URL/health"              # 應該 200 "ok"

# 2. 首頁 HTML
curl -I "$URL/"                 # 應該 200 text/html

# 3. 靜態資源 cache header
curl -I "$URL/assets/index-*.js" # 應該有 Cache-Control: public, immutable

# 4. SPA history fallback
curl -I "$URL/app/dongles"      # 應該 200（不是 404）

# 5. API 反向代理 placeholder（後端未上線時）
curl -X POST "$URL/ECAPI/api/auth/login"  # 應該 503 "backend not deployed yet"

# 6. 瀏覽器 smoke test
open "$URL"                     # Mac
# 手動點：登入 → 產品 → 配置 → 購物車 → 結帳 → 下單
# 再點：後台 → 產品管理 / 訂單管理 / 使用者管理
```

### 5.6 成本估算

| 項目 | 單價 | Demo 規模預估 |
|---|---|---|
| CPU 時間 | $0.000024 / vCPU-秒 | ~$0（min=0 閒置不收費）|
| Memory | $0.0000025 / GiB-秒 | ~$0 |
| Requests | 前 200 萬/月免費 | ~$0 |
| Egress | 前 1 GB/月免費 | ~$0 |
| Artifact Registry | 前 0.5 GB 免費 | ~$0（image 約 30 MB）|
| Cloud Build | 前 120 min/日 免費 | ~$0 |

**結論**：Demo 階段月費預期 $0。正式上線（100 rps）估 < $10/月。

### 5.7 監控與 Logs

```bash
# 即時 log
gcloud run services logs tail ebm-frontend --region asia-east1

# 最近 100 行
gcloud run services logs read ebm-frontend --region asia-east1 --limit 100

# 特定 severity
gcloud run services logs read ebm-frontend --region asia-east1 \
  --log-filter='severity>=WARNING'
```

Cloud Console → Cloud Run → `ebm-frontend` → **METRICS** 分頁可看 QPS、latency、container 數。

---

## 6. 後端整合（日後）

後端 .NET WebAPI 開始開發後，按下列步驟整合：

### 6.1 後端 Dockerfile 範例

後端 repo 建 `backend/Dockerfile`：

```dockerfile
# syntax=docker/dockerfile:1.6

# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0-alpine AS builder
WORKDIR /src
COPY *.csproj ./
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine
WORKDIR /app
COPY --from=builder /app ./
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "EBMECAPI.dll"]   # 替換成實際 DLL 名
```

### 6.2 部署後端

```bash
# 用前端同樣的 pattern，service 名改 ebm-backend
gcloud builds submit --tag \
  asia-east1-docker.pkg.dev/$PROJECT_ID/ebm-ecommerce/ebm-backend:latest

gcloud run deploy ebm-backend \
  --image asia-east1-docker.pkg.dev/$PROJECT_ID/ebm-ecommerce/ebm-backend:latest \
  --region asia-east1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080

# 取得後端 URL
BACKEND_URL=$(gcloud run services describe ebm-backend --region asia-east1 --format='value(status.url)')
echo $BACKEND_URL
# → https://ebm-backend-xxxxx-de.a.run.app
```

### 6.3 更新前端 nginx 反向代理

編輯 `frontend/nginx.conf`，找到 `location /ECAPI/`：

```nginx
location /ECAPI/ {
  # === 取消下面 5 行註解，替換 <BACKEND-URL> ===
  proxy_pass         https://ebm-backend-xxxxx-de.a.run.app;
  proxy_set_header   Host $proxy_host;
  proxy_set_header   X-Real-IP $remote_addr;
  proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header   X-Forwarded-Proto $scheme;

  # === 移除下面的 503 fallback ===
  # default_type application/json;
  # return 503 '{"error":"backend not deployed yet"...}';
}
```

然後 `./deploy.sh` 重推前端，前端打 `/ECAPI/*` 就會反向代理到後端。**前端程式碼完全不用改**（因為 `api/client.ts` 打的一直是 `/ECAPI`）。

### 6.4 CORS 與 Cookie 注意

因為前端透過**同源反向代理**（`前端 domain/ECAPI/*`）打後端，**不會有 CORS 問題**。

但如果未來改成「前端直接打後端 URL」（跨域），後端要：

1. 在 `Program.cs` 設 CORS 白名單前端 domain
2. Cookie 回應時加 `SameSite=None; Secure`
3. 前端 fetch 要 `credentials: 'include'`（已設）

### 6.5 API 型別自動產生

正式開發時，把 `src/types/api.ts` 的手動型別換成自動產：

```bash
npm install -D openapi-typescript

# 從 api.json 產全套型別
npx openapi-typescript ../api.json -o src/types/api.generated.ts
```

然後 `types/api.ts` 改成 `export * from './api.generated'`。

---

## 7. 已知限制與 TODO

### 7.1 功能缺口

- [ ] **產品編輯表單**（Admin）— 目前只能看，不能編輯
- [ ] **模組獨立管理頁**（Admin）— 目前只在產品頁看得到模組
- [ ] **忘記密碼 / 註冊** 真正接 API
- [ ] **帳戶儲值**（加值按鈕目前是假的）
- [ ] **訂單取消 / 退款**流程
- [ ] **報告頁** (`/api/admin/reports/*`)
- [ ] **PDF 訂單下載**（UI 有按鈕但無實作）
- [ ] **i18n 中英切換**（帳戶設定有選項但無實作）
- [ ] **Router guard**（未登入重導登入）
- [ ] **E2E 測試**（Playwright / Cypress）
- [ ] **單元測試**（Vitest）

### 7.2 技術債

- `src/types/api.ts` 目前手寫 7 個核心 schema，應該改用 `openapi-typescript` 從 `api.json` 自動生成全部 48 個
- `src/stores/auth.ts` 的 `autoLoginForDemo()` 上線前要拿掉
- `src/views/LoginView.vue` 的成功 path 目前是 mock，要換成真的 `authApi.login()`
- `Tailwind CDN 存在 `components.html`（Living Styleguide），正式 style guide 站應該改 build
- 沒有 CI workflow（GitHub Actions / Cloud Build trigger）

### 7.3 效能與 SEO

- Vite build 產出已經 code-split（每個 view 獨立 chunk），gzipped 總量 ~60 KB
- SPA 對 SEO 不友善，若需要 SEO 可以考慮改 SSR（Nuxt）或 pre-render（vite-plugin-ssr）
- 首屏關鍵路徑可考慮加 `<link rel="preload">` for Inter / Noto Sans TC
- Tailwind v4 自動 tree-shake，最終 CSS 約 20 KB

### 7.4 安全加固（Production 上線前）

- [ ] 設 custom domain + SSL（`gcloud run domain-mappings create`）
- [ ] 關閉 `--allow-unauthenticated`，改用 Cloud IAP 或自有 auth
- [ ] 設 Cloud Armor WAF 擋 OWASP Top 10
- [ ] Secret 改用 Secret Manager（不寫在環境變數）
- [ ] 加 Content Security Policy header
- [ ] 加 HSTS header（`Strict-Transport-Security`）
- [ ] 設 Cloud Monitoring alert（5xx > 1%、latency p95 > 2s）

---

## 8. Troubleshooting

### 8.1 本地開發

| 症狀 | 原因 | 解法 |
|---|---|---|
| `npm install` 失敗：TypeScript 6.0 not found | npm registry 暫時不通 | `npm install --registry https://registry.npmjs.org/` |
| Port 5173 被佔用 | 已有其他 dev server | `vite --port 5174` 或 `lsof -ti:5173 \| xargs kill` |
| `@/*` import 找不到 | 重啟 IDE / TS server | `Cmd+Shift+P` → `TypeScript: Restart TS Server`（VS Code）|
| Tailwind utility 沒生效 | `vite.config.ts` 沒加 `tailwindcss()` plugin | 檢查 plugin 陣列 |

### 8.2 GCP 部署

| 症狀 | 原因 | 解法 |
|---|---|---|
| `PERMISSION_DENIED: The caller does not have permission` | 沒執行第一次設定 Step 3 IAM 授權 | 重新執行那三個 `add-iam-policy-binding` |
| `Repository does not exist` | 沒建 Artifact Registry repo | 執行第 5.2 節 Step 2 |
| Cloud Run 502 Bad Gateway | Container 沒監聽 `$PORT` 或沒 listen 在 `0.0.0.0` | 我們 nginx 已固定 `listen 8080`，如仍發生查 log |
| 改了 nginx.conf 重推後沒生效 | 瀏覽器 cache | `Cmd+Shift+R` / `Ctrl+F5` 強制 refresh |
| `gcloud builds submit` 太慢 | 第一次拉 base image | 後續會用 cache，若一直慢考慮 `machineType: E2_HIGHCPU_8`（已設 in cloudbuild.yaml）|
| SPA 路由 `/app/xxx` 404 | Container 沒 SPA fallback | `nginx.conf` 應有 `try_files $uri $uri/ /index.html;` |
| 後端 CORS 錯誤 | 跨域沒設白名單 | 用 nginx 反向代理避免（已設 placeholder）|

### 8.3 程式執行期

| 症狀 | 原因 | 解法 |
|---|---|---|
| Tailwind class 沒渲染 | class name 動態拼接 | Tailwind 無法靜態分析動態 class，改成完整列出 |
| Pinia store 「cannot access before initialization」 | SSR 相關問題 | 確認沒有 top-level `useXxxStore()`，只能在 `<script setup>` 內 |
| TypeScript 「possibly undefined」 | 陣列 `[0]` 存取、optional chaining | 加 null check 或用 `!` 斷言（小心）|

---

## 9. 交接檢查清單

### 9.1 上線團隊接手第一天

- [ ] 拿到本專案 Git repo 存取權
- [ ] 拿到 GCP project 的 `roles/editor` 或等效權限
- [ ] 確認能執行 `gcloud auth login` 並 `gcloud config get-value project` 正確
- [ ] 本機 `npm install` + `npm run dev` 跑起來、打開瀏覽器能走完購買流程
- [ ] 閱讀本手冊第 1-4 章
- [ ] 閱讀 [DEPLOY.md](./DEPLOY.md)（實際部署步驟）

### 9.2 第一次上線（預計 1 小時）

- [ ] 完成第 5.2 節「第一次部署前置」
- [ ] 第一次 `./deploy.sh`，驗證拿到 URL
- [ ] 完成第 5.5 節「部署後驗證 Checklist」
- [ ] 設 Cloud Build GitHub trigger（選用，見 5.4）
- [ ] 把 Live URL 回報給 Wayne / PM

### 9.3 日常維運

- [ ] `git pull` → `./deploy.sh` 就能推
- [ ] 查 log：`gcloud run services logs tail ebm-frontend --region asia-east1`
- [ ] 回滾：`gcloud run services update-traffic ebm-frontend --to-revisions=ebm-frontend-00001-xyz=100 --region asia-east1`

---

## 10. 參考資源

### 10.1 內部文件

| 文件 | 位置 | 用途 |
|---|---|---|
| 本手冊 | `frontend/HANDOFF.md` | 交接總覽 |
| 部署詳解 | `frontend/DEPLOY.md` | GCP Cloud Run step-by-step |
| 專案說明 | `frontend/README.md` | 技術棧、開發流程 |
| Living Styleguide | `../components.html` | 11 章 UI 規範（2634 行）|
| API 規格 | `../api.json` | OpenAPI 3.0.1 · 65 endpoints |
| Design skill | `../files/cpq-design-language.zip` | 設計 tokens + 4 templates + 5 平台風格指南 |

### 10.2 外部文件

- [Vue 3 官方文件](https://vuejs.org/) · [Composition API](https://vuejs.org/guide/introduction.html#api-styles)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router 4](https://router.vuejs.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Vite](https://vite.dev/)
- [Google Cloud Run 官方文件](https://cloud.google.com/run/docs)
- [Cloud Build 文件](https://cloud.google.com/build/docs)
- [Artifact Registry 定價](https://cloud.google.com/artifact-registry/pricing)

### 10.3 聯絡窗口

| 角色 | 姓名 | 信箱 | 備註 |
|---|---|---|---|
| 原開發者 / 架構決策 | 丁偉能 (Wayne Ting) | ebm.wayne.ting1115@gmail.com | 設計決策、技術選型、商業邏輯 |
| 上線團隊 | _（待填）_ | | GCP 部署、CI/CD |
| PM / 產品 | _（待填）_ | | 需求變更、優先序 |
| 後端 .NET 開發 | _（待填，未產出）_ | | 開始後更新 |

---

## 附錄 A · Git Commit 慣例（建議）

```
<type>(<scope>): <subject>

<body>

<footer>
```

**type**：`feat` / `fix` / `refactor` / `style` / `perf` / `test` / `docs` / `chore` / `build` / `ci`  
**scope**（選用）：`auth` / `cart` / `product` / `dongle` / `order` / `admin` / `ui` / `deploy`

範例：
```
feat(cart): 加入關聯子項目自動帶出邏輯
fix(admin): 訂單狀態切換後畫面不更新
deploy: 調整 Cloud Run max-instances 至 10
```

## 附錄 B · 首次啟動最小測試腳本

```bash
#!/usr/bin/env bash
# 放在 frontend/ 下存成 smoke-test.sh（可選）
set -e

URL=$(gcloud run services describe ebm-frontend --region asia-east1 --format='value(status.url)')
echo "Testing: $URL"

# 1. Health check
curl -fsS "$URL/health" | grep -q "ok" && echo "✓ /health OK" || { echo "✗ /health FAIL"; exit 1; }

# 2. Homepage
curl -fsS -o /dev/null -w "%{http_code}" "$URL/" | grep -q "200" && echo "✓ / 200 OK" || { echo "✗ / FAIL"; exit 1; }

# 3. SPA fallback
curl -fsS -o /dev/null -w "%{http_code}" "$URL/app/dongles" | grep -q "200" && echo "✓ SPA fallback OK" || echo "✗ SPA fallback FAIL"

# 4. API placeholder
curl -fsS -X POST "$URL/ECAPI/api/auth/login" -o /dev/null -w "%{http_code}" | grep -q "503" && echo "✓ API placeholder OK (503 as expected)" || echo "⚠ API returned unexpected status"

echo ""
echo "Smoke test complete. Visit $URL to test UI manually."
```

---

**— 手冊結束 —**

有任何疑問，優先順序：

1. 先查本手冊第 8 章 Troubleshooting
2. 查 `DEPLOY.md` 的對應章節
3. 查官方文件（第 10.2 節）
4. 聯繫 Wayne（ebm.wayne.ting1115@gmail.com）

# 部署到 Google Cloud Run

本指南把 EBM 前端 Vue 3 專案部署成 Cloud Run service。**整個過程 30 分鐘內完成**，後續每次 deploy 一行 `./deploy.sh` 搞定。

---

## 📋 前置要求

- [x] GCP project（已有、billing 已開）
- [x] `gcloud` CLI 已安裝並 `gcloud auth login` 完成
- [x] 本機有 `git`（用 commit SHA 當 image tag）

驗證：

```bash
gcloud auth list                    # 應該看到你的帳號
gcloud config get-value project     # 應該看到 project ID
```

---

## 🚀 第一次設定（只做一次）

### Step 1. 啟用需要的 GCP APIs

```bash
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com
```

第一次執行會花 1-2 分鐘。

### Step 2. 建立 Artifact Registry repository

Artifact Registry 是 GCP 新版的 container image 倉庫（取代舊的 gcr.io）。一個 project 建一個 repo 就好：

```bash
gcloud artifacts repositories create ebm-ecommerce \
  --repository-format=docker \
  --location=asia-east1 \
  --description="EBM Technologies 電子商務平台的所有 container images"
```

> 💡 `asia-east1` 是彰化機房，離台灣最近、延遲最低。如果你偏好別的區域（例如 `asia-southeast1` 新加坡、`us-central1` 愛荷華），改 `REGION` 環境變數即可。

### Step 3. 授權 Cloud Build 可以 push image + deploy

Cloud Build 需要 2 個 IAM 角色：

```bash
PROJECT_ID=$(gcloud config get-value project)
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
CLOUD_BUILD_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

# Cloud Build 能 push image 到 Artifact Registry
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/artifactregistry.writer"

# Cloud Build 能 deploy Cloud Run
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/run.admin"

# Cloud Build 能當 Cloud Run service account 身份 deploy
gcloud iam service-accounts add-iam-policy-binding \
  "${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/iam.serviceAccountUser"
```

這三個指令只跑一次（第一次 deploy 前）。

---

## 🚢 每次部署（30 秒）

進到 `frontend/` 資料夾，執行：

```bash
./deploy.sh
```

腳本會：

1. 讀取你當前 gcloud project
2. 算出當前 git commit 的 short SHA 當 image tag（或 timestamp fallback）
3. `gcloud builds submit` → 觸發 Cloud Build 跑 Dockerfile multi-stage build → push 到 Artifact Registry
4. `gcloud run deploy` → 拉新 image 起 Cloud Run service
5. 印出 live URL

**第一次部署** 約需 3-5 分鐘（要下載 base image）。後續部署約 1-2 分鐘（layer cache）。

### 覆寫預設值

```bash
# 換 region
REGION=us-central1 ./deploy.sh

# 換 service name（如果想同時跑 staging + production）
SERVICE=ebm-frontend-staging ./deploy.sh

# 加大 min-instances 避免冷啟動
MIN_INSTANCES=1 ./deploy.sh
```

---

## 🔁 設 GitHub 自動 CI/CD（選用）

如果你想「push main 就自動 deploy」，cloudbuild.yaml 已經寫好了：

1. Cloud Console → Cloud Build → **Triggers** → **Create Trigger**
2. Source → 連你的 GitHub repo
3. Event → **Push to branch**
4. Branch → `^main$`
5. Configuration → **Cloud Build configuration file**
6. File location → `frontend/cloudbuild.yaml`
7. Save

接下來 `git push origin main` 就會自動 build + deploy。

---

## 🔌 日後加入 .NET 後端時的 2 步改動

當你把後端 `.NET 8/9` 也推到 Cloud Run（假設 service name `ebm-backend`）：

```bash
# 1. 取得後端 Cloud Run URL
BACKEND_URL=$(gcloud run services describe ebm-backend \
  --region asia-east1 --format='value(status.url)')
echo $BACKEND_URL
# → https://ebm-backend-xxxx-de.a.run.app

# 2. 編輯 frontend/nginx.conf
```

把 `nginx.conf` 的 `location /ECAPI/` 區塊改成：

```nginx
location /ECAPI/ {
  proxy_pass         https://ebm-backend-xxxx-de.a.run.app;
  proxy_set_header   Host $proxy_host;
  proxy_set_header   X-Real-IP $remote_addr;
  proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header   X-Forwarded-Proto $scheme;
}
```

然後 `./deploy.sh` 重推前端即可。

### 關於 CORS 與 Cookie

因為前端 nginx 做反向代理（同源 `/ECAPI/*`），**不會有 CORS 問題**。
但如果未來改成前端直接打後端 URL（跨域），後端要：

1. 設 CORS 允許前端 Cloud Run domain
2. Cookie 加上 `SameSite=None; Secure`
3. fetch 加 `credentials: 'include'`（已設）

---

## 💰 成本估算（Cloud Run · 台灣區域）

| 項目 | 單價 | 月費（demo 規模）|
|---|---|---|
| CPU 時間 | $0.000024 / vCPU-秒 | ~$0（min-instances=0 時閒置不收費）|
| Memory | $0.0000025 / GiB-秒 | ~$0 |
| Requests | 前 200 萬/月免費 | ~$0 |
| Egress | 前 1 GB/月免費 | ~$0 |
| Artifact Registry | 前 0.5 GB 免費，超過 $0.10 / GB | ~$0（我們 image < 30 MB）|
| Cloud Build | 前 120 min/日 免費 | ~$0 |

結論：**自己練手規模月費 0 元**。規模起來後估每月 < $5。

---

## 🐛 常見錯誤排查

### `PERMISSION_DENIED: The caller does not have permission`

沒跑第一次設定的 Step 3 IAM 授權。重新執行那三個 `add-iam-policy-binding` 指令。

### `Repository does not exist`

沒建 Artifact Registry repo（Step 2）。或 `--location` 跟 deploy.sh 的 REGION 不一致。

### Cloud Run 回 `502 Bad Gateway`

通常是 container 沒監聽 `$PORT` 或沒 listen 在 `0.0.0.0`。我們 nginx 已經固定 `listen 8080`，Cloud Run 默認 PORT=8080，應該不會碰到。若仍發生，看 log：

```bash
gcloud run services logs read ebm-frontend --region asia-east1 --limit 50
```

### 改了 nginx.conf 重推後沒生效

瀏覽器快取了舊 index.html。強制 refresh（`Cmd+Shift+R` / `Ctrl+F5`）。或檢查 nginx.conf 的 `location = /index.html` cache 設定是否正確。

### `gcloud builds submit` 太慢（> 5 分鐘）

第一次因為要拉 base image（`node:22-alpine` + `nginx:1.27-alpine`）比較慢，後續會用 cache。如果想再加速，cloudbuild.yaml 已設 `machineType: E2_HIGHCPU_8`（8 vCPU build 機）。

---

## 🔐 安全加固（上 production 前再做）

- [ ] 設 custom domain + SSL（`gcloud run domain-mappings create`）
- [ ] 關閉 `--allow-unauthenticated`，改用 Cloud IAP 控制存取
- [ ] 設 Cloud Armor WAF 擋常見攻擊
- [ ] secret（API key 等）改用 Secret Manager，不要寫在 env
- [ ] 設 Cloud Monitoring alert（例如 5xx 率 > 1%）

這些目前自己練手階段都不必做。

---

## 📚 參考

- [Cloud Run 官方文件](https://cloud.google.com/run/docs)
- [Cloud Build Quickstart](https://cloud.google.com/build/docs/quickstart-build)
- [Artifact Registry 定價](https://cloud.google.com/artifact-registry/pricing)

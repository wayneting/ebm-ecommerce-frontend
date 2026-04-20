# 🚀 EBM Frontend · B Team 快速上線指南

本指南專為 B Team 設計，只需 **一步設定 + 一行指令**，即可在 30 分鐘內將前端部署至 Google Cloud Run。

## 📋 準備工作

請確保本機已安裝：
- [Google Cloud SDK (gcloud CLI)](https://cloud.google.com/sdk/docs/install)
- [Git](https://git-scm.com/downloads)

驗證登入：
```bash
gcloud auth login
gcloud auth configure-docker   # 授權 Docker 使用 gcloud 認證（選用，Cloud Build 不需要）
```

---

## ⚡ 第一次設定（只需執行一次）

請在終端機貼上這段指令，它會自動完成所有 GCP API 啟用、Repo 建立與 IAM 授權：

```bash
# 1. 啟動 APIs
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

# 2. 建立 Artifact Registry (亞太彰化機房)
gcloud artifacts repositories create ebm-ecommerce \
  --repository-format=docker --location=asia-east1

# 3. 授權 Cloud Build 權限
PROJECT_ID=$(gcloud config get-value project)
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
CLOUD_BUILD_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:${CLOUD_BUILD_SA}" --role="roles/artifactregistry.writer"
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:${CLOUD_BUILD_SA}" --role="roles/run.admin"
gcloud iam service-accounts add-iam-policy-binding "${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --member="serviceAccount:${CLOUD_BUILD_SA}" --role="roles/iam.serviceAccountUser"
```

---

## 🚢 一行指令上線

進到 `frontend/` 資料夾，執行：

```bash
./deploy.sh
```

### 它會幫你做什麼？
1. **自動檢測**：讀取你當前的 `gcloud project`。
2. **雲端編譯**：觸發 `Cloud Build` 在雲端進行 Multi-stage Docker build（打包 Vue 3 + Tailwind v4 + Nginx）。
3. **安全儲存**：將 Image 推送到 `Artifact Registry`。
4. **即時部署**：在 `Cloud Run` 啟動服務並自動產生 HTTPS 連結。

---

## 🔗 相關資源
- `deploy.sh`: 部署腳本，支援環境變數覆寫（如 `REGION=us-central1 ./deploy.sh`）。
- `cloudbuild.yaml`: 雲端編譯設定檔。
- `DEPLOY.md`: 完整部署手冊（包含自動 CI/CD 流程）。

---
> [!IMPORTANT]
> 部署完成後，請記住 `Live URL`。未來只需在 source code 改動後再次執行 `./deploy.sh` 即可完成更新。

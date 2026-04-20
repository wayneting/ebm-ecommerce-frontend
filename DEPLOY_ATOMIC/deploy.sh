#!/usr/bin/env bash
#
# EBM Frontend · 一鍵部署到 Google Cloud Run
#
# 用法：
#   ./deploy.sh                       # 用當前 gcloud project
#   ./deploy.sh my-project-id         # 指定 project
#   REGION=us-central1 ./deploy.sh    # 覆寫 region（預設 asia-east1）
#
# 第一次執行前請確認：
#   1. gcloud auth login 已登入
#   2. 已執行 gcloud config set project <PROJECT_ID>
#   3. Artifact Registry repo 已建（詳見 DEPLOY.md）

set -euo pipefail

# ──────────────────────────────────
#   設定（可用環境變數覆寫）
# ──────────────────────────────────
PROJECT_ID="${1:-$(gcloud config get-value project 2>/dev/null || echo "")}"
REGION="${REGION:-asia-east1}"
SERVICE="ebm-final-production"
REPO="${REPO:-ebm-ecommerce}"
MEMORY="${MEMORY:-256Mi}"
CPU="${CPU:-1}"
MIN_INSTANCES="${MIN_INSTANCES:-0}"
MAX_INSTANCES="${MAX_INSTANCES:-3}"

# ──────────────────────────────────
#   前置檢查
# ──────────────────────────────────
if [[ -z "$PROJECT_ID" ]]; then
  echo "❌ 找不到 GCP project ID。" >&2
  echo "   執行：gcloud config set project YOUR_PROJECT_ID" >&2
  echo "   或：./deploy.sh YOUR_PROJECT_ID" >&2
  exit 1
fi

if ! command -v gcloud &> /dev/null; then
  echo "❌ gcloud CLI 未安裝。請至 https://cloud.google.com/sdk/docs/install 安裝。" >&2
  exit 1
fi

# ──────────────────────────────────
#   組裝 image URI
# ──────────────────────────────────
# 優先用 git commit SHA 當 tag；非 git repo 則 fallback 到 timestamp
if TAG=$(git rev-parse --short HEAD 2>/dev/null); then
  :
else
  TAG=$(date +%Y%m%d-%H%M%S)
fi

IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/${SERVICE}:${TAG}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " EBM Frontend · Deploy to Cloud Run"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Project:   ${PROJECT_ID}"
echo "  Region:    ${REGION}"
echo "  Service:   ${SERVICE}"
echo "  Image:     ${IMAGE}"
echo "  Resources: ${CPU} CPU / ${MEMORY} RAM / ${MIN_INSTANCES}-${MAX_INSTANCES} instances"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ──────────────────────────────────
#   Step 1: Build + Push (Cloud Build)
# ──────────────────────────────────
echo "▶ [1/2] Cloud Build 開始（Dockerfile multi-stage → push Artifact Registry）..."
echo ""
gcloud builds submit \
  --tag "${IMAGE}" \
  --project "${PROJECT_ID}" \
  --region "${REGION}"

echo ""
echo "✓ [1/2] Image push 完成"
echo ""

# ──────────────────────────────────
#   Step 2: Deploy Cloud Run
# ──────────────────────────────────
echo "▶ [2/2] 部署到 Cloud Run..."
echo ""
gcloud run deploy "${SERVICE}" \
  --image "${IMAGE}" \
  --project "${PROJECT_ID}" \
  --region "${REGION}" \
  --platform managed \
  --allow-unauthenticated \
  --memory "${MEMORY}" \
  --cpu "${CPU}" \
  --min-instances "${MIN_INSTANCES}" \
  --max-instances "${MAX_INSTANCES}" \
  --port 8080

echo ""
URL=$(gcloud run services describe "${SERVICE}" \
  --region "${REGION}" \
  --project "${PROJECT_ID}" \
  --format='value(status.url)')

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " ✓ 部署完成"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Live URL: ${URL}"
echo ""
echo "  測試："
echo "    curl ${URL}/health           # 應該回 'ok'"
echo "    open ${URL}                  # 瀏覽器開啟前端"
echo "    open ${URL}/styleguide       # UI Kit 測試頁"
echo ""

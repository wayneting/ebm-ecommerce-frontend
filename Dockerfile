# syntax=docker/dockerfile:1.6
#
# EBM Frontend — Multi-stage build
#   Stage 1: Node 22 編譯 Vue 3 + Tailwind v4 → dist/
#   Stage 2: nginx:alpine 靜態服務 + SPA fallback + API 反向代理
#
# 最終映像大小：約 25 MB（alpine + gzip 後）
# 對應 Cloud Run：PORT=8080、stateless、min-instance=0（不用錢）

# ─────────────────────────────────────────
# Stage 1: Build
# ─────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# 先複製 package 檔案，善用 Docker layer cache
# （source code 改動時不會重跑 npm ci）
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit --no-fund

# 複製 source 並 build
COPY . .
RUN npm run build

# ─────────────────────────────────────────
# Stage 2: Runtime
# ─────────────────────────────────────────
FROM nginx:1.27-alpine

# 移除預設 config
RUN rm /etc/nginx/conf.d/default.conf

# 放入客製 nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 放入 build 產物
COPY --from=builder /app/dist /usr/share/nginx/html

# Cloud Run 預設端口
EXPOSE 8080

# nginx 必須以 foreground 模式執行，否則 container 會立刻退出
CMD ["nginx", "-g", "daemon off;"]

# マルチステージビルドを使用して最適化されたイメージを作成
FROM node:18-alpine AS builder

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー（依存関係のキャッシュ最適化）
COPY package*.json ./

# 依存関係をインストール（devDependenciesも含む）
RUN npm ci

# ソースコードをコピー
COPY . .

# TypeScriptビルドを実行
RUN npm run build

# プロダクション用の軽量イメージ
FROM node:18-alpine AS production

# 非rootユーザーを作成
RUN addgroup -g 1001 -S mcpuser && \
    adduser -S mcpuser -u 1001

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonをコピー
COPY package*.json ./

# プロダクション依存関係のみをインストール
RUN npm ci --only=production && npm cache clean --force

# ビルド済みファイルをbuilderステージからコピー
COPY --from=builder /app/dist ./dist

# ログディレクトリを作成
RUN mkdir -p logs && chown -R mcpuser:mcpuser /app

# 非rootユーザーに切り替え
USER mcpuser

# ポートを公開（MCPサーバーは通常stdio経由だが、将来のHTTP対応に備えて）
EXPOSE 3000

# ヘルスチェック用のスクリプト
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "console.log('MCP Server Health Check: OK')" || exit 1

# MCPサーバーを起動
CMD ["npm", "start"]
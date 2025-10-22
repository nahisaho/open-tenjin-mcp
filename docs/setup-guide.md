# セットアップガイド

Open Tenjin MCPサーバーのインストールと設定方法を説明します。

## 前提条件

### システム要件

- **Node.js**: 18.0.0以上
- **npm**: 8.0.0以上（Node.jsに同梱）
- **Git**: 2.0以上
- **OS**: Linux, macOS, Windows

### 確認方法

```bash
# Node.jsのバージョン確認
node --version

# npmのバージョン確認
npm --version

# Gitのバージョン確認
git --version
```

## インストール手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/nahisaho/open-tenjin-mcp.git
cd open-tenjin-mcp
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. プロジェクトのビルド

```bash
npm run build
```

### 4. 動作確認

```bash
npm start
```

正常に起動すると、以下のようなメッセージが表示されます：

```
Open Tenjin MCP Server starting...
Server Info: {
  name: 'open-tenjin-mcp',
  version: '1.0.0',
  description: 'Educational data MCP server providing Japanese curriculum guidelines, textbooks, and educational materials'
}
```

## MCPクライアントでの設定

### Claude Desktop

Claude Desktopで使用する場合の設定手順：

#### 1. 設定ファイルの場所

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

#### 2. 設定ファイルの編集

```json
{
  "mcpServers": {
    "open-tenjin": {
      "command": "node",
      "args": ["/absolute/path/to/open-tenjin-mcp/dist/index.js"]
    }
  }
}
```

**重要**: `/absolute/path/to/open-tenjin-mcp`を実際のパスに置き換えてください。

#### 3. Claude Desktopの再起動

設定ファイルを編集した後、Claude Desktopを再起動してください。

### Cursor

Cursorで使用する場合：

#### 1. MCP設定の追加

Cursorの設定画面で以下のMCP設定を追加：

```json
{
  "mcp": {
    "servers": {
      "open-tenjin": {
        "command": "node",
        "args": ["/absolute/path/to/open-tenjin-mcp/dist/index.js"]
      }
    }
  }
}
```

### その他のMCPクライアント

標準のMCPプロトコルに対応しているため、任意のMCPクライアントで使用可能です。

## 開発環境のセットアップ

### 開発モードでの起動

```bash
npm run dev
```

TypeScriptファイルを直接実行し、変更を監視します。

### リアルタイムビルド

```bash
# ターミナル1: TypeScriptの監視ビルド
npm run build -- --watch

# ターミナル2: サーバーの起動
npm start
```

### コード品質チェック

```bash
# ESLintによる静的解析
npm run lint

# Prettierによるフォーマット
npm run format

# テストの実行
npm test
```

## カスタマイズ

### データの追加・更新

教育データは以下のJSONファイルで管理されています：

```
src/data/
├── curriculum-guidelines.json    # 学習指導要領
├── textbooks.json               # 教科書情報
└── educational-materials.json   # 教材情報
```

#### 新しい学習指導要領の追加例

```json
{
  "id": "high_physics_2024",
  "title": "高等学校学習指導要領（令和元年告示）物理",
  "educationStage": "high",
  "subject": "science",
  "version": "2024",
  "publishedDate": "2019-03-29T00:00:00.000Z",
  "effectiveDate": "2022-04-01T00:00:00.000Z",
  "units": [
    {
      "id": "high_physics_mechanics",
      "title": "力学",
      "educationStage": "high",
      "subject": "science",
      "grade": ["high_1"],
      "goals": ["運動の法則について理解する"],
      "contents": [
        {
          "id": "physics_motion",
          "level": "content",
          "title": "物体の運動",
          "description": "等速直線運動、等加速度運動について学習する",
          "keywords": ["運動", "速度", "加速度"]
        }
      ]
    }
  ]
}
```

### ポート設定

デフォルトでは標準入出力を使用しますが、HTTPサーバーとして起動することも可能です：

```typescript
// src/index.ts に追加
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`HTTP server running on port ${PORT}`);
});
```

### ログ設定

より詳細なログが必要な場合：

```bash
# 環境変数でログレベルを設定
export LOG_LEVEL=debug
npm start
```

## トラブルシューティング

### よくある問題

#### 1. Node.jsのバージョンエラー

```
Error: This package requires Node.js version 18.0.0 or higher
```

**解決方法**: Node.js 18以上をインストール

```bash
# nvm使用の場合
nvm install 18
nvm use 18

# 直接インストールの場合
# https://nodejs.org/ からダウンロード
```

#### 2. モジュールが見つからないエラー

```
Error: Cannot find module '@modelcontextprotocol/sdk'
```

**解決方法**: 依存関係を再インストール

```bash
rm -rf node_modules package-lock.json
npm install
```

#### 3. TypeScriptコンパイルエラー

```
error TS2307: Cannot find module './models/curriculum.js'
```

**解決方法**: モジュール解決の設定確認

```bash
# tsconfig.jsonの設定確認
npm run build
```

#### 4. MCPクライアントで認識されない

**確認事項**:
- パスが正しいか
- ファイルが実行可能か
- Node.jsが正しくインストールされているか

```bash
# パーミッションの確認
ls -la dist/index.js

# 直接実行テスト
node dist/index.js
```

### ログ確認

```bash
# サーバーログの確認
npm start 2>&1 | tee server.log

# エラーログのみ
npm start 2>error.log
```

### デバッグモード

```bash
# Node.jsデバッガーで起動
node --inspect dist/index.js

# Chrome DevToolsでデバッグ
# chrome://inspect でアクセス
```

## パフォーマンス最適化

### メモリ使用量の最適化

```bash
# Node.jsのメモリ制限を設定
node --max-old-space-size=512 dist/index.js
```

### データ読み込みの最適化

大量のデータを扱う場合は、遅延読み込みを実装：

```typescript
// services/data-storage.ts
private async loadDataOnDemand(type: string) {
  if (!this.cache[type]) {
    this.cache[type] = await this.loadData(type);
  }
  return this.cache[type];
}
```

## 本番環境でのデプロイ

### PM2を使用した本番運用

```bash
# PM2のインストール
npm install -g pm2

# アプリケーションの起動
pm2 start dist/index.js --name open-tenjin-mcp

# 起動設定の保存
pm2 save
pm2 startup
```

### Docker化

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/
COPY src/data/ ./src/data/

EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### ヘルスチェック

```bash
# サーバーの動作確認
curl -X POST http://localhost:3000 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"initialize","id":1}'
```

## サポート

技術的な問題や質問がある場合：

- **Issues**: [GitHub Issues](https://github.com/nahisaho/open-tenjin-mcp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/nahisaho/open-tenjin-mcp/discussions)
- **Wiki**: [GitHub Wiki](https://github.com/nahisaho/open-tenjin-mcp/wiki)
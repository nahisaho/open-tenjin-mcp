# Open Tenjin MCP

教育データ（日本の学習指導要領、教科書、教材情報）を提供するModel Context Protocol（MCP）サーバーです。

## 概要

Open Tenjin MCPは、日本の教育システムに特化した教育データを、標準化されたMCPプロトコルを通じて提供します。AI アシスタントや教育アプリケーションが、体系化された教育データに簡単にアクセスできるようになります。

## 🔬 プロジェクトの目的と性質

**このプロダクトは実験的・検証目的のプロトタイプです。**

このOpen Tenjin MCPプロジェクトは、**教育分野におけるModel Context Protocol (MCP)の有効性と実用性を検証する**ために開発された実験的なプロトタイプです。実際の教育現場での運用を想定した本格的なプロダクションシステムではありません。

### 🎯 検証目的

- **MCPプロトコルの教育データ提供における有効性**の実証
- **AI教育アシスタントへの構造化データ統合**の効果測定
- **教育データベースのMCP標準化**による相互運用性の評価
- **教育現場でのAI活用可能性**の探索と課題抽出

### ⚠️ 利用上の注意

- **実験的性質**: システム仕様や機能は予告なく変更される可能性があります
- **データ品質**: 一部は検証用の仮想データが含まれており、実用性は限定的です
- **可用性**: 継続的なサービス提供は保証されていません
- **サポート**: 商用レベルのサポートは提供されていません

### 📊 期待される成果

このプロトタイプを通じて、以下の知見を得ることを目指しています：

- MCPプロトコルの教育データ統合における技術的課題
- AI教育アシスタントの実用性と限界
- 教育現場でのMCP採用に向けた要件と制約
- 教育データの標準化と相互運用性の実現可能性

**研究・開発目的での利用は歓迎しますが、実際の教育現場での本格運用はお控えください。**

### 提供データ

- **学習指導要領**: 文部科学省が定める教育課程の基準
  - 教育段階別（小学校、中学校、高等学校、特別支援学校）
  - 教科別の詳細な内容項目
  - ブルームのタキソノミーによる学習目標分類
  - **📋 準拠**: [平成29・30・31年改訂学習指導要領](https://www.mext.go.jp/a_menu/shotou/new-cs/1384661.htm)に基づく公式データ

- **教科書情報**: 検定済み教科書の詳細情報
  - 出版社、著者、検定状況
  - 目次構造と学習指導要領との対応関係
  - ISBN、価格、発行年等のメタデータ
  - **⚠️ 注意**: 教科書データは生成AIによって作成された架空の仮想データです

- **教材情報**: 学習・指導用教材のデータベース
  - ワークシート、動画、インタラクティブ教材等
  - 利用場面、難易度、対象学年の分類
  - クリエイティブ・コモンズライセンス等の権利情報
  - **⚠️ 注意**: 教材データは生成AIによって作成された架空の仮想データです

- **教育理論**: 教育実践の理論的基盤となる重要な理論群
  - **主要な50の教育理論を収録**: 現代教育学における最重要理論を体系的に整理
  - 学習理論、認知心理学、教授設計、評価理論等の分野
  - ブルームのタクソノミー、構成主義、認知負荷理論等
  - 実践的応用方法と具体的な実装戦略
  - エビデンスに基づく理論の有効性評価

## 特徴

- **最新MCP準拠**: Model Context Protocol 2025-06-18仕様に完全準拠
- **教育理論ベース**: ブルームのタキソノミー等の教育理論に基づいた分類
- **検索・フィルタリング**: 多様な条件での効率的な教育データ検索
- **オープンソース**: MIT ライセンスで自由に利用・改変可能
- **TypeScript**: 型安全性を重視した実装
- **著作権クリア**: 仮想データによる完全な著作権問題回避

## 重要な注意事項

### 仮想データについて

このプロジェクトで提供される教科書・教材データベースは、**生成AIによって作成された完全に架空の仮想データ**です。

**⚠️ 免責事項:**
- **実在しない出版社**: すべての教科書会社名は架空のものです
- **仮想のISBN**: ISBN番号は実在しないものです
- **架空の認可番号**: 文部科学省の検定認可番号は実在しないものです
- **仮想の連絡先**: 記載されている連絡先（メール、電話等）は実在しません
- **著作権対応**: Creative Commonsライセンスの下で提供され、著作権問題を回避しています

**✅ 使用目的:**
- 教育システム開発のサンプルデータとして
- MCPプロトコルの実装例として
- 教育データベース構造の参考として
- AI教育アプリケーションの開発・テスト用として

**❌ 使用制限:**
- 実際の教育現場での教科書情報として使用しないでください
- 商用利用時は仮想データである旨を明記してください
- 実在する教科書会社の情報と混同しないよう注意してください

### 学習指導要領データについて

学習指導要領データは、文部科学省が公開している**平成29・30・31年改訂学習指導要領**に基づいて作成されており、実際の教育基準を反映しています。

**📚 参照資料:**
- [平成29・30・31年改訂学習指導要領、解説等 | 文部科学省](https://www.mext.go.jp/a_menu/shotou/new-cs/1384661.htm)
- 小学校学習指導要領（平成29年告示）
- 中学校学習指導要領（平成29年告示）  
- 高等学校学習指導要領（平成30年告示）
- 特別支援学校学習指導要領（平成31年告示）

これらの公式文書から、教科の目標、内容、評価の観点等を体系的に整理してデータベース化しています。

## インストール

### 前提条件

- Node.js 18.0.0 以上
- npm または yarn

### セットアップ（通常のインストール）

```bash
# リポジトリのクローン
git clone https://github.com/nahisaho/open-tenjin-mcp.git
cd open-tenjin-mcp

# 依存関係のインストール
npm install

# TypeScriptのビルド
npm run build

# サーバーの起動
npm start
```

### 開発環境での実行

```bash
# 開発モードで起動（tsx使用）
npm run dev
```

## Dockerを使用したデプロイメント

Open Tenjin MCPは、Dockerコンテナとして簡単にデプロイできます。

### 前提条件

- Docker 20.0.0 以上
- docker-compose 2.0.0 以上

### Dockerでの起動方法

#### 方法1：デプロイメントスクリプトを使用（推奨）

```bash
# リポジトリのクローン
git clone https://github.com/nahisaho/open-tenjin-mcp.git
cd open-tenjin-mcp

# Dockerイメージをビルド
./deploy.sh build
# または
npm run docker:build

# プロダクション環境で起動
./deploy.sh start
# または
npm run docker:start

# コンテナの状態確認
./deploy.sh status
# または
npm run docker:status

# ログの確認
./deploy.sh logs
# または
npm run docker:logs
```

#### 方法2：Makefileを使用

```bash
# Dockerイメージをビルド
make docker-build

# Dockerコンテナを起動
make docker-run

# コンテナを停止
make docker-stop

# 全てを削除
make docker-clean

# ワンコマンドでビルド＆起動
make docker-all
```

#### 方法3：docker-composeを直接使用

```bash
# プロダクション環境で起動
docker-compose up -d open-tenjin-mcp

# 開発環境で起動
docker-compose up -d open-tenjin-mcp-dev

# ログ確認
docker-compose logs -f

# 停止
docker-compose down
```

#### 方法3：Dockerコマンドを直接使用

```bash
# イメージをビルド
docker build -t open-tenjin-mcp:latest .

# コンテナを起動
docker run -d \
  --name open-tenjin-mcp \
  --restart unless-stopped \
  -v $(pwd)/logs:/app/logs \
  -e NODE_ENV=production \
  -e MCP_LOG_ENABLED=true \
  open-tenjin-mcp:latest
```

### 利用可能なコマンド

デプロイメントスクリプト（`deploy.sh`）では以下のコマンドが利用できます：

```bash
./deploy.sh build     # Dockerイメージをビルド
./deploy.sh start     # プロダクション環境で起動
./deploy.sh dev       # 開発環境で起動
./deploy.sh stop      # コンテナを停止
./deploy.sh restart   # コンテナを再起動
./deploy.sh logs      # ログを表示
./deploy.sh status    # コンテナの状態を確認
./deploy.sh clean     # コンテナとイメージを削除
./deploy.sh help      # 使用方法を表示
```

### 環境変数設定

Dockerコンテナでは以下の環境変数を設定できます：

```bash
# 基本設定
NODE_ENV=production                    # 実行環境（production/development）

# ログ設定
MCP_LOG_ENABLED=true                   # ログ機能の有効/無効
MCP_LOG_LEVEL=info                     # ログレベル（debug/info/warning/error）
MCP_LOG_DIR=/app/logs                  # ログディレクトリ
MCP_LOG_INCLUDE_PARAMS=false           # リクエストパラメーターの記録
```

### データの永続化

ログファイルは `./logs` ディレクトリにマウントされ、コンテナを再起動してもデータが保持されます。

### Docker環境での注意事項

- MCPサーバーは標準入出力（stdio）経由で通信するため、通常はポート公開は不要です
- クライアントアプリケーション（Claude Desktop等）からコンテナ内のプロセスを直接実行する形で利用します
- 開発環境では、ソースコードの変更を反映するためにボリュームマウントを使用します

### GitHub Container Registryからの利用

GitHub ActionsによりDockerイメージが自動的にビルドされ、GitHub Container Registryで公開されます：

```bash
# 最新版をプル
docker pull ghcr.io/nahisaho/open-tenjin-mcp:latest

# 直接実行
docker run -d \
  --name open-tenjin-mcp \
  --restart unless-stopped \
  -v $(pwd)/logs:/app/logs \
  -e NODE_ENV=production \
  -e MCP_LOG_ENABLED=true \
  ghcr.io/nahisaho/open-tenjin-mcp:latest
```

利用可能なタグ：
- `latest` - mainブランチの最新版
- `v1.2.0` - セマンティックバージョンタグ
- `main` - mainブランチ
- `develop` - developブランチ

## 使用方法

### MCPクライアントとしての利用

Open Tenjin MCPは、MCP対応のクライアント（Claude Desktop、Cursor等）から利用できます。

#### Claude Desktopでの設定例

`~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "open-tenjin": {
      "command": "node",
      "args": ["/path/to/open-tenjin-mcp/dist/index.js"]
    }
  }
}
```

### 利用可能なツール

#### 1. 学習指導要領検索 (`search_curriculum`)

```typescript
// 小学校算数の学習指導要領を検索
{
  "educationStage": ["elementary"],
  "subject": ["arithmetic"],
  "keywords": ["数と計算"]
}
```

#### 2. 教科書・教材検索 (`search_textbooks_materials`)

```typescript
// 小学2年生向けの算数教科書を検索
{
  "textbookFilter": {
    "educationStage": ["elementary"],
    "subject": ["arithmetic"],
    "grade": ["elementary_2"]
  }
}
```

#### 3. 教育理論検索 (`search_education_theories`)

```typescript
// 構成主義学習理論を検索
{
  "field": ["constructivism"],
  "applicableStages": ["elementary", "lower_secondary"],
  "keywords": ["協調学習", "能動的学習"]
}
```

#### 4. 詳細情報取得

- `get_curriculum_detail`: 学習指導要領の詳細取得
- `get_textbook_detail`: 教科書の詳細取得  
- `get_material_detail`: 教材の詳細取得
- `get_education_theory_detail`: 教育理論の詳細取得

### リソースアクセス

MCPのリソース機能を使用して、教育データに直接アクセスできます：

- `curriculum://guideline/{id}`: 学習指導要領
- `textbook://book/{id}`: 教科書
- `material://resource/{id}`: 教材
- `theory://concept/{id}`: 教育理論

## API仕様

### データモデル

#### 学習指導要領 (CurriculumGuideline)

```typescript
interface CurriculumGuideline {
  id: string;
  title: string;
  educationStage: EducationStage;
  subject: Subject;
  version: string;
  publishedDate: Date;
  effectiveDate: Date;
  units: CurriculumUnit[];
  generalObjectives: string[];
  overallGoals: string[];
  metadata: {
    documentUrl?: string;
    officialCode?: string;
    revision?: string;
  };
}
```

#### 教科書 (Textbook)

```typescript
interface Textbook {
  id: string;
  title: string;
  publisher: Publisher;
  authors: string[];
  isbn?: string;
  type: TextbookType;
  educationStage: EducationStage;
  subject: Subject;
  targetGrades: Grade[];
  approvalStatus: ApprovalStatus;
  tableOfContents: TableOfContentsItem[];
  // ...その他のプロパティ
}
```

#### 教材 (EducationalMaterial)

```typescript
interface EducationalMaterial {
  id: string;
  title: string;
  description: string;
  type: MaterialType;
  usageContext: UsageContext[];
  difficulty: DifficultyLevel;
  educationStage: EducationStage;
  subject: Subject;
  targetGrades: Grade[];
  resources: MaterialResource[];
  // ...その他のプロパティ
}
```

### 列挙型

#### 教育段階 (EducationStage)

- `elementary`: 小学校
- `junior_high`: 中学校  
- `high`: 高等学校
- `special_needs`: 特別支援学校

#### 教科 (Subject)

- `japanese`: 国語
- `social_studies`: 社会
- `arithmetic`/`mathematics`: 算数・数学
- `science`: 理科
- `english`: 外国語（英語）
- その他多数

#### 学年 (Grade)

- `elementary_1`～`elementary_6`: 小学1年～6年
- `junior_high_1`～`junior_high_3`: 中学1年～3年
- `high_1`～`high_3`: 高校1年～3年

## 開発

### プロジェクト構造

```
open-tenjin-mcp/
├── src/
│   ├── models/           # データモデル定義
│   ├── services/         # ビジネスロジック
│   ├── tools/           # MCPツール定義
│   ├── resources/       # MCPリソース定義
│   ├── data/           # サンプルデータ
│   ├── server.ts       # メインサーバークラス
│   └── index.ts        # エントリーポイント
├── tests/              # テストファイル
├── docs/              # ドキュメント
└── dist/              # ビルド出力
```

### スクリプト

```bash
# ビルド
npm run build

# 開発サーバー起動
npm run dev

# プロダクションサーバー起動
npm start

# テスト実行
npm test

# Lint
npm run lint

# フォーマット
npm run format
```

### データの追加・更新

教育データは `src/data/` 以下のJSONファイルで管理されています：

- `curriculum-guidelines.json`: 学習指導要領（[平成29・30・31年改訂学習指導要領](https://www.mext.go.jp/a_menu/shotou/new-cs/1384661.htm)準拠の公式データ）
- `textbooks.json`: 教科書情報（**生成AI作成の仮想データ**）
- `educational-materials.json`: 教材情報（**生成AI作成の仮想データ**）

新しいデータを追加する場合は、対応するJSONファイルを編集してください。

**⚠️ 教科書・教材データの編集時の注意:**
- 実在する出版社名や著作権のある内容を使用しないでください
- 架空の会社名、ISBN、認可番号を使用してください
- Creative Commonsライセンスまたは仮想ライセンスを適用してください

## ライセンス

MIT License

## 貢献

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## サポート

- Issues: [GitHub Issues](https://github.com/nahisaho/open-tenjin-mcp/issues)
- Discussions: [GitHub Discussions](https://github.com/nahisaho/open-tenjin-mcp/discussions)

## 関連プロジェクト

このプロジェクトは、以下の教育支援システムと連携できます：

- **EducationalDesigner.md**: 教育デザイナーAI Copilot
- **TA_DirectInstruction.md**: 直接指導型ティーチングアシスタント
- **TA_InquiryFacilitation.md**: 思考促進型ティーチングアシスタント

すべてのシステムで、文部科学省の[平成29・30・31年改訂学習指導要領](https://www.mext.go.jp/a_menu/shotou/new-cs/1384661.htm)に準拠した正確な教育基準データを活用できます。

## 更新履歴

### v1.1.0 (2024-10-23)

- **MCP仕様2025-06-18への完全準拠**
  - 最新のModel Context Protocol仕様に準拠
  - 構造化ツール出力（structuredContent）サポート
  - 適切な初期化フローと能力交渉
  - 標準的なJSON-RPCエラーコードの使用
  - Tools/Callレスポンスの`isError`フィールド対応
- **教科書・教材データベースの大幅拡充**
  - 全教育段階（小・中・高・特別支援）の完全カバレッジ達成
  - 総教材数46冊（小学校14科目、中学校13科目、高等学校11科目）
  - 6つの架空教科書会社による著作権クリアなデータ提供
  - **生成AIによる仮想データの明記と免責事項の追加**

### v1.0.0 (2024-10-22)

- 初回リリース
- 学習指導要領、教科書、教材の基本データモデル実装
- MCP Protocol v2024-11-05対応
- 基本的な検索・フィルタリング機能
- サンプルデータの提供

## アクセスログ機能

Open Tenjin MCPは、リクエストの利用状況を記録するアクセスログ機能を提供します。

### ログ設定

環境変数で設定を制御できます：

```bash
# ログ機能の有効/無効（デフォルト: true）
export MCP_LOG_ENABLED=true

# ログレベル（debug, info, warning, error）（デフォルト: info）
export MCP_LOG_LEVEL=info

# ログディレクトリ（デフォルト: logs）
export MCP_LOG_DIR=logs

# リクエストパラメーターの記録（プライバシー保護のためデフォルト: false）
export MCP_LOG_INCLUDE_PARAMS=false
```

### ログファイル

- **場所**: `logs/access-YYYY-MM-DD.jsonl`
- **形式**: JSON Lines（1行1レコード）
- **ローテーション**: 日単位、最大7日分保持
- **最大サイズ**: 10MB/ファイル

### ログ内容例

```json
{
  "timestamp": "2025-10-23T10:30:15.123Z",
  "level": "info",
  "method": "tools/call",
  "requestId": 4,
  "params": {"[PARAMS_EXCLUDED]": "プライバシー保護のためパラメーターを除外"},
  "responseTime": 45,
  "message": "MCP Request: tools/call"
}
```

### プライバシー保護

- **パラメーター除外**: デフォルトでリクエストパラメーターは記録されません
- **機密情報マスク**: password, token, key等の機密フィールドを自動マスク
- **クライアント情報**: 設定により制御可能

## 今後の予定

- [ ] 学習指導要領の継続的更新（文部科学省の改訂に対応）
- [ ] より詳細な学習指導要領解説の追加
- [ ] 教科書検定データベースとの連携
- [ ] 教材評価・レビュー機能
- [ ] 学習analytics連携
- [ ] 多言語対応（英語、中国語等）
- [ ] Web UI管理画面の開発
- [x] アクセスログ機能の実装
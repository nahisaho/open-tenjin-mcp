# 開発者ガイド

Open Tenjin MCPの開発に参加する開発者向けのガイドです。

## 開発環境のセットアップ

### 前提条件

- Node.js 18.0.0以上
- Git 2.0以上
- お好みのエディタ（VS Code推奨）

### 開発環境の構築

```bash
# リポジトリのフォーク・クローン
git clone https://github.com/your-username/open-tenjin-mcp.git
cd open-tenjin-mcp

# 開発依存関係のインストール
npm install

# 開発サーバーの起動（ホットリロード）
npm run dev
```

### VS Code設定

推奨する VS Code拡張機能:

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "bradlc.vscode-tailwindcss"
  ]
}
```

## プロジェクト構造

```
open-tenjin-mcp/
├── src/
│   ├── index.ts              # エントリーポイント
│   ├── server.ts             # メインサーバークラス
│   ├── models/               # データモデル定義
│   │   ├── curriculum.ts     # 学習指導要領モデル
│   │   └── textbook-material.ts # 教科書・教材モデル
│   ├── services/             # ビジネスロジック
│   │   └── data-storage.ts   # データストレージサービス
│   ├── tools/                # MCPツール定義
│   │   └── index.ts
│   ├── resources/            # MCPリソース定義
│   │   └── index.ts
│   └── data/                 # サンプルデータ
│       ├── curriculum-guidelines.json
│       ├── textbooks.json
│       └── educational-materials.json
├── tests/                    # テストファイル
├── docs/                     # ドキュメント
├── dist/                     # ビルド出力
└── package.json              # 依存関係・スクリプト
```

## コーディング規約

### TypeScript スタイルガイド

#### 1. 命名規則

```typescript
// クラス: PascalCase
class CurriculumSearchService {}

// インターフェース: PascalCase
interface CurriculumGuideline {}

// 変数・関数: camelCase
const searchResults = await searchCurriculum();

// 定数: UPPER_SNAKE_CASE
const MAX_SEARCH_RESULTS = 100;

// Enum: PascalCase
enum EducationStage {
  ELEMENTARY = 'elementary',
  JUNIOR_HIGH = 'junior_high'
}
```

#### 2. 型定義

```typescript
// 明示的な型指定を推奨
function searchCurriculum(filter: CurriculumSearchFilter): Promise<CurriculumSearchResult> {
  // 実装
}

// Union型の活用
type SearchableEntity = CurriculumGuideline | Textbook | EducationalMaterial;

// Optional型の適切な使用
interface SearchFilter {
  keywords?: string[];
  required: string;
}
```

#### 3. エラーハンドリング

```typescript
// カスタムエラークラス
class CurriculumNotFoundError extends Error {
  constructor(id: string) {
    super(`Curriculum with id ${id} not found`);
    this.name = 'CurriculumNotFoundError';
  }
}

// 適切なエラーハンドリング
async function getCurriculumById(id: string): Promise<CurriculumGuideline> {
  try {
    const curriculum = await dataStorage.getCurriculumGuidelineById(id);
    if (!curriculum) {
      throw new CurriculumNotFoundError(id);
    }
    return curriculum;
  } catch (error) {
    console.error(`Error fetching curriculum ${id}:`, error);
    throw error;
  }
}
```

### JSON データ規約

#### 1. データ構造の一貫性

```json
{
  "id": "unique_identifier",
  "title": "人間が読める名前",
  "description": "詳細説明",
  "metadata": {
    "createdDate": "2024-01-01T00:00:00.000Z",
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. ID命名規則

```json
{
  "curriculum": "elementary_math_2024",
  "textbook": "tokyo_shoseki_math1_2024",
  "material": "counting_worksheet_1"
}
```

## 新機能の開発

### 1. 新しいツールの追加

#### ステップ1: ツールの定義

```typescript
// src/tools/index.ts
export const newSearchTool: Tool = {
  name: 'new_search_function',
  description: '新しい検索機能の説明',
  inputSchema: {
    type: 'object',
    properties: {
      parameter1: {
        type: 'string',
        description: 'パラメーターの説明'
      }
    },
    required: ['parameter1']
  }
};
```

#### ステップ2: サーバーでの実装

```typescript
// src/server.ts
async executeTool(name: string, args: any): Promise<any> {
  switch (name) {
    // 既存のケース...
    
    case 'new_search_function':
      return await this.handleNewSearch(args);
      
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

private async handleNewSearch(args: any): Promise<any> {
  // 新しい検索機能の実装
  const { parameter1 } = args;
  // 処理ロジック
  return result;
}
```

#### ステップ3: テストの追加

```typescript
// tests/new-search.test.ts
describe('New Search Function', () => {
  it('should return valid results', async () => {
    const server = new OpenTenjinMCPServer();
    const result = await server.executeTool('new_search_function', {
      parameter1: 'test_value'
    });
    
    expect(result).toBeDefined();
    expect(result.totalCount).toBeGreaterThan(0);
  });
});
```

### 2. 新しいデータモデルの追加

#### ステップ1: TypeScript型定義

```typescript
// src/models/new-model.ts
export interface NewDataModel {
  id: string;
  name: string;
  category: NewCategory;
  properties: {
    [key: string]: any;
  };
  metadata: {
    version: string;
    createdDate: Date;
    lastUpdated: Date;
  };
}

export enum NewCategory {
  TYPE_A = 'type_a',
  TYPE_B = 'type_b'
}

export interface NewSearchFilter {
  category?: NewCategory[];
  keywords?: string[];
}
```

#### ステップ2: サンプルデータの作成

```json
// src/data/new-data.json
[
  {
    "id": "sample_new_data_1",
    "name": "サンプルデータ1",
    "category": "type_a",
    "properties": {
      "customField": "value"
    },
    "metadata": {
      "version": "1.0",
      "createdDate": "2024-01-01T00:00:00.000Z",
      "lastUpdated": "2024-01-01T00:00:00.000Z"
    }
  }
]
```

#### ステップ3: データストレージの拡張

```typescript
// src/services/data-storage.ts
export interface DataStorage {
  // 既存のメソッド...
  
  getNewData(): Promise<NewDataModel[]>;
  getNewDataById(id: string): Promise<NewDataModel | null>;
  searchNewData(filter: NewSearchFilter): Promise<NewSearchResult>;
}

export class JsonFileStorage implements DataStorage {
  // 新しいデータの実装
  async getNewData(): Promise<NewDataModel[]> {
    await this.loadData();
    return this.newData;
  }
}
```

## テストの書き方

### 1. ユニットテスト

```typescript
// tests/services/data-storage.test.ts
import { JsonFileStorage } from '../../src/services/data-storage.js';

describe('JsonFileStorage', () => {
  let storage: JsonFileStorage;
  
  beforeEach(() => {
    storage = new JsonFileStorage('./src/data');
  });
  
  describe('getCurriculumGuidelines', () => {
    it('should return curriculum guidelines', async () => {
      const guidelines = await storage.getCurriculumGuidelines();
      
      expect(guidelines).toBeInstanceOf(Array);
      expect(guidelines.length).toBeGreaterThan(0);
      expect(guidelines[0]).toHaveProperty('id');
      expect(guidelines[0]).toHaveProperty('title');
    });
  });
  
  describe('searchCurriculum', () => {
    it('should filter by education stage', async () => {
      const result = await storage.searchCurriculum({
        educationStage: ['elementary']
      });
      
      expect(result.guidelines).toBeInstanceOf(Array);
      result.guidelines.forEach(g => {
        expect(g.educationStage).toBe('elementary');
      });
    });
    
    it('should return empty result for non-existent criteria', async () => {
      const result = await storage.searchCurriculum({
        keywords: ['非存在キーワード']
      });
      
      expect(result.totalCount).toBe(0);
      expect(result.guidelines).toHaveLength(0);
    });
  });
});
```

### 2. 統合テスト

```typescript
// tests/integration/mcp-server.test.ts
import OpenTenjinMCPServer from '../../src/server.js';

describe('MCP Server Integration', () => {
  let server: OpenTenjinMCPServer;
  
  beforeEach(() => {
    server = new OpenTenjinMCPServer();
  });
  
  describe('Tool Execution', () => {
    it('should execute search_curriculum tool', async () => {
      const result = await server.executeTool('search_curriculum', {
        educationStage: ['elementary'],
        subject: ['arithmetic']
      });
      
      expect(result).toHaveProperty('guidelines');
      expect(result).toHaveProperty('totalCount');
      expect(result.totalCount).toBeGreaterThan(0);
    });
    
    it('should handle invalid tool names', async () => {
      await expect(
        server.executeTool('invalid_tool', {})
      ).rejects.toThrow('Unknown tool: invalid_tool');
    });
  });
});
```

### 3. テストデータの管理

```typescript
// tests/fixtures/test-data.ts
export const testCurriculumGuideline: CurriculumGuideline = {
  id: 'test_curriculum_1',
  title: 'テスト用学習指導要領',
  educationStage: EducationStage.ELEMENTARY,
  subject: Subject.ARITHMETIC,
  version: '2024',
  publishedDate: new Date('2024-01-01'),
  effectiveDate: new Date('2024-04-01'),
  units: [],
  generalObjectives: ['テスト目標'],
  overallGoals: ['テスト目的'],
  metadata: {}
};
```

## デバッグとトラブルシューティング

### 1. ログ設定

```typescript
// src/utils/logger.ts
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

class Logger {
  private level: LogLevel;
  
  constructor(level: LogLevel = LogLevel.INFO) {
    this.level = level;
  }
  
  debug(message: string, ...args: any[]) {
    if (this.level >= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
  
  info(message: string, ...args: any[]) {
    if (this.level >= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }
  
  error(message: string, error?: Error) {
    if (this.level >= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, error);
    }
  }
}

export const logger = new Logger(
  process.env.LOG_LEVEL === 'debug' ? LogLevel.DEBUG : LogLevel.INFO
);
```

### 2. パフォーマンス測定

```typescript
// src/utils/performance.ts
export function measureTime<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> {
  const start = performance.now();
  
  return operation().finally(() => {
    const end = performance.now();
    logger.debug(`${operationName} took ${end - start} milliseconds`);
  });
}

// 使用例
const result = await measureTime(
  () => storage.searchCurriculum(filter),
  'Curriculum Search'
);
```

### 3. エラー追跡

```typescript
// src/utils/error-tracker.ts
export class ErrorTracker {
  private errors: Map<string, number> = new Map();
  
  track(error: Error, context?: string) {
    const key = `${error.name}:${context || 'unknown'}`;
    const count = this.errors.get(key) || 0;
    this.errors.set(key, count + 1);
    
    logger.error(`Error tracked: ${key}`, error);
  }
  
  getStats() {
    return Object.fromEntries(this.errors);
  }
}

export const errorTracker = new ErrorTracker();
```

## 継続的インテグレーション

### GitHub Actions設定

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18, 20]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - run: npm ci
    - run: npm run build
    - run: npm run lint
    - run: npm test
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
```

## リリースプロセス

### 1. バージョン管理

```bash
# パッチバージョンアップ（バグフィックス）
npm version patch

# マイナーバージョンアップ（新機能）
npm version minor

# メジャーバージョンアップ（破壊的変更）
npm version major
```

### 2. リリースノート

```markdown
# Release v1.1.0

## 新機能
- 新しい検索フィルター機能を追加
- パフォーマンス改善

## バグフィックス
- 特定の条件でのクラッシュを修正
- エラーメッセージの改善

## 破壊的変更
なし

## アップグレードガイド
既存のコードは変更なしで動作します。
```

### 3. デプロイメント

```bash
# プロダクションビルド
npm run build

# テストの実行
npm test

# npmパッケージの公開
npm publish
```

## コントリビューション

### 1. 課題報告

バグレポートや機能要求は、以下の情報を含めてGitHub Issuesに投稿してください：

- 問題の詳細な説明
- 再現手順
- 期待される動作
- 実際の動作
- 環境情報（Node.jsバージョン、OS等）

### 2. プルリクエスト

1. フォークしたリポジトリで機能ブランチを作成
2. 変更を実装
3. テストを追加・実行
4. ドキュメントを更新
5. プルリクエストを作成

### 3. コードレビュー

レビュー時の確認点：

- コードスタイルの遵守
- テストカバレッジ
- ドキュメントの更新
- 後方互換性
- パフォーマンスへの影響

## 参考資料

- [Model Context Protocol 仕様](https://modelcontextprotocol.io/)
- [TypeScript ハンドブック](https://www.typescriptlang.org/docs/)
- [Jest テストフレームワーク](https://jestjs.io/)
- [Node.js ドキュメント](https://nodejs.org/docs/)
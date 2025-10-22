# API リファレンス

Open Tenjin MCP サーバーのAPI仕様書です。

## 概要

Open Tenjin MCPは、Model Context Protocol (MCP) v2024-11-05に準拠したサーバーです。
日本の教育データ（学習指導要領、教科書、教材）へのアクセスを提供します。

## サーバー情報

```json
{
  "name": "open-tenjin-mcp",
  "version": "1.0.0",
  "description": "Educational data MCP server for Japanese curriculum guidelines, textbooks, and materials"
}
```

## ツール一覧

### 1. search_curriculum

学習指導要領を検索します。

**パラメータ:**

| 名前 | 型 | 必須 | 説明 |
|------|-----|------|------|
| educationStage | string[] | いいえ | 教育段階のフィルター |
| subject | string[] | いいえ | 教科のフィルター |
| grade | string[] | いいえ | 学年のフィルター |
| keywords | string[] | いいえ | 検索キーワード |
| bloomsTaxonomy | string[] | いいえ | ブルームのタキソノミーレベル |

**教育段階 (educationStage):**
- `elementary`: 小学校
- `junior_high`: 中学校
- `high`: 高等学校
- `special_needs`: 特別支援学校

**教科 (subject):**
- `japanese`: 国語
- `social_studies`: 社会
- `arithmetic`: 算数
- `mathematics`: 数学
- `science`: 理科
- `life_studies`: 生活
- `music`: 音楽
- `art`: 図画工作・美術
- `home_economics`: 家庭
- `physical_education`: 体育
- `foreign_language`: 外国語
- `moral_education`: 道徳
- `special_activities`: 特別活動
- `integrated_studies`: 総合的な学習の時間
- `technology`: 技術
- `geography_history`: 地理歴史
- `civics`: 公民
- `information`: 情報

**学年 (grade):**
- `elementary_1` - `elementary_6`: 小学1年 - 6年
- `junior_high_1` - `junior_high_3`: 中学1年 - 3年
- `high_1` - `high_3`: 高校1年 - 3年

**ブルームのタキソノミー (bloomsTaxonomy):**
- `remember`: 記憶
- `understand`: 理解
- `apply`: 応用
- `analyze`: 分析
- `evaluate`: 評価
- `create`: 創造

**使用例:**

```json
{
  "name": "search_curriculum",
  "arguments": {
    "educationStage": ["elementary"],
    "subject": ["arithmetic"],
    "grade": ["elementary_1", "elementary_2"],
    "keywords": ["数と計算"]
  }
}
```

**レスポンス:**

```json
{
  "guidelines": [...],
  "units": [...],
  "contents": [...],
  "totalCount": 2,
  "facets": {
    "educationStages": {"elementary": 2},
    "subjects": {"arithmetic": 2},
    "grades": {"elementary_1": 1, "elementary_2": 1}
  }
}
```

### 2. search_textbooks_materials

教科書と教材を検索します。

**パラメータ:**

| 名前 | 型 | 必須 | 説明 |
|------|-----|------|------|
| textbookFilter | object | いいえ | 教科書検索フィルター |
| materialFilter | object | いいえ | 教材検索フィルター |

**教科書フィルター (textbookFilter):**

| 名前 | 型 | 説明 |
|------|-----|------|
| educationStage | string[] | 教育段階 |
| subject | string[] | 教科 |
| grade | string[] | 学年 |
| publisher | string[] | 出版社 |
| type | string[] | 教科書種別 |
| keywords | string[] | キーワード |

**教科書種別 (type):**
- `main`: 主教材
- `supplementary`: 副教材
- `workbook`: 問題集
- `reference`: 参考書

**教材フィルター (materialFilter):**

| 名前 | 型 | 説明 |
|------|-----|------|
| educationStage | string[] | 教育段階 |
| subject | string[] | 教科 |
| grade | string[] | 学年 |
| type | string[] | 教材種別 |
| usageContext | string[] | 利用場面 |
| difficulty | string[] | 難易度 |
| keywords | string[] | キーワード |

**教材種別 (type):**
- `worksheet`: ワークシート
- `slide`: スライド
- `video`: 動画
- `audio`: 音声
- `image`: 画像
- `interactive`: インタラクティブ教材
- `experiment`: 実験教材
- `game`: ゲーム教材
- `assessment`: 評価教材
- `reference`: 参考資料

**利用場面 (usageContext):**
- `introduction`: 導入
- `explanation`: 展開・説明
- `practice`: 練習
- `assessment`: 評価
- `review`: 復習
- `homework`: 宿題
- `enrichment`: 発展

**難易度 (difficulty):**
- `basic`: 基礎
- `standard`: 標準
- `advanced`: 発展
- `challenge`: 挑戦

**使用例:**

```json
{
  "name": "search_textbooks_materials",
  "arguments": {
    "textbookFilter": {
      "educationStage": ["elementary"],
      "subject": ["arithmetic"],
      "grade": ["elementary_2"]
    },
    "materialFilter": {
      "type": ["worksheet", "game"],
      "difficulty": ["basic", "standard"]
    }
  }
}
```

### 3. get_curriculum_detail

指定されたIDの学習指導要領の詳細情報を取得します。

**パラメータ:**

| 名前 | 型 | 必須 | 説明 |
|------|-----|------|------|
| id | string | はい | 学習指導要領のID |

**使用例:**

```json
{
  "name": "get_curriculum_detail",
  "arguments": {
    "id": "elementary_math_2024"
  }
}
```

### 4. get_textbook_detail

指定されたIDの教科書の詳細情報を取得します。

**パラメータ:**

| 名前 | 型 | 必須 | 説明 |
|------|-----|------|------|
| id | string | はい | 教科書のID |

**使用例:**

```json
{
  "name": "get_textbook_detail",
  "arguments": {
    "id": "tokyo_shoseki_math1_2024"
  }
}
```

### 5. get_material_detail

指定されたIDの教材の詳細情報を取得します。

**パラメータ:**

| 名前 | 型 | 必須 | 説明 |
|------|-----|------|------|
| id | string | はい | 教材のID |

**使用例:**

```json
{
  "name": "get_material_detail",
  "arguments": {
    "id": "counting_worksheet_1"
  }
}
```

## リソース

MCPのリソース機能により、教育データに直接アクセスできます。

### リソースURI形式

- `curriculum://guideline/{id}`: 学習指導要領
- `textbook://book/{id}`: 教科書
- `material://resource/{id}`: 教材

### 使用例

```json
{
  "method": "resources/read",
  "params": {
    "uri": "curriculum://guideline/elementary_math_2024"
  }
}
```

## エラーハンドリング

### エラーレスポンス形式

```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32000,
    "message": "Error description"
  },
  "id": null
}
```

### エラーコード

| コード | 説明 |
|--------|------|
| -32700 | Parse error（JSONの解析エラー） |
| -32600 | Invalid Request（無効なリクエスト） |
| -32601 | Method not found（メソッドが見つからない） |
| -32602 | Invalid params（無効なパラメータ） |
| -32000 | Server error（サーバーエラー） |

## データ形式

### 学習指導要領 (CurriculumGuideline)

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

### 教科書 (Textbook)

```typescript
interface Textbook {
  id: string;
  title: string;
  subTitle?: string;
  publisher: Publisher;
  authors: string[];
  isbn?: string;
  type: TextbookType;
  educationStage: EducationStage;
  subject: Subject;
  targetGrades: Grade[];
  approvalStatus: ApprovalStatus;
  tableOfContents: TableOfContentsItem[];
  metadata: {
    coverImageUrl?: string;
    samplePagesUrl?: string;
    teacherGuideUrl?: string;
  };
}
```

### 教材 (EducationalMaterial)

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
  creator: {
    name: string;
    organization?: string;
  };
  license: string;
}
```

## レート制限

現在、レート制限は設定されていませんが、将来のバージョンで追加される可能性があります。

## バージョニング

APIバージョンは、サーバー情報の`version`フィールドで確認できます。
後方互換性を維持しながら、新機能を段階的に追加していく予定です。
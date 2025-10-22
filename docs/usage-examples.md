# 使用例とベストプラクティス

Open Tenjin MCPサーバーの実践的な使用例とベストプラクティスを紹介します。

## 基本的な使用例

### 1. 授業計画の作成支援

小学2年生の算数「かけ算」単元の授業計画を作成する場合：

#### ステップ1: 学習指導要領の確認

```json
{
  "name": "search_curriculum",
  "arguments": {
    "educationStage": ["elementary"],
    "subject": ["arithmetic"],
    "grade": ["elementary_2"],
    "keywords": ["かけ算", "乗法"]
  }
}
```

#### ステップ2: 対応教科書の確認

```json
{
  "name": "search_textbooks_materials",
  "arguments": {
    "textbookFilter": {
      "educationStage": ["elementary"],
      "subject": ["arithmetic"],
      "grade": ["elementary_2"],
      "keywords": ["かけ算"]
    }
  }
}
```

#### ステップ3: 教材の検索

```json
{
  "name": "search_textbooks_materials",
  "arguments": {
    "materialFilter": {
      "educationStage": ["elementary"],
      "subject": ["arithmetic"],
      "grade": ["elementary_2"],
      "type": ["worksheet", "game", "video"],
      "usageContext": ["introduction", "practice"],
      "keywords": ["九九", "かけ算"]
    }
  }
}
```

### 2. 個別指導計画の作成

つまずきのある児童への個別指導計画作成：

#### ステップ1: 前学年の内容確認

```json
{
  "name": "search_curriculum",
  "arguments": {
    "educationStage": ["elementary"],
    "subject": ["arithmetic"],
    "grade": ["elementary_1"],
    "keywords": ["数と計算"]
  }
}
```

#### ステップ2: 基礎教材の検索

```json
{
  "name": "search_textbooks_materials",
  "arguments": {
    "materialFilter": {
      "difficulty": ["basic"],
      "type": ["worksheet"],
      "usageContext": ["practice", "review"]
    }
  }
}
```

### 3. 評価規準の作成

学習評価のための規準作成：

#### ステップ1: 詳細な学習目標の確認

```json
{
  "name": "get_curriculum_detail",
  "arguments": {
    "id": "elem_math_grade2_numbers"
  }
}
```

#### ステップ2: 評価教材の確認

```json
{
  "name": "search_textbooks_materials",
  "arguments": {
    "materialFilter": {
      "type": ["assessment"],
      "usageContext": ["assessment"]
    }
  }
}
```

## 高度な使用例

### 1. 学年進行を考慮した指導計画

系統的な学習を支援するため、複数学年の関連を確認：

```json
{
  "name": "search_curriculum",
  "arguments": {
    "educationStage": ["elementary"],
    "subject": ["arithmetic"],
    "grade": ["elementary_1", "elementary_2", "elementary_3"],
    "keywords": ["数と計算"]
  }
}
```

### 2. 教科横断的な学習の計画

総合的な学習の時間での教科横断的な取り組み：

```json
{
  "name": "search_curriculum",
  "arguments": {
    "educationStage": ["elementary"],
    "subject": ["integrated_studies", "science", "social_studies"],
    "keywords": ["環境", "地域"]
  }
}
```

### 3. 特別支援教育への対応

特別な支援が必要な児童への対応：

```json
{
  "name": "search_textbooks_materials",
  "arguments": {
    "materialFilter": {
      "difficulty": ["basic"],
      "type": ["interactive", "visual"],
      "keywords": ["視覚支援", "個別対応"]
    }
  }
}
```

## ベストプラクティス

### 1. 効率的な検索戦略

#### 段階的な絞り込み

1. **広範囲から開始**: 教育段階と教科のみで検索
2. **段階的絞り込み**: 学年、キーワードを追加
3. **詳細確認**: IDを使用して詳細情報を取得

```javascript
// 悪い例: 最初から条件を絞りすぎる
search_curriculum({
  educationStage: ["elementary"],
  subject: ["arithmetic"],
  grade: ["elementary_2"],
  keywords: ["かけ算", "九九", "暗記", "練習"],
  bloomsTaxonomy: ["remember", "apply"]
});

// 良い例: 段階的に絞り込む
// 1. 基本検索
search_curriculum({
  educationStage: ["elementary"],
  subject: ["arithmetic"],
  grade: ["elementary_2"]
});

// 2. キーワード追加
search_curriculum({
  educationStage: ["elementary"],
  subject: ["arithmetic"],
  grade: ["elementary_2"],
  keywords: ["かけ算"]
});
```

#### キーワードの使い方

```javascript
// 効果的なキーワード選択
const keywords = [
  "主要概念",      // "数と計算"
  "具体的内容",    // "九九"
  "指導方法"       // "具体物操作"
];
```

### 2. データの組み合わせ活用

#### 学習指導要領と教科書の対応確認

```javascript
// 1. 学習指導要領から単元ID取得
const curriculumResult = await search_curriculum({
  educationStage: ["elementary"],
  subject: ["arithmetic"],
  grade: ["elementary_2"]
});

// 2. 対応する教科書の確認
const textbookResult = await search_textbooks_materials({
  textbookFilter: {
    curriculumMapping: [curriculumResult.units[0].id]
  }
});
```

#### 教科書から関連教材の発見

```javascript
// 1. 教科書の詳細取得
const textbook = await get_textbook_detail({
  id: "gakko_tosho_math2_2024"
});

// 2. 同じ単元の教材検索
const materials = await search_textbooks_materials({
  materialFilter: {
    textbookMapping: [textbook.id],
    type: ["worksheet", "video"]
  }
});
```

### 3. エラーハンドリング

#### 適切な例外処理

```javascript
async function searchEducationalContent(params) {
  try {
    const result = await search_curriculum(params);
    
    if (result.totalCount === 0) {
      // 検索条件を緩和して再検索
      const relaxedParams = {
        ...params,
        keywords: params.keywords?.slice(0, 1) // キーワードを減らす
      };
      return await search_curriculum(relaxedParams);
    }
    
    return result;
  } catch (error) {
    console.error('Search failed:', error);
    // フォールバック処理
    return { guidelines: [], units: [], contents: [], totalCount: 0 };
  }
}
```

#### 段階的フォールバック

```javascript
async function robustSearch(baseParams) {
  const strategies = [
    baseParams,                          // 元の条件
    { ...baseParams, keywords: [] },     // キーワードなし
    { educationStage: baseParams.educationStage }, // 最小条件
  ];
  
  for (const params of strategies) {
    try {
      const result = await search_curriculum(params);
      if (result.totalCount > 0) return result;
    } catch (error) {
      continue; // 次の戦略を試行
    }
  }
  
  throw new Error('All search strategies failed');
}
```

### 4. パフォーマンス最適化

#### 結果のキャッシュ

```javascript
class EducationalDataCache {
  constructor() {
    this.cache = new Map();
    this.ttl = 5 * 60 * 1000; // 5分
  }
  
  async getCachedResult(key, searchFunction) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.data;
    }
    
    const result = await searchFunction();
    this.cache.set(key, {
      data: result,
      timestamp: Date.now()
    });
    
    return result;
  }
}
```

#### バッチ処理

```javascript
async function batchGetDetails(ids, type) {
  const results = [];
  const batchSize = 5; // 同時実行数を制限
  
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    const promises = batch.map(id => {
      switch (type) {
        case 'curriculum': return get_curriculum_detail({ id });
        case 'textbook': return get_textbook_detail({ id });
        case 'material': return get_material_detail({ id });
      }
    });
    
    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
  }
  
  return results;
}
```

### 5. ユーザビリティの向上

#### 結果の構造化表示

```javascript
function formatSearchResults(results) {
  return {
    summary: {
      total: results.totalCount,
      byStage: results.facets.educationStages,
      bySubject: results.facets.subjects
    },
    guidelines: results.guidelines.map(g => ({
      id: g.id,
      title: g.title,
      stage: g.educationStage,
      subject: g.subject,
      units: g.units.length
    })),
    materials: results.materials?.map(m => ({
      id: m.id,
      title: m.title,
      type: m.type,
      difficulty: m.difficulty,
      estimatedTime: m.estimatedTime
    })) || []
  };
}
```

#### 推奨事項の提供

```javascript
function generateRecommendations(searchResults, userContext) {
  const recommendations = [];
  
  // 関連教材の推奨
  if (searchResults.guidelines.length > 0) {
    recommendations.push({
      type: 'related_materials',
      message: '関連する教材も確認することをお勧めします',
      action: 'search_textbooks_materials',
      params: {
        materialFilter: {
          curriculumMapping: searchResults.guidelines.map(g => g.id)
        }
      }
    });
  }
  
  // 前後の学年内容の推奨
  if (userContext.grade) {
    const prevGrade = getPreviousGrade(userContext.grade);
    const nextGrade = getNextGrade(userContext.grade);
    
    if (prevGrade) {
      recommendations.push({
        type: 'prerequisite_check',
        message: '前学年の関連内容も確認してください',
        grade: prevGrade
      });
    }
  }
  
  return recommendations;
}
```

## アンチパターン（避けるべき使い方）

### 1. 過度に複雑な検索条件

```javascript
// 悪い例: 条件が多すぎて結果が得られない
search_curriculum({
  educationStage: ["elementary"],
  subject: ["arithmetic"],
  grade: ["elementary_2"],
  keywords: ["かけ算", "九九", "暗記", "計算", "数学的活動", "具体物"],
  bloomsTaxonomy: ["remember", "understand", "apply"]
});

// 良い例: シンプルな条件から開始
search_curriculum({
  educationStage: ["elementary"],
  subject: ["arithmetic"],
  keywords: ["かけ算"]
});
```

### 2. エラー処理の不備

```javascript
// 悪い例: エラーハンドリングなし
const result = await search_curriculum(params);
console.log(result.guidelines[0].title); // エラーの可能性

// 良い例: 適切なエラーハンドリング
try {
  const result = await search_curriculum(params);
  if (result.guidelines && result.guidelines.length > 0) {
    console.log(result.guidelines[0].title);
  } else {
    console.log('該当する学習指導要領が見つかりませんでした');
  }
} catch (error) {
  console.error('検索エラー:', error.message);
}
```

### 3. 無駄な API 呼び出し

```javascript
// 悪い例: 同じ内容を繰り返し取得
for (const id of curriculumIds) {
  const detail = await get_curriculum_detail({ id });
  processDetail(detail);
}

// 良い例: バッチ処理やキャッシュを活用
const details = await batchGetDetails(curriculumIds, 'curriculum');
details.forEach(processDetail);
```

## 統合例: 完全な授業準備ワークフロー

```javascript
class LessonPlanningAssistant {
  constructor(mcpClient) {
    this.client = mcpClient;
    this.cache = new Map();
  }
  
  async createLessonPlan(grade, subject, topic) {
    try {
      // 1. 学習指導要領の確認
      const curriculum = await this.client.search_curriculum({
        educationStage: [this.getEducationStage(grade)],
        subject: [subject],
        grade: [grade],
        keywords: [topic]
      });
      
      if (curriculum.totalCount === 0) {
        throw new Error('該当する学習指導要領が見つかりません');
      }
      
      // 2. 教科書の確認
      const textbooks = await this.client.search_textbooks_materials({
        textbookFilter: {
          educationStage: [this.getEducationStage(grade)],
          subject: [subject],
          grade: [grade]
        }
      });
      
      // 3. 教材の検索
      const materials = await this.client.search_textbooks_materials({
        materialFilter: {
          educationStage: [this.getEducationStage(grade)],
          subject: [subject],
          grade: [grade],
          keywords: [topic]
        }
      });
      
      // 4. 授業計画の構築
      return this.buildLessonPlan({
        curriculum: curriculum.guidelines[0],
        textbooks: textbooks.textbooks,
        materials: materials.materials
      });
      
    } catch (error) {
      console.error('授業計画作成エラー:', error);
      throw error;
    }
  }
  
  buildLessonPlan({ curriculum, textbooks, materials }) {
    return {
      title: `${curriculum.subject} - ${curriculum.title}`,
      objectives: curriculum.generalObjectives,
      resources: {
        curriculum: curriculum,
        textbooks: textbooks.slice(0, 2), // 主要な教科書2冊
        materials: {
          introduction: materials.filter(m => 
            m.usageContext.includes('introduction')
          ),
          practice: materials.filter(m => 
            m.usageContext.includes('practice')
          ),
          assessment: materials.filter(m => 
            m.usageContext.includes('assessment')
          )
        }
      },
      recommendations: this.generateTeachingRecommendations(materials)
    };
  }
  
  generateTeachingRecommendations(materials) {
    const recommendations = [];
    
    // 難易度別の教材推奨
    const basicMaterials = materials.filter(m => m.difficulty === 'basic');
    const advancedMaterials = materials.filter(m => m.difficulty === 'advanced');
    
    if (basicMaterials.length > 0) {
      recommendations.push('基礎的な理解のために' + basicMaterials[0].title + 'を活用してください');
    }
    
    if (advancedMaterials.length > 0) {
      recommendations.push('発展的な学習として' + advancedMaterials[0].title + 'を準備してください');
    }
    
    return recommendations;
  }
  
  getEducationStage(grade) {
    if (grade.startsWith('elementary')) return 'elementary';
    if (grade.startsWith('junior_high')) return 'junior_high';
    if (grade.startsWith('high')) return 'high';
    return 'elementary';
  }
}

// 使用例
const assistant = new LessonPlanningAssistant(mcpClient);
const plan = await assistant.createLessonPlan('elementary_2', 'arithmetic', 'かけ算');
console.log(plan);
```

このガイドを参考に、Open Tenjin MCPサーバーを効果的に活用してください。
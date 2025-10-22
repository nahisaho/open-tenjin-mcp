/**
 * 教育理論の分野
 */
export enum EducationTheoryField {
  LEARNING_THEORY = 'learning_theory',           // 学習理論
  COGNITIVE_PSYCHOLOGY = 'cognitive_psychology', // 認知心理学
  INSTRUCTIONAL_DESIGN = 'instructional_design', // 教授設計
  ASSESSMENT = 'assessment',                     // 評価理論
  MOTIVATION = 'motivation',                     // 動機づけ理論
  DEVELOPMENTAL = 'developmental',               // 発達理論
  SOCIAL_LEARNING = 'social_learning',          // 社会学習理論
  CONSTRUCTIVISM = 'constructivism',            // 構成主義
  BEHAVIORISM = 'behaviorism',                  // 行動主義
  HUMANISTIC = 'humanistic'                     // 人間主義
}

/**
 * 教育理論の影響度
 */
export enum TheoryInfluence {
  FOUNDATIONAL = 'foundational',     // 基礎的理論
  WIDELY_APPLIED = 'widely_applied', // 広く応用されている
  EMERGING = 'emerging',             // 新興理論
  SPECIALIZED = 'specialized'        // 専門分野特化
}

/**
 * 適用レベル
 */
export enum ApplicationLevel {
  INDIVIDUAL = 'individual',         // 個人レベル
  CLASSROOM = 'classroom',           // 教室レベル
  INSTITUTIONAL = 'institutional',   // 機関レベル
  SYSTEMIC = 'systemic'             // システムレベル
}

/**
 * 教育理論の詳細情報
 */
export interface EducationTheory {
  id: string;
  name: string;                      // 理論名
  nameEn?: string;                   // 英語名
  field: EducationTheoryField;       // 分野
  influence: TheoryInfluence;        // 影響度
  developers: string[];              // 提唱者・開発者
  developmentYear?: number;          // 提唱年
  description: string;               // 概要説明
  coreprinciples: string[];          // 核となる原理・原則
  keyFeatures: string[];             // 主要な特徴
  applicationLevel: ApplicationLevel[]; // 適用レベル
  applicableStages: EducationStage[]; // 適用可能な教育段階
  applicableSubjects: Subject[];     // 適用可能な教科
  practicalApplications: PracticalApplication[]; // 実践的応用
  relatedTheories: string[];         // 関連理論のID
  evidenceBase: EvidenceBase;        // エビデンス基盤
  advantages: string[];              // 利点・メリット
  limitations: string[];             // 制約・デメリット
  implementationStrategies: ImplementationStrategy[]; // 実装戦略
  resources: TheoryResource[];       // 参考資料
  examples: TheoryExample[];         // 具体例
  keywords: string[];                // キーワード
  metadata: {
    lastUpdated: Date;
    reviewedBy?: string[];           // レビュー者
    citations?: Citation[];          // 引用文献
  };
}

/**
 * 実践的応用
 */
export interface PracticalApplication {
  id: string;
  title: string;                     // 応用タイトル
  description: string;               // 説明
  context: string;                   // 適用場面
  procedure: string[];               // 手順
  expectedOutcomes: string[];        // 期待される成果
  requiredResources: string[];       // 必要なリソース
  difficulty: 'beginner' | 'intermediate' | 'advanced'; // 実装難易度
}

/**
 * エビデンス基盤
 */
export interface EvidenceBase {
  researchType: 'empirical' | 'theoretical' | 'mixed'; // 研究タイプ
  strengthOfEvidence: 'strong' | 'moderate' | 'limited'; // エビデンスの強度
  keyStudies: string[];              // 主要研究
  metaAnalyses?: string[];           // メタ分析
  limitations: string[];             // エビデンスの限界
}

/**
 * 実装戦略
 */
export interface ImplementationStrategy {
  id: string;
  title: string;                     // 戦略タイトル
  description: string;               // 説明
  steps: string[];                   // 実装ステップ
  prerequisites: string[];           // 前提条件
  successFactors: string[];          // 成功要因
  commonChallenges: string[];        // よくある課題
  solutions: string[];               // 解決策
}

/**
 * 理論リソース
 */
export interface TheoryResource {
  id: string;
  type: 'book' | 'article' | 'website' | 'video' | 'course'; // リソースタイプ
  title: string;                     // タイトル
  author?: string;                   // 著者
  description: string;               // 説明
  url?: string;                      // URL
  language: 'ja' | 'en' | 'other';   // 言語
  difficulty: 'beginner' | 'intermediate' | 'advanced'; // 難易度
  isPrimary: boolean;                // 一次資料かどうか
}

/**
 * 理論の具体例
 */
export interface TheoryExample {
  id: string;
  title: string;                     // 例のタイトル
  description: string;               // 説明
  context: string;                   // 文脈・場面
  educationStage: EducationStage;    // 教育段階
  subject: Subject;                  // 教科
  implementation: string;            // 実装方法
  outcomes: string[];                // 成果
  lessonsLearned: string[];          // 学んだ教訓
}

/**
 * 引用文献
 */
export interface Citation {
  id: string;
  type: 'book' | 'journal' | 'conference' | 'thesis' | 'report';
  title: string;
  authors: string[];
  year: number;
  publication?: string;              // 出版物・ジャーナル名
  pages?: string;                    // ページ
  doi?: string;                      // DOI
  isbn?: string;                     // ISBN
  url?: string;                      // URL
}

/**
 * 教育理論の検索フィルター
 */
export interface EducationTheorySearchFilter {
  field?: EducationTheoryField[];
  influence?: TheoryInfluence[];
  applicationLevel?: ApplicationLevel[];
  applicableStages?: EducationStage[];
  applicableSubjects?: Subject[];
  keywords?: string[];
  developers?: string[];
  developmentYearRange?: {
    from?: number;
    to?: number;
  };
}

/**
 * 教育理論の検索結果
 */
export interface EducationTheorySearchResult {
  theories: EducationTheory[];
  totalCount: number;
  facets: {
    fields: { [key in EducationTheoryField]?: number };
    influences: { [key in TheoryInfluence]?: number };
    applicationLevels: { [key in ApplicationLevel]?: number };
    stages: { [key in EducationStage]?: number };
    subjects: { [key in Subject]?: number };
  };
}

// 既存のEducationStageとSubjectをインポート
import { EducationStage, Subject } from './curriculum.js';
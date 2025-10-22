import { EducationStage, Subject, Grade } from './curriculum.js';

/**
 * 教科書の種別
 */
export enum TextbookType {
  MAIN = 'main',           // 主教材
  SUPPLEMENTARY = 'supplementary', // 副教材
  WORKBOOK = 'workbook',   // 問題集
  REFERENCE = 'reference'  // 参考書
}

/**
 * 教科書の検定状況
 */
export enum ApprovalStatus {
  APPROVED = 'approved',       // 検定済み
  AUTHORIZED = 'authorized',   // 認定済み
  PENDING = 'pending',         // 検定中
  NOT_REQUIRED = 'not_required' // 検定不要
}

/**
 * 教科書の出版社情報
 */
export interface Publisher {
  id: string;
  name: string;
  abbreviation?: string;
  website?: string;
  contactInfo?: {
    address?: string;
    phone?: string;
    email?: string;
  };
}

/**
 * 教科書の情報
 */
export interface Textbook {
  id: string;
  title: string;
  subTitle?: string;
  publisher: Publisher;
  authors: string[];
  editors?: string[];
  isbn?: string;
  isbn13?: string;
  type: TextbookType;
  educationStage: EducationStage;
  subject: Subject;
  targetGrades: Grade[];
  approvalStatus: ApprovalStatus;
  approvalNumber?: string;
  publicationDate: Date;
  edition?: string;
  pages?: number;
  price?: number;
  description: string;
  keywords: string[];
  curriculumMapping?: string[]; // 学習指導要領の単元IDとの対応
  tableOfContents: TableOfContentsItem[];
  metadata: {
    coverImageUrl?: string;
    samplePagesUrl?: string;
    teacherGuideUrl?: string;
    digitalContentUrl?: string;
  };
  lastUpdated: Date;
}

/**
 * 目次項目
 */
export interface TableOfContentsItem {
  id: string;
  title: string;
  page?: number;
  level: number; // 1: 章, 2: 節, 3: 項目, etc.
  parentId?: string;
  children?: TableOfContentsItem[];
  curriculumContentIds?: string[]; // 対応する学習指導要領の内容ID
  estimatedHours?: number; // 想定授業時数
}

/**
 * 教材の種別
 */
export enum MaterialType {
  WORKSHEET = 'worksheet',     // ワークシート
  SLIDE = 'slide',            // スライド
  VIDEO = 'video',            // 動画
  AUDIO = 'audio',            // 音声
  IMAGE = 'image',            // 画像
  INTERACTIVE = 'interactive', // インタラクティブ教材
  EXPERIMENT = 'experiment',   // 実験教材
  GAME = 'game',              // ゲーム教材
  ASSESSMENT = 'assessment',   // 評価教材
  REFERENCE = 'reference'      // 参考資料
}

/**
 * 教材の利用シーン
 */
export enum UsageContext {
  INTRODUCTION = 'introduction', // 導入
  EXPLANATION = 'explanation',   // 展開・説明
  PRACTICE = 'practice',         // 練習
  ASSESSMENT = 'assessment',     // 評価
  REVIEW = 'review',            // 復習
  HOMEWORK = 'homework',        // 宿題
  ENRICHMENT = 'enrichment'     // 発展
}

/**
 * 教材の難易度
 */
export enum DifficultyLevel {
  BASIC = 'basic',         // 基礎
  STANDARD = 'standard',   // 標準
  ADVANCED = 'advanced',   // 発展
  CHALLENGE = 'challenge'  // 挑戦
}

/**
 * 教材情報
 */
export interface EducationalMaterial {
  id: string;
  title: string;
  description: string;
  type: MaterialType;
  usageContext: UsageContext[];
  difficulty: DifficultyLevel;
  educationStage: EducationStage;
  subject: Subject;
  targetGrades: Grade[];
  keywords: string[];
  objectives: string[];
  curriculumMapping?: string[]; // 学習指導要領の単元・内容IDとの対応
  textbookMapping?: string[]; // 対応教科書ID
  estimatedTime?: number; // 想定利用時間（分）
  prerequisiteKnowledge?: string[]; // 前提知識
  resources: MaterialResource[];
  instructions?: string; // 使用方法・指導案
  creator: {
    name: string;
    organization?: string;
    contact?: string;
  };
  license: string; // ライセンス情報
  tags: string[];
  createdDate: Date;
  lastUpdated: Date;
  downloads?: number;
  rating?: {
    average: number;
    count: number;
  };
}

/**
 * 教材リソース
 */
export interface MaterialResource {
  id: string;
  name: string;
  type: 'file' | 'url' | 'text';
  url?: string;
  filePath?: string;
  content?: string;
  mimeType?: string;
  size?: number; // ファイルサイズ（バイト）
  description?: string;
}

/**
 * 教科書の検索フィルター
 */
export interface TextbookSearchFilter {
  educationStage?: EducationStage[];
  subject?: Subject[];
  grade?: Grade[];
  publisher?: string[];
  type?: TextbookType[];
  approvalStatus?: ApprovalStatus[];
  keywords?: string[];
  publicationYear?: {
    from?: number;
    to?: number;
  };
}

/**
 * 教材の検索フィルター
 */
export interface MaterialSearchFilter {
  educationStage?: EducationStage[];
  subject?: Subject[];
  grade?: Grade[];
  type?: MaterialType[];
  usageContext?: UsageContext[];
  difficulty?: DifficultyLevel[];
  keywords?: string[];
  estimatedTime?: {
    min?: number;
    max?: number;
  };
  hasResources?: boolean;
}

/**
 * 教科書・教材の検索結果
 */
export interface TextbookMaterialSearchResult {
  textbooks: Textbook[];
  materials: EducationalMaterial[];
  totalCount: number;
  facets: {
    educationStages: { [key in EducationStage]?: number };
    subjects: { [key in Subject]?: number };
    grades: { [key in Grade]?: number };
    publishers: { [key: string]: number };
    types: { [key: string]: number };
  };
}
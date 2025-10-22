/**
 * 教育段階の定義
 */
export enum EducationStage {
  ELEMENTARY = 'elementary',
  JUNIOR_HIGH = 'junior_high',
  HIGH = 'high',
  SPECIAL_NEEDS = 'special_needs'
}

/**
 * 学年の定義
 */
export enum Grade {
  // 小学校
  ELEM_1 = 'elementary_1',
  ELEM_2 = 'elementary_2',
  ELEM_3 = 'elementary_3',
  ELEM_4 = 'elementary_4',
  ELEM_5 = 'elementary_5',
  ELEM_6 = 'elementary_6',
  
  // 中学校
  JH_1 = 'junior_high_1',
  JH_2 = 'junior_high_2',
  JH_3 = 'junior_high_3',
  
  // 高等学校
  HIGH_1 = 'high_1',
  HIGH_2 = 'high_2',
  HIGH_3 = 'high_3'
}

/**
 * 教科の定義
 */
export enum Subject {
  // 小学校
  JAPANESE = 'japanese',
  SOCIAL_STUDIES = 'social_studies',
  ARITHMETIC = 'arithmetic',
  SCIENCE = 'science',
  LIFE_STUDIES = 'life_studies',
  MUSIC = 'music',
  ART = 'art',
  HOME_ECONOMICS = 'home_economics',
  PHYSICAL_EDUCATION = 'physical_education',
  FOREIGN_LANGUAGE = 'foreign_language',
  MORAL_EDUCATION = 'moral_education',
  SPECIAL_ACTIVITIES = 'special_activities',
  INTEGRATED_STUDIES = 'integrated_studies',
  
  // 中学校追加
  MATHEMATICS = 'mathematics',
  TECHNOLOGY = 'technology',
  
  // 高等学校追加
  GEOGRAPHY_HISTORY = 'geography_history',
  CIVICS = 'civics',
  INFORMATION = 'information'
}

/**
 * 内容の階層レベル
 */
export enum ContentLevel {
  GOAL = 'goal',           // 目標
  CONTENT = 'content',     // 内容
  ITEM = 'item',          // 項目
  DETAIL = 'detail'       // 詳細項目
}

/**
 * 学習指導要領の内容項目
 */
export interface CurriculumContent {
  id: string;
  level: ContentLevel;
  title: string;
  description: string;
  parentId?: string;
  children?: CurriculumContent[];
  objectives?: string[];
  keywords?: string[];
  bloomsTaxonomy?: BloomsTaxonomyLevel[];
}

/**
 * ブルームのタキソノミーレベル
 */
export enum BloomsTaxonomyLevel {
  REMEMBER = 'remember',
  UNDERSTAND = 'understand',
  APPLY = 'apply',
  ANALYZE = 'analyze',
  EVALUATE = 'evaluate',
  CREATE = 'create'
}

/**
 * 学習指導要領の単元
 */
export interface CurriculumUnit {
  id: string;
  title: string;
  educationStage: EducationStage;
  subject: Subject;
  grade: Grade[];
  allocatedHours?: number;
  goals: string[];
  contents: CurriculumContent[];
  evaluationCriteria?: string[];
  keywords: string[];
  relatedUnits?: string[];
  lastUpdated: Date;
}

/**
 * 学習指導要領ドキュメント
 */
export interface CurriculumGuideline {
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

/**
 * 学習指導要領の検索フィルター
 */
export interface CurriculumSearchFilter {
  educationStage?: EducationStage[];
  subject?: Subject[];
  grade?: Grade[];
  keywords?: string[];
  bloomsTaxonomy?: BloomsTaxonomyLevel[];
}

/**
 * 学習指導要領の検索結果
 */
export interface CurriculumSearchResult {
  guidelines: CurriculumGuideline[];
  units: CurriculumUnit[];
  contents: CurriculumContent[];
  totalCount: number;
  facets: {
    educationStages: { [key in EducationStage]?: number };
    subjects: { [key in Subject]?: number };
    grades: { [key in Grade]?: number };
  };
}
import { 
  CurriculumGuideline, 
  CurriculumSearchFilter, 
  CurriculumSearchResult 
} from '../models/curriculum.js';
import { 
  Textbook, 
  EducationalMaterial, 
  TextbookSearchFilter, 
  MaterialSearchFilter, 
  TextbookMaterialSearchResult 
} from '../models/textbook-material.js';
import { 
  EducationTheory, 
  EducationTheorySearchFilter, 
  EducationTheorySearchResult 
} from '../models/education-theory.js';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * データストレージのインターface
 */
export interface DataStorage {
  // 学習指導要領関連
  getCurriculumGuidelines(): Promise<CurriculumGuideline[]>;
  getCurriculumGuidelineById(id: string): Promise<CurriculumGuideline | null>;
  searchCurriculum(filter: CurriculumSearchFilter): Promise<CurriculumSearchResult>;
  
  // 教科書・教材関連
  getTextbooks(): Promise<Textbook[]>;
  getTextbookById(id: string): Promise<Textbook | null>;
  getEducationalMaterials(): Promise<EducationalMaterial[]>;
  getEducationalMaterialById(id: string): Promise<EducationalMaterial | null>;
  searchTextbooksAndMaterials(textbookFilter?: TextbookSearchFilter, materialFilter?: MaterialSearchFilter): Promise<TextbookMaterialSearchResult>;

  // 教育理論関連
  getEducationTheories(): Promise<EducationTheory[]>;
  getEducationTheoryById(id: string): Promise<EducationTheory | null>;
  searchEducationTheories(filter: EducationTheorySearchFilter): Promise<EducationTheorySearchResult>;
}

/**
 * JSONファイルベースのデータストレージ実装
 */
export class JsonFileStorage implements DataStorage {
  private curriculumGuidelines: CurriculumGuideline[] = [];
  private textbooks: Textbook[] = [];
  private educationalMaterials: EducationalMaterial[] = [];
  private educationTheories: EducationTheory[] = [];
  private dataLoaded = false;

  constructor(private dataPath: string) {}

  private async loadData(): Promise<void> {
    if (this.dataLoaded) return;

    try {
      // 教育理論データの読み込み（src/dataディレクトリから）
      const theoryPath = path.join(process.cwd(), 'src', 'data', 'education-theories.json');
      const theoryContent = await fs.readFile(theoryPath, 'utf-8');
      this.educationTheories = JSON.parse(theoryContent);

      // 他のデータも存在する場合は読み込む（エラーを無視）
      try {
        const curriculumPath = path.join(this.dataPath, 'curriculum-guidelines.json');
        const curriculumContent = await fs.readFile(curriculumPath, 'utf-8');
        this.curriculumGuidelines = JSON.parse(curriculumContent);
      } catch (error) {
        console.warn('学習指導要領データが見つかりません:', error instanceof Error ? error.message : String(error));
        this.curriculumGuidelines = [];
      }

      try {
        const textbookPath = path.join(this.dataPath, 'textbooks.json');
        const textbookContent = await fs.readFile(textbookPath, 'utf-8');
        this.textbooks = JSON.parse(textbookContent);
      } catch (error) {
        console.warn('教科書データが見つかりません:', error instanceof Error ? error.message : String(error));
        this.textbooks = [];
      }

      try {
        const materialPath = path.join(this.dataPath, 'educational-materials.json');
        const materialContent = await fs.readFile(materialPath, 'utf-8');
        this.educationalMaterials = JSON.parse(materialContent);
      } catch (error) {
        console.warn('教材データが見つかりません:', error instanceof Error ? error.message : String(error));
        this.educationalMaterials = [];
      }

      this.dataLoaded = true;
    } catch (error) {
      console.error('Error loading data:', error);
      this.dataLoaded = true; // エラーでも読み込み完了とする
    }
  }

  async getCurriculumGuidelines(): Promise<CurriculumGuideline[]> {
    await this.loadData();
    return this.curriculumGuidelines;
  }

  async getCurriculumGuidelineById(id: string): Promise<CurriculumGuideline | null> {
    await this.loadData();
    return this.curriculumGuidelines.find(g => g.id === id) || null;
  }

  async searchCurriculum(filter: CurriculumSearchFilter): Promise<CurriculumSearchResult> {
    await this.loadData();

    let filteredGuidelines = this.curriculumGuidelines;

    // 教育段階フィルター
    if (filter.educationStage && filter.educationStage.length > 0) {
      filteredGuidelines = filteredGuidelines.filter(g => 
        filter.educationStage!.includes(g.educationStage)
      );
    }

    // 教科フィルター
    if (filter.subject && filter.subject.length > 0) {
      filteredGuidelines = filteredGuidelines.filter(g => 
        filter.subject!.includes(g.subject)
      );
    }

    // キーワード検索
    if (filter.keywords && filter.keywords.length > 0) {
      const keywords = filter.keywords.map(k => k.toLowerCase());
      filteredGuidelines = filteredGuidelines.filter(g => {
        const searchText = `${g.title} ${g.generalObjectives.join(' ')} ${g.overallGoals.join(' ')}`.toLowerCase();
        return keywords.some(keyword => searchText.includes(keyword));
      });
    }

    // 単元とコンテンツの抽出
    const units = filteredGuidelines.flatMap(g => g.units);
    const contents = units.flatMap(u => u.contents);

    // ファセット計算
    const facets = {
      educationStages: {} as { [key: string]: number },
      subjects: {} as { [key: string]: number },
      grades: {} as { [key: string]: number }
    };

    filteredGuidelines.forEach(g => {
      facets.educationStages[g.educationStage] = (facets.educationStages[g.educationStage] || 0) + 1;
      facets.subjects[g.subject] = (facets.subjects[g.subject] || 0) + 1;
    });

    units.forEach(u => {
      u.grade.forEach(grade => {
        facets.grades[grade] = (facets.grades[grade] || 0) + 1;
      });
    });

    return {
      guidelines: filteredGuidelines,
      units,
      contents,
      totalCount: filteredGuidelines.length,
      facets
    };
  }

  async getTextbooks(): Promise<Textbook[]> {
    await this.loadData();
    return this.textbooks;
  }

  async getTextbookById(id: string): Promise<Textbook | null> {
    await this.loadData();
    return this.textbooks.find(t => t.id === id) || null;
  }

  async getEducationalMaterials(): Promise<EducationalMaterial[]> {
    await this.loadData();
    return this.educationalMaterials;
  }

  async getEducationalMaterialById(id: string): Promise<EducationalMaterial | null> {
    await this.loadData();
    return this.educationalMaterials.find(m => m.id === id) || null;
  }

  async searchTextbooksAndMaterials(
    textbookFilter?: TextbookSearchFilter,
    materialFilter?: MaterialSearchFilter
  ): Promise<TextbookMaterialSearchResult> {
    await this.loadData();

    let filteredTextbooks = this.textbooks;
    let filteredMaterials = this.educationalMaterials;

    // 教科書フィルタリング
    if (textbookFilter) {
      if (textbookFilter.educationStage && textbookFilter.educationStage.length > 0) {
        filteredTextbooks = filteredTextbooks.filter(t => 
          textbookFilter.educationStage!.includes(t.educationStage)
        );
      }

      if (textbookFilter.subject && textbookFilter.subject.length > 0) {
        filteredTextbooks = filteredTextbooks.filter(t => 
          textbookFilter.subject!.includes(t.subject)
        );
      }

      if (textbookFilter.keywords && textbookFilter.keywords.length > 0) {
        const keywords = textbookFilter.keywords.map(k => k.toLowerCase());
        filteredTextbooks = filteredTextbooks.filter(t => {
          const searchText = `${t.title} ${t.description} ${t.keywords.join(' ')}`.toLowerCase();
          return keywords.some(keyword => searchText.includes(keyword));
        });
      }
    }

    // 教材フィルタリング
    if (materialFilter) {
      if (materialFilter.educationStage && materialFilter.educationStage.length > 0) {
        filteredMaterials = filteredMaterials.filter(m => 
          materialFilter.educationStage!.includes(m.educationStage)
        );
      }

      if (materialFilter.subject && materialFilter.subject.length > 0) {
        filteredMaterials = filteredMaterials.filter(m => 
          materialFilter.subject!.includes(m.subject)
        );
      }

      if (materialFilter.type && materialFilter.type.length > 0) {
        filteredMaterials = filteredMaterials.filter(m => 
          materialFilter.type!.includes(m.type)
        );
      }

      if (materialFilter.keywords && materialFilter.keywords.length > 0) {
        const keywords = materialFilter.keywords.map(k => k.toLowerCase());
        filteredMaterials = filteredMaterials.filter(m => {
          const searchText = `${m.title} ${m.description} ${m.keywords.join(' ')}`.toLowerCase();
          return keywords.some(keyword => searchText.includes(keyword));
        });
      }
    }

    // ファセット計算
    const facets = {
      educationStages: {} as { [key: string]: number },
      subjects: {} as { [key: string]: number },
      grades: {} as { [key: string]: number },
      publishers: {} as { [key: string]: number },
      types: {} as { [key: string]: number }
    };

    [...filteredTextbooks, ...filteredMaterials].forEach(item => {
      facets.educationStages[item.educationStage] = (facets.educationStages[item.educationStage] || 0) + 1;
      facets.subjects[item.subject] = (facets.subjects[item.subject] || 0) + 1;
      
      if ('publisher' in item) {
        facets.publishers[item.publisher.name] = (facets.publishers[item.publisher.name] || 0) + 1;
        facets.types[item.type] = (facets.types[item.type] || 0) + 1;
      } else {
        facets.types[item.type] = (facets.types[item.type] || 0) + 1;
      }
    });

    return {
      textbooks: filteredTextbooks,
      materials: filteredMaterials,
      totalCount: filteredTextbooks.length + filteredMaterials.length,
      facets
    };
  }

  // 教育理論関連メソッド
  async getEducationTheories(): Promise<EducationTheory[]> {
    await this.loadData();
    return [...this.educationTheories];
  }

  async getEducationTheoryById(id: string): Promise<EducationTheory | null> {
    await this.loadData();
    return this.educationTheories.find(theory => theory.id === id) || null;
  }

  async searchEducationTheories(filter: EducationTheorySearchFilter): Promise<EducationTheorySearchResult> {
    await this.loadData();
    let filteredTheories = [...this.educationTheories];

    // フィールドでフィルタリング
    if (filter.field && filter.field.length > 0) {
      filteredTheories = filteredTheories.filter(theory => 
        filter.field!.includes(theory.field)
      );
    }

    // 影響度でフィルタリング
    if (filter.influence && filter.influence.length > 0) {
      filteredTheories = filteredTheories.filter(theory => 
        filter.influence!.includes(theory.influence)
      );
    }

    // 適用レベルでフィルタリング
    if (filter.applicationLevel && filter.applicationLevel.length > 0) {
      filteredTheories = filteredTheories.filter(theory => 
        filter.applicationLevel!.some(level => theory.applicationLevel.includes(level))
      );
    }

    // 適用可能な教育段階でフィルタリング
    if (filter.applicableStages && filter.applicableStages.length > 0) {
      filteredTheories = filteredTheories.filter(theory => 
        filter.applicableStages!.some(stage => theory.applicableStages.includes(stage))
      );
    }

    // 適用可能な教科でフィルタリング
    if (filter.applicableSubjects && filter.applicableSubjects.length > 0) {
      filteredTheories = filteredTheories.filter(theory => 
        filter.applicableSubjects!.some(subject => theory.applicableSubjects.includes(subject))
      );
    }

    // キーワードでフィルタリング
    if (filter.keywords && filter.keywords.length > 0) {
      const keywords = filter.keywords.map(k => k.toLowerCase());
      filteredTheories = filteredTheories.filter(theory => {
        const searchText = `${theory.name} ${theory.description} ${theory.keywords.join(' ')}`.toLowerCase();
        return keywords.some(keyword => searchText.includes(keyword));
      });
    }

    // 開発者でフィルタリング
    if (filter.developers && filter.developers.length > 0) {
      filteredTheories = filteredTheories.filter(theory =>
        filter.developers!.some(developer => 
          theory.developers.some(dev => dev.toLowerCase().includes(developer.toLowerCase()))
        )
      );
    }

    // 開発年でフィルタリング
    if (filter.developmentYearRange) {
      filteredTheories = filteredTheories.filter(theory => {
        if (!theory.developmentYear) return false;
        const year = theory.developmentYear;
        const from = filter.developmentYearRange!.from;
        const to = filter.developmentYearRange!.to;
        return (!from || year >= from) && (!to || year <= to);
      });
    }

    // ファセット計算
    const facets = {
      fields: {} as { [key: string]: number },
      influences: {} as { [key: string]: number },
      applicationLevels: {} as { [key: string]: number },
      stages: {} as { [key: string]: number },
      subjects: {} as { [key: string]: number }
    };

    filteredTheories.forEach(theory => {
      facets.fields[theory.field] = (facets.fields[theory.field] || 0) + 1;
      facets.influences[theory.influence] = (facets.influences[theory.influence] || 0) + 1;
      
      theory.applicationLevel.forEach(level => {
        facets.applicationLevels[level] = (facets.applicationLevels[level] || 0) + 1;
      });
      
      theory.applicableStages.forEach(stage => {
        facets.stages[stage] = (facets.stages[stage] || 0) + 1;
      });
      
      theory.applicableSubjects.forEach(subject => {
        facets.subjects[subject] = (facets.subjects[subject] || 0) + 1;
      });
    });

    return {
      theories: filteredTheories,
      totalCount: filteredTheories.length,
      facets
    };
  }
}
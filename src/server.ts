import { JsonFileStorage } from './services/data-storage.js';
import { tools } from './tools/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Open Tenjin MCP Server
 * 教育データ（学習指導要領、教科書、教材）を提供するMCPサーバー
 */
class OpenTenjinMCPServer {
  private storage: JsonFileStorage;

  constructor() {
    const dataPath = path.join(__dirname, 'data');
    this.storage = new JsonFileStorage(dataPath);
  }

  /**
   * サーバー情報を取得
   */
  getServerInfo() {
    return {
      name: 'open-tenjin-mcp',
      version: '1.1.0',
      description: 'Educational data MCP server providing Japanese curriculum guidelines, textbooks, and educational materials',
      tools: tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema
      }))
    };
  }

  /**
   * ツールを実行
   */
  async executeTool(name: string, arguments_: any) {
    try {
      switch (name) {
        case 'search_curriculum':
          return await this.searchCurriculum(arguments_);
        
        case 'search_textbooks_materials':
          return await this.searchTextbooksAndMaterials(arguments_);
        
        case 'get_curriculum_detail':
          return await this.getCurriculumDetail(arguments_);
        
        case 'get_textbook_detail':
          return await this.getTextbookDetail(arguments_);
        
        case 'get_material_detail':
          return await this.getMaterialDetail(arguments_);
        
        case 'search_education_theories':
          return await this.searchEducationTheories(arguments_);
        
        case 'get_education_theory_detail':
          return await this.getEducationTheoryDetail(arguments_);
        
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      console.error(`Error executing tool ${name}:`, error);
      throw error;
    }
  }

  /**
   * 学習指導要領検索
   */
  private async searchCurriculum(args: any) {
    const filter = {
      educationStage: args.educationStage,
      subject: args.subject,
      grade: args.grade,
      keywords: args.keywords,
      bloomsTaxonomy: args.bloomsTaxonomy
    };

    const result = await this.storage.searchCurriculum(filter);
    
    return {
      type: 'curriculum_search_result',
      data: {
        guidelines: result.guidelines,
        units: result.units,
        contents: result.contents,
        totalCount: result.totalCount,
        facets: result.facets,
        summary: `${result.totalCount}件の学習指導要領が見つかりました。`
      }
    };
  }

  /**
   * 教科書・教材検索
   */
  private async searchTextbooksAndMaterials(args: any) {
    const result = await this.storage.searchTextbooksAndMaterials(
      args.textbookFilter,
      args.materialFilter
    );

    return {
      type: 'textbook_material_search_result',
      data: {
        textbooks: result.textbooks,
        materials: result.materials,
        totalCount: result.totalCount,
        facets: result.facets,
        summary: `教科書${result.textbooks.length}件、教材${result.materials.length}件が見つかりました。`
      }
    };
  }

  /**
   * 学習指導要領詳細取得
   */
  private async getCurriculumDetail(args: any) {
    const guideline = await this.storage.getCurriculumGuidelineById(args.id);
    
    if (!guideline) {
      throw new Error(`Curriculum guideline with ID ${args.id} not found`);
    }

    return {
      type: 'curriculum_detail',
      data: guideline
    };
  }

  /**
   * 教科書詳細取得
   */
  private async getTextbookDetail(args: any) {
    const textbook = await this.storage.getTextbookById(args.id);
    
    if (!textbook) {
      throw new Error(`Textbook with ID ${args.id} not found`);
    }

    return {
      type: 'textbook_detail',
      data: textbook
    };
  }

  /**
   * 教材詳細取得
   */
  private async getMaterialDetail(args: any) {
    const material = await this.storage.getEducationalMaterialById(args.id);
    
    if (!material) {
      throw new Error(`Educational material with ID ${args.id} not found`);
    }

    return {
      type: 'material_detail',
      data: material
    };
  }

  /**
   * 教育理論検索
   */
  private async searchEducationTheories(args: any) {
    const filter = {
      field: args.field,
      influence: args.influence,
      applicationLevel: args.applicationLevel,
      applicableStages: args.applicableStages,
      applicableSubjects: args.applicableSubjects,
      keywords: args.keywords,
      developers: args.developers,
      developmentYearRange: args.developmentYearRange
    };

    const result = await this.storage.searchEducationTheories(filter);
    
    return {
      type: 'education_theory_search_result',
      data: {
        theories: result.theories,
        totalCount: result.totalCount,
        facets: result.facets,
        summary: `${result.totalCount}件の教育理論が見つかりました。`
      }
    };
  }

  /**
   * 教育理論詳細取得
   */
  private async getEducationTheoryDetail(args: any) {
    const theory = await this.storage.getEducationTheoryById(args.id);
    
    if (!theory) {
      throw new Error(`Education theory with ID ${args.id} not found`);
    }

    return {
      type: 'education_theory_detail',
      data: theory
    };
  }

  /**
   * リソース一覧を取得
   */
  async getResources() {
    const [guidelines, textbooks, materials, theories] = await Promise.all([
      this.storage.getCurriculumGuidelines(),
      this.storage.getTextbooks(),
      this.storage.getEducationalMaterials(),
      this.storage.getEducationTheories()
    ]);

    return {
      curriculum_guidelines: guidelines.map(g => ({
        uri: `curriculum://guideline/${g.id}`,
        name: g.title,
        description: `${g.educationStage} - ${g.subject}`,
        mimeType: 'application/json'
      })),
      textbooks: textbooks.map(t => ({
        uri: `textbook://book/${t.id}`,
        name: t.title,
        description: `${t.publisher.name} - ${t.educationStage} - ${t.subject}`,
        mimeType: 'application/json'
      })),
      materials: materials.map(m => ({
        uri: `material://resource/${m.id}`,
        name: m.title,
        description: `${m.type} - ${m.educationStage} - ${m.subject}`,
        mimeType: 'application/json'
      })),
      theories: theories.map(t => ({
        uri: `theory://concept/${t.id}`,
        name: t.name,
        description: `${t.field} - ${t.influence}`,
        mimeType: 'application/json'
      }))
    };
  }

  /**
   * 特定のリソースを取得
   */
  async getResource(uri: string) {
    const [scheme, path] = uri.split('://');
    const [, id] = path.split('/');

    switch (scheme) {
      case 'curriculum':
        const guideline = await this.storage.getCurriculumGuidelineById(id);
        return guideline ? JSON.stringify(guideline, null, 2) : null;
      
      case 'textbook':
        const textbook = await this.storage.getTextbookById(id);
        return textbook ? JSON.stringify(textbook, null, 2) : null;
      
      case 'material':
        const material = await this.storage.getEducationalMaterialById(id);
        return material ? JSON.stringify(material, null, 2) : null;
      
      case 'theory':
        const theory = await this.storage.getEducationTheoryById(id);
        return theory ? JSON.stringify(theory, null, 2) : null;
      
      default:
        throw new Error(`Unknown resource scheme: ${scheme}`);
    }
  }
}

export default OpenTenjinMCPServer;
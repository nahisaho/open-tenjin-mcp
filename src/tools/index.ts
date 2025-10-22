/**
 * MCP Tool interface
 */
export interface Tool {
  name: string;
  description: string;
  inputSchema: any;
}

/**
 * 学習指導要領検索ツール
 */
export const searchCurriculumTool: Tool = {
  name: 'search_curriculum',
  description: '学習指導要領を検索します。教育段階、科目、学年、キーワードでフィルタリングできます。',
  inputSchema: {
    type: 'object',
    properties: {
      educationStage: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['elementary', 'junior_high', 'high', 'special_needs']
        },
        description: '教育段階（小学校、中学校、高等学校、特別支援学校）'
      },
      subject: {
        type: 'array',
        items: {
          type: 'string',
          enum: [
            'japanese', 'social_studies', 'arithmetic', 'science', 'life_studies',
            'music', 'art', 'home_economics', 'physical_education', 'foreign_language',
            'moral_education', 'special_activities', 'integrated_studies',
            'mathematics', 'technology', 'geography_history', 'civics', 'information'
          ]
        },
        description: '教科'
      },
      grade: {
        type: 'array',
        items: {
          type: 'string',
          enum: [
            'elementary_1', 'elementary_2', 'elementary_3', 'elementary_4', 'elementary_5', 'elementary_6',
            'junior_high_1', 'junior_high_2', 'junior_high_3',
            'high_1', 'high_2', 'high_3'
          ]
        },
        description: '学年'
      },
      keywords: {
        type: 'array',
        items: { type: 'string' },
        description: '検索キーワード'
      },
      bloomsTaxonomy: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create']
        },
        description: 'ブルームのタキソノミーレベル'
      }
    }
  }
};

/**
 * 教科書・教材検索ツール
 */
export const searchTextbooksAndMaterialsTool: Tool = {
  name: 'search_textbooks_materials',
  description: '教科書と教材を検索します。教育段階、科目、学年、種別などでフィルタリングできます。',
  inputSchema: {
    type: 'object',
    properties: {
      textbookFilter: {
        type: 'object',
        properties: {
          educationStage: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['elementary', 'junior_high', 'high', 'special_needs']
            }
          },
          subject: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          grade: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          publisher: {
            type: 'array',
            items: { type: 'string' }
          },
          type: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['main', 'supplementary', 'workbook', 'reference']
            }
          },
          keywords: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        description: '教科書の検索フィルター'
      },
      materialFilter: {
        type: 'object',
        properties: {
          educationStage: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['elementary', 'junior_high', 'high', 'special_needs']
            }
          },
          subject: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          grade: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          type: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['worksheet', 'slide', 'video', 'audio', 'image', 'interactive', 'experiment', 'game', 'assessment', 'reference']
            }
          },
          usageContext: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['introduction', 'explanation', 'practice', 'assessment', 'review', 'homework', 'enrichment']
            }
          },
          difficulty: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['basic', 'standard', 'advanced', 'challenge']
            }
          },
          keywords: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        description: '教材の検索フィルター'
      }
    }
  }
};

/**
 * 学習指導要領詳細取得ツール
 */
export const getCurriculumDetailTool: Tool = {
  name: 'get_curriculum_detail',
  description: '指定されたIDの学習指導要領の詳細情報を取得します。',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: '学習指導要領のID'
      }
    },
    required: ['id']
  }
};

/**
 * 教科書詳細取得ツール
 */
export const getTextbookDetailTool: Tool = {
  name: 'get_textbook_detail',
  description: '指定されたIDの教科書の詳細情報を取得します。',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: '教科書のID'
      }
    },
    required: ['id']
  }
};

/**
 * 教材詳細取得ツール
 */
export const getMaterialDetailTool: Tool = {
  name: 'get_material_detail',
  description: '指定されたIDの教材の詳細情報を取得します。',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: '教材のID'
      }
    },
    required: ['id']
  }
};

/**
 * 教育理論検索ツール
 */
export const searchEducationTheoriesTool: Tool = {
  name: 'search_education_theories',
  description: '教育理論を検索します。分野、影響度、適用レベル、教育段階、教科、キーワードなどでフィルタリングできます。',
  inputSchema: {
    type: 'object',
    properties: {
      field: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['learning_theory', 'cognitive_psychology', 'instructional_design', 'assessment', 'motivation', 'developmental', 'social_learning', 'constructivism', 'behaviorism', 'humanistic']
        },
        description: '理論の分野'
      },
      influence: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['foundational', 'widely_applied', 'emerging', 'specialized']
        },
        description: '理論の影響度'
      },
      applicationLevel: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['individual', 'classroom', 'institutional', 'systemic']
        },
        description: '適用レベル'  
      },
      applicableStages: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['elementary', 'lower_secondary', 'upper_secondary', 'higher_education']
        },  
        description: '適用可能な教育段階'
      },
      applicableSubjects: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['japanese', 'mathematics', 'science', 'social_studies', 'english', 'arts', 'music', 'pe', 'home_economics', 'technology', 'moral', 'special_activities', 'integrated_studies', 'career_guidance']
        },
        description: '適用可能な教科'
      },
      keywords: {
        type: 'array',
        items: {
          type: 'string'
        },
        description: '検索キーワード'
      },
      developers: {
        type: 'array',
        items: {
          type: 'string'
        },
        description: '理論の開発者・提唱者'
      },
      developmentYearRange: {
        type: 'object',
        properties: {
          from: {
            type: 'number',
            description: '開発年の開始年'
          },
          to: {
            type: 'number', 
            description: '開発年の終了年'
          }
        },
        description: '開発年の範囲'
      }
    }
  }
};

/**
 * 教育理論詳細取得ツール
 */
export const getEducationTheoryDetailTool: Tool = {
  name: 'get_education_theory_detail',
  description: '指定されたIDの教育理論の詳細情報を取得します。',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: '教育理論のID'
      }
    },
    required: ['id']
  }
};

/**
 * 全ツールのリスト
 */
export const tools: Tool[] = [
  searchCurriculumTool,
  searchTextbooksAndMaterialsTool,
  getCurriculumDetailTool,
  getTextbookDetailTool,
  getMaterialDetailTool,
  searchEducationTheoriesTool,
  getEducationTheoryDetailTool
];
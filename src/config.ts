/**
 * Open Tenjin MCP Server Configuration
 */

export interface LogConfig {
  enabled: boolean;
  level: 'debug' | 'info' | 'warning' | 'error';
  directory: string;
  maxFileSize: number; // MB
  maxFiles: number;
  includeClientInfo: boolean;
  includeRequestParams: boolean;
}

export interface ServerConfig {
  logging: LogConfig;
  server: {
    name: string;
    version: string;
    maxRequestSize: number; // bytes
  };
}

export const defaultConfig: ServerConfig = {
  logging: {
    enabled: true,
    level: 'info',
    directory: 'logs',
    maxFileSize: 10, // 10MB
    maxFiles: 7, // 7日分
    includeClientInfo: true,
    includeRequestParams: false, // プライバシー保護のためデフォルトはfalse
  },
  server: {
    name: 'open-tenjin-mcp',
    version: '1.2.0',
    maxRequestSize: 1024 * 1024, // 1MB
  }
};

// 環境変数から設定を読み込む
export function loadConfig(): ServerConfig {
  const config = { ...defaultConfig };
  
  // 環境変数から設定を上書き
  if (process.env.MCP_LOG_ENABLED !== undefined) {
    config.logging.enabled = process.env.MCP_LOG_ENABLED === 'true';
  }
  
  if (process.env.MCP_LOG_LEVEL) {
    config.logging.level = process.env.MCP_LOG_LEVEL as LogConfig['level'];
  }
  
  if (process.env.MCP_LOG_DIR) {
    config.logging.directory = process.env.MCP_LOG_DIR;
  }
  
  if (process.env.MCP_LOG_INCLUDE_PARAMS) {
    config.logging.includeRequestParams = process.env.MCP_LOG_INCLUDE_PARAMS === 'true';
  }
  
  return config;
}
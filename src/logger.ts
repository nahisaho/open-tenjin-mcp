import fs from 'fs';
import path from 'path';
import { LogConfig } from './config.js';

export interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warning' | 'error';
  method?: string;
  requestId?: string | number;
  clientInfo?: {
    name?: string;
    version?: string;
  };
  params?: Record<string, unknown>;
  responseTime?: number;
  error?: string;
  message: string;
}

export class Logger {
  private config: LogConfig;
  private logDir: string;
  
  constructor(config: LogConfig) {
    this.config = config;
    this.logDir = path.resolve(config.directory);
    
    if (config.enabled) {
      this.ensureLogDirectory();
    }
  }
  
  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }
  
  private getLogFileName(): string {
    const date = new Date().toISOString().split('T')[0];
    return path.join(this.logDir, `access-${date}.jsonl`);
  }
  
  private shouldLog(level: LogEntry['level']): boolean {
    if (!this.config.enabled) return false;
    
    const levels = ['debug', 'info', 'warning', 'error'];
    const configLevel = levels.indexOf(this.config.level);
    const entryLevel = levels.indexOf(level);
    
    return entryLevel >= configLevel;
  }
  
  private sanitizeParams(params: Record<string, unknown>): Record<string, unknown> {
    if (!this.config.includeRequestParams) {
      return { '[PARAMS_EXCLUDED]': 'プライバシー保護のためパラメーターを除外' };
    }
    
    // 機密情報の可能性があるフィールドをマスク
    const sanitized = { ...params };
    const sensitiveFields = ['password', 'token', 'key', 'secret', 'auth'];
    
    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[MASKED]';
      }
    }
    
    return sanitized;
  }
  
  private writeLog(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return;
    
    try {
      const logLine = JSON.stringify(entry) + '\n';
      const fileName = this.getLogFileName();
      
      fs.appendFileSync(fileName, logLine, 'utf8');
      
      // ファイルサイズチェックとローテーション
      this.rotateLogsIfNeeded();
    } catch (error) {
      console.error('Failed to write log:', error);
    }
  }
  
  private rotateLogsIfNeeded(): void {
    try {
      const files = fs.readdirSync(this.logDir)
        .filter(f => f.startsWith('access-') && f.endsWith('.jsonl'))
        .sort()
        .reverse();
      
      // 古いファイルを削除
      if (files.length > this.config.maxFiles) {
        const filesToDelete = files.slice(this.config.maxFiles);
        for (const file of filesToDelete) {
          fs.unlinkSync(path.join(this.logDir, file));
        }
      }
      
      // ファイルサイズチェック
      const currentFile = this.getLogFileName();
      if (fs.existsSync(currentFile)) {
        const stats = fs.statSync(currentFile);
        const sizeInMB = stats.size / (1024 * 1024);
        
        if (sizeInMB > this.config.maxFileSize) {
          // タイムスタンプ付きでリネーム
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const newName = currentFile.replace('.jsonl', `-${timestamp}.jsonl`);
          fs.renameSync(currentFile, newName);
        }
      }
    } catch (error) {
      console.error('Failed to rotate logs:', error);
    }
  }
  
  public logRequest(method: string, requestId: string | number, params?: Record<string, unknown>, clientInfo?: { name?: string; version?: string }): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      method,
      requestId,
      message: `MCP Request: ${method}`,
    };
    
    if (clientInfo && this.config.includeClientInfo) {
      entry.clientInfo = clientInfo;
    }
    
    if (params) {
      entry.params = this.sanitizeParams(params);
    }
    
    this.writeLog(entry);
  }
  
  public logResponse(method: string, requestId: string | number, responseTime: number, error?: string): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: error ? 'error' : 'info',
      method,
      requestId,
      responseTime,
      message: error ? `MCP Response Error: ${method}` : `MCP Response: ${method}`,
    };
    
    if (error) {
      entry.error = error;
    }
    
    this.writeLog(entry);
  }
  
  public logError(message: string, error?: Error): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
    };
    
    if (error?.message) {
      entry.error = error.message;
    }
    
    this.writeLog(entry);
  }
  
  public logInfo(message: string): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
    };
    
    this.writeLog(entry);
  }
  
  public logDebug(message: string, data?: Record<string, unknown>): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'debug',
      message,
    };
    
    if (data) {
      entry.params = this.sanitizeParams(data);
    }
    
    this.writeLog(entry);
  }
}
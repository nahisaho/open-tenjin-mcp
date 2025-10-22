#!/usr/bin/env node

import OpenTenjinMCPServer from './server.js';
import { Logger } from './logger.js';
import { loadConfig } from './config.js';

// TODO: 将来的にMCP型定義を使用してタイプセーフティを向上
// import type { 
//   JSONRPCRequest, 
//   JSONRPCResponse, 
//   JSONRPCNotification,
//   ErrorCodes 
// } from './types/mcp.js';

/**
 * MCPサーバーのメインエントリーポイント
 */
async function main() {
  // 設定とロガーを初期化
  const config = loadConfig();
  const logger = new Logger(config.logging);
  const server = new OpenTenjinMCPServer();
  
  // サーバー情報を出力
  console.log('Open Tenjin MCP Server starting...');
  console.log('Server Info:', server.getServerInfo());
  logger.logInfo('Open Tenjin MCP Server started');
  
  if (config.logging.enabled) {
    console.log(`Logging enabled: ${config.logging.directory}`);
    logger.logInfo(`Logging configuration: level=${config.logging.level}, dir=${config.logging.directory}`);
  }

  // stdin/stdoutでMCPプロトコル通信を処理
  process.stdin.setEncoding('utf8');
  
  let buffer = '';
  
  process.stdin.on('data', async (chunk) => {
    buffer += chunk;
    
    // 行ごとに処理
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    
    for (const line of lines) {
      if (line.trim()) {
        const startTime = Date.now();
        let requestId: string | number | null = null;
        let method: string | null = null;
        
        try {
          const request = JSON.parse(line);
          requestId = request.id;
          method = request.method;
          
          // リクエストログ
          if (method) {
            logger.logRequest(method, requestId || 'notification', request.params);
          }
          
          const response = await handleRequest(server, request);
          
          // レスポンス時間計算
          const responseTime = Date.now() - startTime;
          
          // レスポンスログ
          if (requestId && method) {
            logger.logResponse(method, requestId, responseTime);
          }
          
          // 通知の場合はレスポンスを返さない
          if (response !== null) {
            console.log(JSON.stringify(response));
          }
        } catch (error) {
          const responseTime = Date.now() - startTime;
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          
          logger.logError('Error processing request', error instanceof Error ? error : undefined);
          
          if (requestId && method) {
            logger.logResponse(method, requestId, responseTime, errorMessage);
          }
          
          console.error('Error processing request:', error);
          
          // パース可能であれば適切なエラーレスポンスを返す
          try {
            const parsedRequest = JSON.parse(line);
            requestId = parsedRequest.id;
          } catch {}
          
          console.log(JSON.stringify({
            jsonrpc: '2.0',
            error: {
              code: -32700,
              message: 'Parse error'
            },
            id: requestId
          }));
        }
      }
    }
  });

  process.stdin.on('end', () => {
    logger.logInfo('MCP Server terminated by client');
    console.log('MCP Server terminated');
    process.exit(0);
  });
}

/**
 * MCPリクエストを処理
 */
async function handleRequest(server: OpenTenjinMCPServer, request: any) {
  const { method, params, id } = request;

  try {
    switch (method) {
      case 'initialize':
        return {
          jsonrpc: '2.0',
          result: {
            protocolVersion: '2025-06-18',
            capabilities: {
              tools: {
                listChanged: true
              },
              resources: {
                subscribe: false,
                listChanged: true
              }
            },
            serverInfo: {
              name: 'open-tenjin-mcp',
              version: '1.2.0'
            }
          },
          id
        };

      case 'notifications/initialized':
        // initialized通知を受信（レスポンスは不要）
        console.log('Client initialized');
        return null;

      case 'tools/list':
        return {
          jsonrpc: '2.0',
          result: {
            tools: server.getServerInfo().tools
          },
          id
        };

      case 'tools/call':
        try {
          const result = await server.executeTool(params.name, params.arguments || {});
          return {
            jsonrpc: '2.0',
            result: {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2)
                }
              ],
              structuredContent: result, // 2025-06-18仕様の構造化出力
              isError: false
            },
            id
          };
        } catch (toolError) {
          return {
            jsonrpc: '2.0',
            result: {
              content: [
                {
                  type: 'text',
                  text: `Tool execution error: ${toolError instanceof Error ? toolError.message : 'Unknown error'}`
                }
              ],
              isError: true
            },
            id
          };
        }

      case 'resources/list':
        const resources = await server.getResources();
        return {
          jsonrpc: '2.0',
          result: {
            resources: [
              ...resources.curriculum_guidelines,
              ...resources.textbooks,
              ...resources.materials,
              ...resources.theories
            ]
          },
          id
        };

      case 'resources/read':
        const content = await server.getResource(params.uri);
        if (!content) {
          return {
            jsonrpc: '2.0',
            error: {
              code: -32002,
              message: 'Resource not found',
              data: { uri: params.uri }
            },
            id
          };
        }
        return {
          jsonrpc: '2.0',
          result: {
            contents: [
              {
                uri: params.uri,
                mimeType: 'application/json',
                text: content
              }
            ]
          },
          id
        };

      default:
        return {
          jsonrpc: '2.0',
          error: {
            code: -32601,
            message: `Method not found: ${method}`
          },
          id
        };
    }
  } catch (error) {
    return {
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: error instanceof Error ? error.message : 'Internal error',
        ...(error instanceof Error && { data: { stack: error.stack } })
      },
      id
    };
  }
}

// プロセス終了時の処理
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT, shutting down gracefully...');
  // ログインスタンスがグローバルにないため、シンプルなコンソールログのみ
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// メイン関数を実行
main().catch((error) => {
  console.error('Failed to start MCP server:', error);
  // サーバー起動失敗時はロガーが初期化されていない可能性があるため、コンソールログのみ
  process.exit(1);
});
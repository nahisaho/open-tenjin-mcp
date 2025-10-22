#!/usr/bin/env node

/**
 * MCP Protocol 2025-06-18仕様準拠テスト
 * 実装が最新のMCP仕様に準拠しているかをテストします
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testMCPServer() {
  console.log('🧪 MCP Protocol 2025-06-18 準拠テストを開始...\n');

  const serverPath = path.join(__dirname, 'dist/index.js');
  const server = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'inherit']
  });

  const tests = [
    {
      name: '1. Initialize Request',
      request: {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2025-06-18',
          capabilities: {
            roots: { listChanged: true },
            sampling: {}
          },
          clientInfo: {
            name: 'TestClient',
            version: '1.0.0'
          }
        }
      },
      expectedVersion: '2025-06-18'
    },
    {
      name: '2. Initialized Notification',
      request: {
        jsonrpc: '2.0',
        method: 'notifications/initialized'
      },
      expectNoResponse: true
    },
    {
      name: '3. Tools List',
      request: {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list'
      },
      expectTools: true
    },
    {
      name: '4. Resources List',
      request: {
        jsonrpc: '2.0',
        id: 3,
        method: 'resources/list'
      },
      expectResources: true
    },
    {
      name: '5. Tool Call Test',
      request: {
        jsonrpc: '2.0',
        id: 4,
        method: 'tools/call',
        params: {
          name: 'search_curriculum',
          arguments: {
            educationStage: ['elementary'],
            subject: ['japanese']
          }
        }
      },
      expectIsError: false
    }
  ];

  let testIndex = 0;
  let results = [];

  return new Promise((resolve) => {
    server.stdout.on('data', (data) => {
      const lines = data.toString().split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        if (line.startsWith('{')) {
          try {
            const response = JSON.parse(line);
            const test = tests[testIndex - 1];
            
            if (test && !test.expectNoResponse) {
              const result = validateResponse(test, response);
              results.push(result);
              console.log(result.success ? '✅' : '❌', test.name, result.success ? 'PASS' : `FAIL: ${result.error}`);
            }
          } catch (error) {
            console.log('❌', `パースエラー: ${error.message}`);
            results.push({ success: false, error: `Parse error: ${error.message}` });
          }
        }
      }
    });

    // テストを順次実行
    const runNextTest = () => {
      if (testIndex >= tests.length) {
        server.kill();
        
        const passCount = results.filter(r => r.success).length;
        const totalCount = results.length;
        
        console.log(`\n📊 テスト結果: ${passCount}/${totalCount} PASS`);
        
        if (passCount === totalCount) {
          console.log('🎉 すべてのテストに合格しました！MCP 2025-06-18仕様に準拠しています。');
        } else {
          console.log('⚠️  一部のテストが失敗しました。');
        }
        
        resolve({ passCount, totalCount, results });
        return;
      }

      const test = tests[testIndex];
      console.log(`📤 ${test.name}...`);
      
      server.stdin.write(JSON.stringify(test.request) + '\n');
      testIndex++;

      // 通知の場合は即座に次のテストへ
      if (test.expectNoResponse) {
        console.log('✅', test.name, 'PASS (通知のためレスポンスなし)');
        setTimeout(runNextTest, 100);
      } else {
        setTimeout(runNextTest, 500);
      }
    };

    // 初回テスト開始
    setTimeout(runNextTest, 1000);
  });
}

function validateResponse(test, response) {
  try {
    // 基本的なJSON-RPC形式チェック
    if (response.jsonrpc !== '2.0') {
      return { success: false, error: 'Invalid JSON-RPC version' };
    }

    if (response.error) {
      return { success: false, error: `Server error: ${response.error.message}` };
    }

    // テスト固有の検証
    if (test.expectedVersion && response.result.protocolVersion !== test.expectedVersion) {
      return { success: false, error: `Expected protocol version ${test.expectedVersion}, got ${response.result.protocolVersion}` };
    }

    if (test.expectTools && (!response.result.tools || !Array.isArray(response.result.tools))) {
      return { success: false, error: 'Expected tools array' };
    }

    if (test.expectResources && (!response.result.resources || !Array.isArray(response.result.resources))) {
      return { success: false, error: 'Expected resources array' };
    }

    if (test.expectIsError !== undefined) {
      if (response.result.isError !== test.expectIsError) {
        return { success: false, error: `Expected isError: ${test.expectIsError}, got ${response.result.isError}` };
      }
      
      // 2025-06-18仕様: structuredContentの確認
      if (test.name.includes('Tool Call') && response.result.structuredContent === undefined) {
        return { success: false, error: 'Expected structuredContent in tool call result' };
      }
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: `Validation error: ${error.message}` };
  }
}

// テスト実行
testMCPServer().catch(console.error);
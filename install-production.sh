#!/bin/bash

# Open Tenjin MCP 本番デプロイメントスクリプト
# システム全体にMCPサーバーをインストールするためのスクリプト

set -e

INSTALL_DIR="/opt/open-tenjin-mcp"
SERVICE_USER="mcp-server"
LOG_DIR="/var/log/open-tenjin-mcp"

# 色付きの出力
print_info() {
    echo -e "\033[1;34m[INFO]\033[0m $1"
}

print_success() {
    echo -e "\033[1;32m[SUCCESS]\033[0m $1"
}

print_error() {
    echo -e "\033[1;31m[ERROR]\033[0m $1"
}

print_warning() {
    echo -e "\033[1;33m[WARNING]\033[0m $1"
}

# root権限チェック
check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "このスクリプトはroot権限で実行する必要があります"
        exit 1
    fi
}

# 依存関係チェック
check_dependencies() {
    print_info "依存関係をチェック中..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.jsがインストールされていません"
        print_info "以下のコマンドでインストールしてください:"
        print_info "curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
        print_info "sudo apt-get install -y nodejs"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [[ $NODE_VERSION -lt 18 ]]; then
        print_error "Node.js 18以上が必要です (現在: $(node --version))"
        exit 1
    fi
    
    print_success "依存関係OK: Node.js $(node --version)"
}

# サービスユーザー作成
create_service_user() {
    if ! id "$SERVICE_USER" &>/dev/null; then
        print_info "サービスユーザー '$SERVICE_USER' を作成中..."
        useradd --system --shell /bin/false --home "$INSTALL_DIR" "$SERVICE_USER"
        print_success "サービスユーザーを作成しました"
    else
        print_info "サービスユーザー '$SERVICE_USER' は既に存在します"
    fi
}

# インストールディレクトリ作成
create_install_directory() {
    print_info "インストールディレクトリを作成中..."
    mkdir -p "$INSTALL_DIR"
    mkdir -p "$LOG_DIR"
    
    # 現在のビルド済みファイルをコピー
    if [[ -d "./dist" ]]; then
        print_info "ビルド済みファイルをコピー中..."
        cp -r ./dist/* "$INSTALL_DIR/"
        cp package.json "$INSTALL_DIR/"
    else
        print_error "dist/ディレクトリが見つかりません。まず 'npm run build' を実行してください"
        exit 1
    fi
    
    # 権限設定
    chown -R "$SERVICE_USER:$SERVICE_USER" "$INSTALL_DIR"
    chown -R "$SERVICE_USER:$SERVICE_USER" "$LOG_DIR"
    
    print_success "インストールディレクトリを設定しました: $INSTALL_DIR"
}

# systemdサービスファイル作成
create_systemd_service() {
    print_info "systemdサービスファイルを作成中..."
    
    cat > /etc/systemd/system/open-tenjin-mcp.service << EOF
[Unit]
Description=Open Tenjin MCP Server
Documentation=https://github.com/nahisaho/open-tenjin-mcp
After=network.target

[Service]
Type=simple
User=$SERVICE_USER
Group=$SERVICE_USER
WorkingDirectory=$INSTALL_DIR
ExecStart=/usr/bin/node $INSTALL_DIR/index.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=open-tenjin-mcp

# 環境変数
Environment=NODE_ENV=production
Environment=MCP_LOG_ENABLED=true
Environment=MCP_LOG_LEVEL=info
Environment=MCP_LOG_DIR=$LOG_DIR

# セキュリティ設定
NoNewPrivileges=yes
PrivateTmp=yes
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=$LOG_DIR

[Install]
WantedBy=multi-user.target
EOF

    systemctl daemon-reload
    print_success "systemdサービスファイルを作成しました"
}

# サービス開始
start_service() {
    print_info "Open Tenjin MCPサービスを開始中..."
    
    systemctl enable open-tenjin-mcp
    systemctl start open-tenjin-mcp
    
    # サービス状態確認
    sleep 2
    if systemctl is-active --quiet open-tenjin-mcp; then
        print_success "Open Tenjin MCPサービスが正常に開始されました"
    else
        print_error "サービスの開始に失敗しました"
        print_info "ログを確認してください: journalctl -u open-tenjin-mcp -f"
        exit 1
    fi
}

# MCP設定例を表示
show_configuration_examples() {
    print_info "=== MCP クライアント設定例 ==="
    
    echo ""
    print_info "Claude Desktop 設定 (~/.config/Claude/claude_desktop_config.json):"
    cat << EOF
{
  "mcpServers": {
    "open-tenjin": {
      "command": "node",
      "args": ["$INSTALL_DIR/index.js"],
      "env": {
        "MCP_LOG_ENABLED": "true",
        "MCP_LOG_LEVEL": "info"
      }
    }
  }
}
EOF

    echo ""
    print_info "サービス管理コマンド:"
    echo "  systemctl status open-tenjin-mcp    # ステータス確認"
    echo "  systemctl restart open-tenjin-mcp   # 再起動"
    echo "  systemctl stop open-tenjin-mcp      # 停止"
    echo "  journalctl -u open-tenjin-mcp -f    # ログ確認"
    
    echo ""
    print_info "ログファイル: $LOG_DIR"
}

# アンインストール
uninstall() {
    print_warning "Open Tenjin MCPをアンインストールします"
    read -p "続行しますか？ (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "サービスを停止中..."
        systemctl stop open-tenjin-mcp 2>/dev/null || true
        systemctl disable open-tenjin-mcp 2>/dev/null || true
        
        print_info "ファイルを削除中..."
        rm -f /etc/systemd/system/open-tenjin-mcp.service
        rm -rf "$INSTALL_DIR"
        userdel "$SERVICE_USER" 2>/dev/null || true
        
        systemctl daemon-reload
        print_success "アンインストールが完了しました"
    else
        print_info "キャンセルされました"
    fi
}

# メイン処理
main() {
    case "${1:-install}" in
        install)
            print_info "Open Tenjin MCP本番インストールを開始します"
            check_root
            check_dependencies
            create_service_user
            create_install_directory
            create_systemd_service
            start_service
            show_configuration_examples
            print_success "インストールが完了しました！"
            ;;
        uninstall)
            check_root
            uninstall
            ;;
        *)
            echo "使用方法: $0 [install|uninstall]"
            exit 1
            ;;
    esac
}

main "$@"
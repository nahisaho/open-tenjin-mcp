#!/bin/bash

# Open Tenjin MCP Docker デプロイメントスクリプト
# このスクリプトはDockerコンテナでOpen Tenjin MCPを簡単にデプロイするためのものです

set -e

# 色付きの出力用の関数
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

# 使用方法を表示
show_usage() {
    echo "Open Tenjin MCP Docker デプロイメントスクリプト"
    echo ""
    echo "使用方法:"
    echo "  $0 [コマンド]"
    echo ""
    echo "コマンド:"
    echo "  build     - Dockerイメージをビルド"
    echo "  start     - プロダクション環境でコンテナを起動"
    echo "  dev       - 開発環境でコンテナを起動"
    echo "  stop      - コンテナを停止"
    echo "  restart   - コンテナを再起動"
    echo "  logs      - ログを表示"
    echo "  status    - コンテナの状態を確認"
    echo "  clean     - コンテナとイメージを削除"
    echo "  help      - この使用方法を表示"
    echo ""
}

# Dockerとdocker-composeがインストールされているかチェック
check_requirements() {
    if ! command -v docker &> /dev/null; then
        print_error "Dockerがインストールされていません"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "docker-composeがインストールされていません"
        exit 1
    fi
}

# ログディレクトリを作成
create_log_directory() {
    if [ ! -d "./logs" ]; then
        print_info "ログディレクトリを作成中..."
        mkdir -p ./logs
        print_success "ログディレクトリを作成しました"
    fi
}

# Dockerイメージをビルド
build_image() {
    print_info "Open Tenjin MCP Dockerイメージをビルド中..."
    docker build -t open-tenjin-mcp:latest .
    print_success "Dockerイメージのビルドが完了しました"
}

# プロダクション環境でコンテナを起動
start_production() {
    print_info "プロダクション環境でOpen Tenjin MCPを起動中..."
    create_log_directory
    docker-compose up -d open-tenjin-mcp
    print_success "Open Tenjin MCPがプロダクション環境で起動しました"
    print_info "コンテナ状態:"
    docker-compose ps
}

# 開発環境でコンテナを起動
start_development() {
    print_info "開発環境でOpen Tenjin MCPを起動中..."
    create_log_directory
    docker-compose up -d open-tenjin-mcp-dev
    print_success "Open Tenjin MCPが開発環境で起動しました"
    print_info "コンテナ状態:"
    docker-compose ps
}

# コンテナを停止
stop_containers() {
    print_info "Open Tenjin MCPコンテナを停止中..."
    docker-compose down
    print_success "コンテナを停止しました"
}

# コンテナを再起動
restart_containers() {
    print_info "Open Tenjin MCPコンテナを再起動中..."
    docker-compose restart
    print_success "コンテナを再起動しました"
}

# ログを表示
show_logs() {
    print_info "Open Tenjin MCPのログを表示中..."
    docker-compose logs -f --tail=100
}

# コンテナの状態を確認
check_status() {
    print_info "Open Tenjin MCPコンテナの状態:"
    docker-compose ps
    echo ""
    print_info "Dockerイメージ:"
    docker images | grep -E "(open-tenjin-mcp|REPOSITORY)"
}

# コンテナとイメージを削除
clean_up() {
    print_warning "この操作により、すべてのOpen Tenjin MCPコンテナとイメージが削除されます"
    read -p "続行しますか？ (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "コンテナとイメージを削除中..."
        docker-compose down --rmi all --volumes --remove-orphans
        docker rmi open-tenjin-mcp:latest 2>/dev/null || true
        print_success "クリーンアップが完了しました"
    else
        print_info "キャンセルされました"
    fi
}

# メイン処理
main() {
    case "${1:-help}" in
        build)
            check_requirements
            build_image
            ;;
        start)
            check_requirements
            start_production
            ;;
        dev)
            check_requirements
            start_development
            ;;
        stop)
            check_requirements
            stop_containers
            ;;
        restart)
            check_requirements
            restart_containers
            ;;
        logs)
            check_requirements
            show_logs
            ;;
        status)
            check_requirements
            check_status
            ;;
        clean)
            check_requirements
            clean_up
            ;;
        help|--help|-h)
            show_usage
            ;;
        *)
            print_error "不明なコマンド: $1"
            show_usage
            exit 1
            ;;
    esac
}

# スクリプト実行
main "$@"
# Open Tenjin MCP Makefile
# Dockerイメージのビルドと管理を簡単にするためのMakefile

.PHONY: build run stop clean test docker-build docker-run docker-stop docker-clean help

# デフォルトターゲット
help:
	@echo "Open Tenjin MCP - Available commands:"
	@echo ""
	@echo "Node.js commands:"
	@echo "  build          - TypeScriptをビルド"
	@echo "  run            - アプリケーションを起動"
	@echo "  test           - テストを実行"
	@echo "  clean          - ビルド成果物を削除"
	@echo ""
	@echo "Docker commands:"
	@echo "  docker-build   - Dockerイメージをビルド"
	@echo "  docker-run     - Dockerコンテナを起動"
	@echo "  docker-stop    - Dockerコンテナを停止"
	@echo "  docker-clean   - Dockerイメージとコンテナを削除"
	@echo ""
	@echo "Combined commands:"
	@echo "  all            - ビルドしてテストを実行"
	@echo "  docker-all     - Dockerイメージをビルドして起動"

# Node.js関連のコマンド
build:
	npm run build

run: build
	npm start

test:
	npm test

clean:
	rm -rf dist/
	rm -rf node_modules/
	rm -rf logs/

# Docker関連のコマンド
docker-build:
	docker build -t open-tenjin-mcp:latest .

docker-run: docker-build
	docker run -d \
		--name open-tenjin-mcp \
		--restart unless-stopped \
		-v $(PWD)/logs:/app/logs \
		-e NODE_ENV=production \
		-e MCP_LOG_ENABLED=true \
		open-tenjin-mcp:latest

docker-stop:
	docker stop open-tenjin-mcp 2>/dev/null || true
	docker rm open-tenjin-mcp 2>/dev/null || true

docker-clean: docker-stop
	docker rmi open-tenjin-mcp:latest 2>/dev/null || true

# 複合コマンド
all: build test

docker-all: docker-build docker-run

# 開発用コマンド
dev:
	npm run dev

docker-dev:
	docker-compose up -d open-tenjin-mcp-dev

# GitHub Container Registry用
docker-push:
	docker tag open-tenjin-mcp:latest ghcr.io/nahisaho/open-tenjin-mcp:latest
	docker push ghcr.io/nahisaho/open-tenjin-mcp:latest

# マルチプラットフォームビルド（GitHub Actions用）
docker-buildx:
	docker buildx build \
		--platform linux/amd64,linux/arm64 \
		-t ghcr.io/nahisaho/open-tenjin-mcp:latest \
		--push .

# インストール
install:
	npm install

install-global:
	sudo ./install-production.sh install

uninstall-global:
	sudo ./install-production.sh uninstall
#!/bin/bash

# データベース初期化スクリプト
# Docker Composeでデータベースを起動し、初期化が完了するまで待機

echo "📦 データベースコンテナを起動中..."
docker-compose up -d

echo "⏳ データベースの初期化を待機中..."

# データベースが完全に起動するまで待機
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    # PostgreSQLに接続できるかテスト
    if docker-compose exec -T postgres pg_isready -h localhost -p 5432 -U test > /dev/null 2>&1; then
        echo "✅ データベースが利用可能になりました"
        break
    fi
    
    attempt=$((attempt + 1))
    echo "  待機中... ($attempt/$max_attempts)"
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo "❌ データベースの起動に失敗しました"
    exit 1
fi

echo "🔧 データベースの初期化が完了しました"
echo "📝 Prismaマイグレーションを実行してください: npx prisma migrate dev"

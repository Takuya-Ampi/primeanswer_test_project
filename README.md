# ソフトウェアテスト講義サンプルコード

Express.js + TypeScript + Jestによる実践的テストのサンプルコード

## 使用技術

- **Express.js** - APIサーバー
- **TypeScript** - 型安全性
- **Jest** - テストフレームワーク
- **Prisma** - ORM
- **PostgreSQL** - データベース
- **Docker Compose** - 環境管理

## セットアップ手順

### 開発環境

1. リポジトリをクローン
   ```
   git clone https://github.com/yourusername/software-testing-example.git
   cd software-testing-example
   ```

2. 依存関係をインストール
   ```
   npm install
   ```

3. 環境変数を設定
   ```
   cp .env.example .env
   ```
   `.env`ファイルを編集して適切なデータベースURLを設定

4. データベースマイグレーション
   ```
   npx prisma migrate dev
   ```

5. 開発サーバーを起動
   ```
   npm run dev
   ```

### テスト環境

1. テスト用のデータベースを起動
   ```
   docker-compose -f docker-compose.test.yml up -d
   ```

2. テスト用の環境変数を設定
   ```
   cp .env.example .env
   ```
   `.env`ファイルを編集して適切なデータベースURLを設定

3. テストの実行
   ```
   npm test
   ```

## テスト実行

```bash
# 全テストを実行
npm test

# 監視モードでテストを実行
npm run test:watch

# カバレッジ付きでテストを実行
npm run test:coverage

# CI/CD用のテスト実行
npm run test:ci
```

## プロジェクト構造

```
.
├── prisma/              # Prisma設定
├── src/
│   ├── controllers/     # APIコントローラー
│   ├── lib/             # ライブラリ（Prismaなど）
│   ├── routes/          # APIルート
│   ├── services/        # ビジネスロジック
│   ├── test/            # テスト設定
│   ├── __tests__/       # 統合テスト
│   ├── app.ts           # Expressアプリ設定
│   └── server.ts        # サーバーエントリーポイント
├── jest.config.js       # Jestの設定
├── package.json         # 依存関係
├── tsconfig.json        # TypeScript設定
├── docker-compose.test.yml # テスト用Docker Compose
└── README.md            # このファイル
``` 
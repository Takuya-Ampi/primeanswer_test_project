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

3. 開発用データベースを起動
   ```
   docker-compose -f docker-compose.test.yml up -d postgres-local
   ```

4. 環境変数を設定
   ```
   cp .env.example .env
   ```
   `.env`ファイルを編集して適切なデータベースURLを設定

5. データベースマイグレーション
   ```
   npx prisma migrate dev
   ```
   
   以下のようなプロセスが実行されます：
   ```
   Need to install the following packages:
   prisma@6.7.0
   Ok to proceed? (y) y // yを入力してenterを押してください
   Environment variables loaded from .env
   Prisma schema loaded from prisma/schema.prisma
   Datasource "db": PostgreSQL database "development_db", schema "public" at "localhost:5432"
   // 下記が聞かれるので、add_tablesと入力して、enterを押してください
   ? Enter a name for the new migration: › add_tables
   ```
   
   マイグレーション名（例：`add_tables`）を入力すると、データベーススキーマが作成されます。

6. 開発サーバーを起動
   ```
   npm run dev
   ```
   
   サーバーが正常に起動すると、以下のようなメッセージが表示されます：
   ```
   Server is running on http://localhost:3000
   ```
   
   ブラウザで http://localhost:3000/posts にアクセスすると、初期状態では空の配列（`[]`）が表示されます。
   
   サーバーを停止するには、ターミナルで `Ctrl + C` （コントロール + C）を押してください。

### テスト環境

1. テスト用のデータベースを起動
   ```
   docker-compose -f docker-compose.test.yml up -d postgres-test
   ```

2. テスト用の環境変数を設定
   ```
   cp .env.example .env.test
   ```
   `.env.test`ファイルを編集して適切なデータベースURLを設定（ポート5433を使用）

3. テストの実行
   ```
   npm test
   ```

## Docker環境について

### 利用可能なサービス

- **postgres-local** - 開発環境用のデータベース（ポート5432）
- **postgres-test** - テスト環境用のデータベース（ポート5433）

### 開発とテスト両方の環境を起動

```bash
docker-compose -f docker-compose.test.yml up -d
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
├── docker-compose.test.yml # Docker Compose設定
├── .env.example         # 環境変数の例
├── .env                 # 開発環境の環境変数
├── .env.test            # テスト環境の環境変数
└── README.md            # このファイル
``` 
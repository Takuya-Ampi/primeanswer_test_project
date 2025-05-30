# ソフトウェアテスト講義サンプルコード

Express.js + TypeScript + Jestによる実践的テストのサンプルコード

## 使用技術

- **Express.js** - APIサーバー
- **TypeScript** - 型安全性
- **Jest** - テストフレームワーク
- **Prisma** - ORM
- **PostgreSQL** - データベース
- **Docker Compose** - 環境管理
- **Swagger** - API ドキュメント

## セットアップ手順

### 開発環境

1. リポジトリをクローン
   ```
   git clone https://github.com/Takuya-Ampi/primeanswer_test_project.git
   cd primeanswer_test_project
   ```

2. 依存関係をインストール
   ```
   npm install
   ```

3. 環境変数を設定
   ```
   cp .env.example .env
   ```
   `.env`ファイルが開発用の環境変数で設定されます。

4. データベースを起動
   ```
   docker-compose up -d
   ```
   
   **重要**: データベースコンテナが完全に起動するまで数秒待機してください。初回起動時は初期化スクリプトが実行されるため、特に時間がかかる場合があります。
   
   データベースの起動状況は以下のコマンドで確認できます：
   ```
   docker-compose logs postgres
   ```
   
   「database system is ready to accept connections」のメッセージが表示されたら、データベースの準備が完了です。

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

### API ドキュメント (Swagger)

APIの詳細なドキュメントは、Swagger UIで確認できます。サーバー起動後、以下のURLにアクセスしてください：

http://localhost:3000/api-docs

Swagger UI では以下のことができます：
- 全APIエンドポイントの一覧確認
- 各エンドポイントのリクエスト/レスポンスの詳細確認
- APIを直接テスト実行

### テストの実行

テストを実行するには以下のコマンドを使用します：

```
npm run test
```

`npm run test`を実行すると、自動的に以下のことが行われます：
1. `pretest`スクリプトが実行され、データベースが初期化されます（`prisma migrate reset`）
2. 各テストケースが実行されます

これにより毎回クリーンな環境でテストが実行されるため、テスト間の依存性や副作用を心配する必要がありません。

その他のテストコマンド：

```bash
# 監視モードでテストを実行（ファイル変更時に自動再実行）
npm run test:watch

# カバレッジ付きでテストを実行
npm run test:coverage

# CI/CD用のテスト実行
npm run test:ci
```

## 環境変数ファイル

プロジェクトには環境変数のサンプルファイルが含まれています：

- `.env.example` - 開発環境用の設定例

実際に使用する場合は、このファイルをコピーして`.env`として使用します。秘匿情報（シークレットキーなど）は本番環境では必ず変更してください。

## Docker環境について

### 利用可能なサービス

- **postgres** - データベース（ポート5432）

### Docker環境の起動

```bash
docker-compose up -d
```

### Docker環境の停止方法

コンテナの停止（データは保持されます）：
```bash
docker-compose stop
```

コンテナの停止と削除（ボリュームはそのまま残ります）：
```bash
docker-compose down
```

コンテナとボリュームの両方を削除（すべてのデータが失われます）：
```bash
docker-compose down -v
```

## トラブルシューティング

### データベース接続エラーが発生する場合

1. **権限エラー（P1010）が発生する場合**
   
   既存のPostgreSQLボリュームを削除して、新しい権限設定で再作成してください：
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```
   
   データベースが完全に起動するまで30秒程度待機してから、マイグレーションを実行してください。

2. **データベース接続タイムアウトが発生する場合**
   
   データベースコンテナが完全に起動していない可能性があります：
   ```bash
   # ログで起動状況を確認
   docker-compose logs postgres
   
   # コンテナの状態を確認
   docker-compose ps
   ```

3. **既存のデータをリセットしたい場合**
   
   ```bash
   # データベースを完全にリセット
   docker-compose down -v
   docker-compose up -d
   # データベース起動を待機してから
   npx prisma migrate dev
   ```

## プロジェクト構造

```
.
├── docker/              # Docker設定
│   └── init-db.sql      # PostgreSQL初期化スクリプト
├── prisma/              # Prisma設定
├── src/
│   ├── controllers/     # APIコントローラー
│   ├── lib/             # ライブラリ（Prismaなど）
│   ├── routes/          # APIルート
│   ├── services/        # ビジネスロジック
│   ├── test/            # テスト設定
│   ├── __tests__/       # 統合テスト
│   ├── app.ts           # Expressアプリ設定
│   ├── server.ts        # サーバーエントリーポイント
│   └── swagger.ts       # Swagger設定
├── jest.config.js       # Jestの設定
├── package.json         # 依存関係
├── tsconfig.json        # TypeScript設定
├── docker-compose.yml   # Docker Compose設定
├── .env.example         # 環境変数のサンプル
├── .env                 # 開発環境の環境変数
└── README.md            # このファイル
``` 
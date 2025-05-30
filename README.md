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

4. データベースを起動・初期化
   ```
   npm run db:start
   ```
   
   このコマンドを実行すると以下の処理が自動的に行われます：
   - Docker Composeでデータベースコンテナを起動
   - データベースの初期化完了まで自動待機
   - 初期化スクリプト（権限設定など）の実行
   
   正常に完了すると「✅ データベースが利用可能になりました」と表示されます。

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

### 便利なコマンド

プロジェクトには便利なnpmスクリプトが用意されています：

```bash
# 初回セットアップ（依存関係インストール + データベース起動）
npm run setup

# データベースを起動・初期化
npm run db:start

# データベースを停止
npm run db:stop

# データベースを完全にリセット（全データ削除 + 再起動）
npm run db:reset
```

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

### Docker環境の管理

自動化されたスクリプトを使用することを推奨します：

```bash
# データベースを起動・初期化（推奨）
npm run db:start

# データベースを停止
npm run db:stop

# データベースを完全にリセット
npm run db:reset
```

### 手動でのDocker操作

必要に応じて手動でDockerを操作することも可能です：

```bash
# 手動起動
docker-compose up -d

# 手動停止
docker-compose stop
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
   
   データベースを完全にリセットしてください：
   ```bash
   npm run db:reset
   ```
   
   データベースが完全に起動してから、マイグレーションを実行してください：
   ```bash
   npx prisma migrate dev
   ```

2. **データベース接続タイムアウトが発生する場合**
   
   データベースの状態を確認してください：
   ```bash
   # ログで起動状況を確認
   docker-compose logs postgres
   
   # コンテナの状態を確認
   docker-compose ps
   ```
   
   問題が解決しない場合は、データベースを再起動してください：
   ```bash
   npm run db:reset
   ```

3. **npm run db:start が失敗する場合**
   
   Dockerが正常に動作していることを確認してください：
   ```bash
   docker --version
   docker-compose --version
   ```
   
   手動でDockerコンテナを停止してからやり直してください：
   ```bash
   docker-compose down -v
   npm run db:start
   ```

## プロジェクト構造

```
.
├── docker/              # Docker設定
│   └── init-db.sql      # PostgreSQL初期化スクリプト
├── prisma/              # Prisma設定
├── scripts/             # 自動化スクリプト
│   ├── init-db.js       # データベース初期化スクリプト（Node.js）
│   └── init-db.sh       # データベース初期化スクリプト（Bash）
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
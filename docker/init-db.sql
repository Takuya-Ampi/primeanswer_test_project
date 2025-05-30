-- PostgreSQL初期化スクリプト
-- testユーザーにデータベース作成権限を付与

-- testユーザーに権限を付与
ALTER USER test CREATEDB;
ALTER USER test SUPERUSER;

-- development_dbデータベースが存在しない場合は作成
SELECT 'CREATE DATABASE development_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'development_db');

-- testユーザーをdevelopment_dbの所有者に設定
ALTER DATABASE development_db OWNER TO test;

-- publicスキーマの権限を設定
GRANT ALL PRIVILEGES ON SCHEMA public TO test;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO test;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO test;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO test;

-- 将来作成されるオブジェクトに対しても権限を付与
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO test;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO test;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON FUNCTIONS TO test;

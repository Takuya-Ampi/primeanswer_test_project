const { spawn, exec } = require('child_process');
const path = require('path');

console.log('📦 データベースコンテナを起動中...');

// Docker Composeでデータベースを起動
const dockerCompose = spawn('docker-compose', ['up', '-d'], {
  cwd: process.cwd(),
  stdio: 'inherit'
});

dockerCompose.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ Docker Composeの起動に失敗しました');
    process.exit(1);
  }

  console.log('⏳ データベースの初期化を待機中...');
  
  // データベースが利用可能になるまで待機
  let attempts = 0;
  const maxAttempts = 30;
  
  const checkDatabase = () => {
    exec('docker-compose exec -T postgres pg_isready -h localhost -p 5432 -U test', (error) => {
      attempts++;
      
      if (!error) {
        console.log('✅ データベースが利用可能になりました');
        console.log('🔧 データベースの初期化が完了しました');
        console.log('📝 Prismaマイグレーションを実行してください: npx prisma migrate dev');
        process.exit(0);
      } else if (attempts >= maxAttempts) {
        console.error('❌ データベースの起動に失敗しました（タイムアウト）');
        process.exit(1);
      } else {
        console.log(`  待機中... (${attempts}/${maxAttempts})`);
        setTimeout(checkDatabase, 2000);
      }
    });
  };
  
  // 初回チェック
  setTimeout(checkDatabase, 2000);
});

dockerCompose.on('error', (error) => {
  console.error('❌ Docker Composeの実行に失敗しました:', error.message);
  process.exit(1);
});

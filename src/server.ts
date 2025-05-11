import { app } from './app';

const PORT = process.env.PORT
console.log('PORT', PORT)

app.listen(PORT, () => {
  console.log(`サーバーが起動しました: http://localhost:${PORT}`);
}); 
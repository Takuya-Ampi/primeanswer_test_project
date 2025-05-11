import request from 'supertest';
import { app } from '../../app';
import { prisma } from '../../lib/prisma';

// テスト後にデータをクリーンアップ
afterEach(async () => {
  await prisma.post.deleteMany({});
});

describe('POST /posts', () => {
  it('正常に投稿を作成できる', async () => {
    const postData = {
      title: 'テスト投稿',
      content: 'テスト内容です',
    };

    // APIエンドポイントにPOSTリクエストを送信
    const response = await request(app)
      .post('/posts')
      .send(postData)
      .expect(201);

    // レスポンスの検証
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(postData.title);
    expect(response.body.content).toBe(postData.content);

    // DBに保存されていることを確認
    const savedPost = await prisma.post.findUnique({
      where: { id: response.body.id },
    });
    expect(savedPost).not.toBeNull();
    expect(savedPost?.title).toBe(postData.title);
    expect(savedPost?.content).toBe(postData.content);
  });

  it('140文字を超える投稿はエラーを返す', async () => {
    const postData = {
      title: 'テスト投稿',
      content: 'a'.repeat(141),
    };

    // APIエンドポイントにPOSTリクエストを送信
    const response = await request(app)
      .post('/posts')
      .send(postData)
      .expect(400);

    // エラーメッセージを検証
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('投稿内容は140文字以内である必要があります');
  });
}); 
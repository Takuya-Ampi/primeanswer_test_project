import request from 'supertest';
import { app } from '../app';
import { prisma } from '../lib/prisma';

describe('POST /posts API Integration Tests', () => {
  // テスト後にデータをクリーンアップ
  afterEach(async () => {
    await prisma.post.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('新しい投稿を作成できる', async () => {
    const postData = {
      title: '統合テスト投稿',
      content: '統合テストの内容',
    };

    const response = await request(app)
      .post('/posts')
      .send(postData)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(postData.title);
    expect(response.body.content).toBe(postData.content);

    // データベースに正しく保存されていることを確認
    const savedPost = await prisma.post.findUnique({
      where: { id: response.body.id },
    });
    expect(savedPost).not.toBeNull();
    expect(savedPost?.title).toBe(postData.title);
    expect(savedPost?.content).toBe(postData.content);
  });

  it('140文字を超える投稿は400エラー', async () => {
    const longContent = 'a'.repeat(141);
    const response = await request(app)
      .post('/posts')
      .send({
        title: 'テスト投稿',
        content: longContent,
      })
      .expect(400);

    expect(response.body.error).toBe('投稿内容は140文字以内である必要があります');
  });

  it('140文字以内の投稿は正常に作成できる', async () => {
    const exactContent = 'a'.repeat(140);
    const response = await request(app)
      .post('/posts')
      .send({
        title: '140文字ちょうどの投稿',
        content: exactContent,
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.content).toBe(exactContent);
    expect(response.body.content.length).toBe(140);
  });
}); 
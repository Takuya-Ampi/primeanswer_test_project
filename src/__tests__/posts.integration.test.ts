import request from 'supertest';
import { app } from '../app';
import { createPost } from '../services/postService';

describe('Posts API Integration Tests', () => {
  describe('POST /posts', () => {
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
    });

    it('必須フィールドが不足している場合は400エラー', async () => {
      const response = await request(app)
        .post('/posts')
        .send({ title: 'タイトルのみ' })
        .expect(400);

      expect(response.body.error).toBe('必須項目が不足しています');
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
  });

  describe('GET /posts', () => {
    beforeEach(async () => {
      // テスト用データを準備
      await createPost({
        title: '投稿1',
        content: '内容1',
      });
      await createPost({
        title: '投稿2',
        content: '内容2',
      });
    });

    it('全ての投稿を取得できる', async () => {
      const response = await request(app)
        .get('/posts')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0].title).toBeDefined();
      expect(response.body[0].content).toBeDefined();
    });
  });
}); 
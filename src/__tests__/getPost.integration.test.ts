import request from 'supertest';
import { app } from '../app';
import { createPost } from '../services/postService';
import { prisma } from '../lib/prisma';

describe('GET /posts API Integration Tests', () => {
  beforeEach(async () => {
    // テスト前にデータをクリア
    await prisma.post.deleteMany({});
    
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

  afterAll(async () => {
    await prisma.post.deleteMany({});
    await prisma.$disconnect();
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

  it('投稿が新しい順に並んでいる', async () => {
    // 新しい投稿を追加
    await createPost({
      title: '最新の投稿',
      content: '最新の内容',
    });

    const response = await request(app)
      .get('/posts')
      .expect(200);

    expect(response.body.length).toBe(3);
    expect(response.body[0].title).toBe('最新の投稿');
  });

  it('特定のIDの投稿を取得できる', async () => {
    // 特定の投稿を作成
    const createdPost = await createPost({
      title: '特定の投稿',
      content: '特定の内容',
    });

    const response = await request(app)
      .get(`/posts/${createdPost.id}`)
      .expect(200);

    expect(response.body.id).toBe(createdPost.id);
    expect(response.body.title).toBe('特定の投稿');
    expect(response.body.content).toBe('特定の内容');
  });
}); 
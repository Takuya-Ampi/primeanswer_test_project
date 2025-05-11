import { getAllPosts } from '../postService';
import { prisma } from '../../lib/prisma';

describe('getAllPosts', () => {
  // テスト前にシードデータを作成
  beforeAll(async () => {
    // 既存のデータをクリア
    await prisma.post.deleteMany({});

    // テスト用のサンプルデータを作成
    const seedData = [
      {
        title: 'テスト投稿1',
        content: 'これはテスト投稿1の内容です',
        createdAt: new Date('2023-01-01T00:00:00Z')
      },
      {
        title: 'テスト投稿2',
        content: 'これはテスト投稿2の内容です',
        createdAt: new Date('2023-01-02T00:00:00Z')
      },
      {
        title: 'テスト投稿3',
        content: 'これはテスト投稿3の内容です',
        createdAt: new Date('2023-01-03T00:00:00Z')
      }
    ];

    // 一括でデータを作成
    await prisma.post.createMany({
      data: seedData
    });
  });

  // テスト後にデータをクリーンアップ
  afterAll(async () => {
    await prisma.post.deleteMany({});
  });

  it('全ての投稿を新しい順に取得できる', async () => {
    const posts = await getAllPosts();

    // 投稿が3件あることを確認
    expect(posts).toHaveLength(3);

    // 新しい順（createdAtの降順）にソートされていることを確認
    expect(posts[0].title).toBe('テスト投稿3');
    expect(posts[1].title).toBe('テスト投稿2');
    expect(posts[2].title).toBe('テスト投稿1');
  });

  it('各投稿に必要なプロパティが含まれている', async () => {
    const posts = await getAllPosts();
    
    // 各投稿に必要なプロパティが含まれているか確認
    posts.forEach(post => {
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('content');
      expect(post).toHaveProperty('createdAt');
      expect(post).toHaveProperty('updatedAt');
    });
  });

  it('データが空の場合は空配列を返す', async () => {
    // 一時的にデータをクリア
    await prisma.post.deleteMany({});
    
    const posts = await getAllPosts();
    
    // 空配列が返ることを確認
    expect(posts).toEqual([]);
    
    // テスト用データを再作成（他のテストのため）
    await prisma.post.createMany({
      data: [
        {
          title: 'テスト投稿1',
          content: 'これはテスト投稿1の内容です',
          createdAt: new Date('2023-01-01T00:00:00Z')
        },
        {
          title: 'テスト投稿2',
          content: 'これはテスト投稿2の内容です',
          createdAt: new Date('2023-01-02T00:00:00Z')
        },
        {
          title: 'テスト投稿3',
          content: 'これはテスト投稿3の内容です',
          createdAt: new Date('2023-01-03T00:00:00Z')
        }
      ]
    });
  });
}); 
import { createPost } from '../postService';
import { prisma } from '../../lib/prisma';

// テスト後にデータをクリーンアップ
afterEach(async () => {
  await prisma.post.deleteMany({});
});

describe('createPost', () => {
  it('正常に投稿を作成できる', async () => {
    const postData = {
      title: 'テスト投稿',
      content: 'テスト内容です',
    };

    const result = await createPost(postData);

    expect(result).toHaveProperty('id');
    expect(result.title).toBe(postData.title);
    expect(result.content).toBe(postData.content);

    // DBに保存されていることを確認
    const savedPost = await prisma.post.findUnique({
      where: { id: result.id },
    });
    expect(savedPost).not.toBeNull();
    expect(savedPost?.title).toBe(postData.title);
    expect(savedPost?.content).toBe(postData.content);
  });

  it('140文字を超える投稿はエラーを投げる', async () => {
    const postData = {
      title: 'テスト投稿',
      content: 'a'.repeat(141),
    };

    await expect(createPost(postData)).rejects.toThrow(
      '投稿内容は140文字以内である必要があります'
    );
  });
}); 
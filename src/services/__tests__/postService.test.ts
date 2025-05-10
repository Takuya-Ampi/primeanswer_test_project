import { createPost, validatePostLength } from '../postService';
import { prisma } from '../../lib/prisma';

describe('postService', () => {
  describe('validatePostLength', () => {
    it('140文字以内の投稿はtrueを返す', () => {
      const shortContent = 'テスト投稿です';
      expect(validatePostLength(shortContent)).toBe(true);
    });

    it('140文字ちょうどの投稿はtrueを返す', () => {
      const exactContent = 'a'.repeat(140);
      expect(validatePostLength(exactContent)).toBe(true);
    });

    it('141文字以上の投稿はfalseを返す', () => {
      const longContent = 'a'.repeat(141);
      expect(validatePostLength(longContent)).toBe(false);
    });
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
}); 
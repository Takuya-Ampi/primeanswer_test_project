import { validatePostLength } from '../postService';

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
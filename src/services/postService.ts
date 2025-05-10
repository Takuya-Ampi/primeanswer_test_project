import { prisma } from '../lib/prisma';

// 投稿内容の長さをチェックする関数
export const validatePostLength = (content: string): boolean => {
  return content.length <= 140;
};

export const createPost = async (data: { title: string; content: string }) => {
  // 内容の長さをチェック
  if (!validatePostLength(data.content)) {
    throw new Error('投稿内容は140文字以内である必要があります');
  }

  return await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
    },
  })
  .then((post) => post)
  .catch((error) => {
    throw error;
  });
};

export const getAllPosts = async () => {
  return await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  })
  .then((posts) => posts)
  .catch((error) => {
    throw new Error('投稿の取得に失敗しました');
  });
}; 
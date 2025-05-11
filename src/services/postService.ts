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

export const getPostById = async (id: number) => {
  return await prisma.post.findUnique({
    where: { id },
  })
  .then((post) => {
    if (!post) {
      throw new Error('投稿が見つかりませんでした');
    }
    return post;
  })
  .catch((error) => {
    throw error;
  });
};

export const updatePost = async (id: number, data: { title?: string; content?: string }) => {
  // コンテンツが提供されている場合、長さをチェック
  if (data.content && !validatePostLength(data.content)) {
    throw new Error('投稿内容は140文字以内である必要があります');
  }

  return await prisma.post.update({
    where: { id },
    data,
  })
  .then((post) => post)
  .catch((error) => {
    if (error.code === 'P2025') {
      throw new Error('投稿が見つかりませんでした');
    }
    throw error;
  });
};

export const deletePost = async (id: number) => {
  return await prisma.post.delete({
    where: { id },
  })
  .then((post) => post)
  .catch((error) => {
    if (error.code === 'P2025') {
      throw new Error('投稿が見つかりませんでした');
    }
    throw error;
  });
}; 
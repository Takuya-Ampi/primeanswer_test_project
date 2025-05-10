import { Request, Response } from 'express';
import { createPost, getAllPosts } from '../services/postService';

export const createPostHandler = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: '必須項目が不足しています' });
  }
  
  await createPost({ title, content })
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((error) => {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'サーバーエラー' });
      }
    });
};

export const getAllPostsHandler = async (req: Request, res: Response) => {
  await getAllPosts()
    .then((posts) => {
      res.json(posts);
    })
    .catch((error) => {
      res.status(500).json({ error: 'サーバーエラー' });
    });
}; 
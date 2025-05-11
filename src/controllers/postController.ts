import { Request, Response } from 'express';
import { createPost, getAllPosts, getPostById, updatePost, deletePost } from '../services/postService';

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

export const getPostByIdHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({ error: '無効なIDです' });
  }
  
  await getPostById(id)
    .then((post) => {
      res.json(post);
    })
    .catch((error) => {
      if (error instanceof Error && error.message === '投稿が見つかりませんでした') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'サーバーエラー' });
      }
    });
};

export const updatePostHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;
  
  if (isNaN(id)) {
    return res.status(400).json({ error: '無効なIDです' });
  }
  
  if (!title && !content) {
    return res.status(400).json({ error: '更新する項目が指定されていません' });
  }
  
  await updatePost(id, { title, content })
    .then((post) => {
      res.json(post);
    })
    .catch((error) => {
      if (error instanceof Error) {
        if (error.message === '投稿が見つかりませんでした') {
          res.status(404).json({ error: error.message });
        } else {
          res.status(400).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: 'サーバーエラー' });
      }
    });
};

export const deletePostHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({ error: '無効なIDです' });
  }
  
  await deletePost(id)
    .then((post) => {
      res.json({ message: '投稿が削除されました', id: post.id });
    })
    .catch((error) => {
      if (error instanceof Error && error.message === '投稿が見つかりませんでした') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'サーバーエラー' });
      }
    });
}; 
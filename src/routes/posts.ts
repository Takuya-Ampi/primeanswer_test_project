import { Router } from 'express';
import { createPostHandler, getAllPostsHandler } from '../controllers/postController';

const router = Router();

router.post('/', createPostHandler);
router.get('/', getAllPostsHandler);

export { router as postsRouter }; 
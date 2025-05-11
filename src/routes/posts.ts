import { Router } from 'express';
import { 
  createPostHandler, 
  getAllPostsHandler, 
  getPostByIdHandler, 
  updatePostHandler, 
  deletePostHandler 
} from '../controllers/postController';

const router = Router();

router.post('/', createPostHandler);
router.get('/', getAllPostsHandler);
router.get('/:id', getPostByIdHandler);
router.patch('/:id', updatePostHandler);
router.delete('/:id', deletePostHandler);

export { router as postsRouter }; 
import { Router } from 'express';
import { 
  createPostHandler, 
  getAllPostsHandler, 
  getPostByIdHandler, 
  updatePostHandler, 
  deletePostHandler 
} from '../controllers/postController';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         id:
 *           type: integer
 *           description: 投稿のID
 *         title:
 *           type: string
 *           description: 投稿のタイトル
 *         content:
 *           type: string
 *           description: 投稿の内容
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 投稿の作成日時
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 投稿の更新日時
 *       example:
 *         id: 1
 *         title: "最初の投稿"
 *         content: "これは最初の投稿の内容です"
 *         createdAt: "2023-01-01T00:00:00Z"
 *         updatedAt: "2023-01-01T00:00:00Z"
 *   responses:
 *     NotFound:
 *       description: 指定されたリソースが見つかりません
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: 投稿が見つかりませんでした
 */

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: 投稿の管理API
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: すべての投稿を取得
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: 投稿のリスト
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get('/', getAllPostsHandler);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: IDによる投稿の取得
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 投稿のID
 *     responses:
 *       200:
 *         description: 投稿の詳細
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id', getPostByIdHandler);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: 新しい投稿を作成
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: 投稿のタイトル
 *               content:
 *                 type: string
 *                 description: 投稿の内容（140文字以内）
 *             example:
 *               title: "新しい投稿"
 *               content: "これは新しい投稿の内容です"
 *     responses:
 *       201:
 *         description: 作成された投稿
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: バリデーションエラー
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 投稿内容は140文字以内である必要があります
 */
router.post('/', createPostHandler);

/**
 * @swagger
 * /posts/{id}:
 *   patch:
 *     summary: 既存の投稿を更新
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 投稿のID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 投稿の新しいタイトル
 *               content:
 *                 type: string
 *                 description: 投稿の新しい内容（140文字以内）
 *             example:
 *               title: "更新されたタイトル"
 *               content: "更新された内容"
 *     responses:
 *       200:
 *         description: 更新された投稿
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: バリデーションエラー
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 更新する項目が指定されていません
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/:id', updatePostHandler);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: 投稿の削除
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 投稿のID
 *     responses:
 *       200:
 *         description: 削除成功の確認
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 投稿が削除されました
 *                 id:
 *                   type: integer
 *                   example: 1
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:id', deletePostHandler);

export { router as postsRouter }; 
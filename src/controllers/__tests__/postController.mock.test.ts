import { Request, Response } from 'express';
import { createPostHandler } from '../postController';
import * as postService from '../../services/postService';

// postServiceのモジュール全体をモック化
jest.mock('../../services/postService');

describe('postController (with mocks)', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let resJson: jest.Mock;
  let resStatus: jest.Mock;

  beforeEach(() => {
    mockReq = {};
    resJson = jest.fn();
    resStatus = jest.fn().mockReturnValue({ json: resJson });
    mockRes = {
      json: resJson,
      status: resStatus,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPostHandler', () => {
    it('正常に投稿を作成できる', async () => {
      const mockPost = {
        id: 1,
        title: 'モックテスト',
        content: 'モック内容',
        createdAt: new Date(),
      };

      // createPostのモックを設定
      (postService.createPost as jest.Mock).mockResolvedValue(mockPost);

      mockReq.body = {
        title: 'モックテスト',
        content: 'モック内容',
      };

      await createPostHandler(mockReq as Request, mockRes as Response);

      expect(postService.createPost).toHaveBeenCalledWith({
        title: 'モックテスト',
        content: 'モック内容',
      });
      expect(resStatus).toHaveBeenCalledWith(201);
      expect(resJson).toHaveBeenCalledWith(mockPost);
    });

    it('140文字を超える投稿はエラーを返す', async () => {
      // createPostがエラーを投げるようにモック
      (postService.createPost as jest.Mock).mockRejectedValue(
        new Error('投稿内容は140文字以内である必要があります')
      );

      mockReq.body = {
        title: 'テスト投稿',
        content: 'a'.repeat(141),
      };

      await createPostHandler(mockReq as Request, mockRes as Response);

      expect(resStatus).toHaveBeenCalledWith(400);
      expect(resJson).toHaveBeenCalledWith({
        error: '投稿内容は140文字以内である必要があります',
      });
    });
  });
}); 
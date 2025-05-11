import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Posts API',
      version: '1.0.0',
      description: 'Express.js + TypeScript + Jestによるブログ投稿API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: '開発サーバー',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // ルートファイルのパス
};

const specs = swaggerJsdoc(options);

export const swaggerDocs = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
  }),
}; 
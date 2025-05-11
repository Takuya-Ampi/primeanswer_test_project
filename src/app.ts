import express from 'express';
import cors from 'cors';
import { postsRouter } from './routes/posts';
import { swaggerDocs } from './swagger';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/posts', postsRouter);

// Swagger設定
app.use('/api-docs', swaggerDocs.serve, swaggerDocs.setup);

export { app }; 
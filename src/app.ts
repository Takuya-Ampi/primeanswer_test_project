import express from 'express';
import cors from 'cors';
import { postsRouter } from './routes/posts';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/posts', postsRouter);

export { app }; 
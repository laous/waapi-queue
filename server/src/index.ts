import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.route';
import queueRouter from './routes/queue.route';
import actionRouter from './routes/action.route';
import { jwtMiddleware } from './middlewares/auth.middleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const globalRouter = express.Router();
app.use('/api/v1', globalRouter);

globalRouter.use('/queue', jwtMiddleware, queueRouter);
globalRouter.use('/action', jwtMiddleware, actionRouter);
globalRouter.get('/', jwtMiddleware, (req: Request, res: Response) => {
  res.send('Hello, Waapi!');
});

globalRouter.use('/auth', authRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.route';
import queueRouter from './routes/queue.route';
import actionRouter from './routes/action.route';
import { jwtMiddleware } from './middlewares/auth.middleware';
import cron from 'node-cron';
import { executeQueueActions } from './services/queue.service';
import { calcluteUserActionsCreditForAllUsers } from './services/user.service';
import {
  add24HoursExecutionTime,
  add2MinExecutionTime,
  initializeExecutionTime,
} from './services/execution-time.service';

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
globalRouter.get('/', (req: Request, res: Response) => {
  res.send('Hello, Waapi!');
});

globalRouter.use('/auth', authRouter);

cron.schedule('*/2 * * * *', async () => {
  try {
    console.log('Executing actions every 2 minutes');
    await executeQueueActions();
    await add2MinExecutionTime();
  } catch (err) {
    console.log(err);
  }
});

cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Calculate user actions new credit every 24 hours');
    await calcluteUserActionsCreditForAllUsers();
    await add24HoursExecutionTime();
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  await initializeExecutionTime();
});

import { addQueueAction, getQueue } from '../controllers/queue.controller';
import { Router } from 'express';

const queueRouter = Router();

queueRouter.get('/', getQueue);
queueRouter.post('/action/:id', addQueueAction);

export default queueRouter;

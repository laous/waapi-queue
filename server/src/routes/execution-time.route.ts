import { getExecutionTime } from '../controllers/execution-time.controller';
import { Router } from 'express';

const executionTimeRouter = Router();

executionTimeRouter.get('/', getExecutionTime);

export default executionTimeRouter;

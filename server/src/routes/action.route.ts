import { findAll, create } from '../controllers/action.controller';
import { Router } from 'express';

const actionRouter = Router();

actionRouter.get('/', findAll);
actionRouter.post('/', create);

export default actionRouter;

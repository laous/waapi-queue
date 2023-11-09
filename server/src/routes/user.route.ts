import { getUser } from '../controllers/user.service';
import { Router } from 'express';

const userRouter = Router();

userRouter.get('/', getUser);

export default userRouter;

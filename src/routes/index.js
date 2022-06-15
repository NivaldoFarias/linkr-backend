import { Router } from 'express';
import usersRoute from './usersRoute.js';
import hashtagsRoute from './hashtagsRoute.js';
import authRouter from './authRouter.js';

const routes = Router();
routes.use('/hashtags', hashtagsRoute);
routes.use('/users', usersRoute);
routes.use('/auth', authRouter);

export default routes;

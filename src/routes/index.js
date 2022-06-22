import { Router } from 'express';
import usersRoute from './usersRoute.js';
import hashtagsRoute from './hashtagsRoute.js';
import authRouter from './authRouter.js';
import postRouter from './postRouter.js';
import timelineRouter from './timelineRouter.js';
import shareRouter from './shareRouter.js';

const routes = Router();
routes.use('/hashtags', hashtagsRoute);
routes.use('/users', usersRoute);
routes.use('/auth', authRouter);
routes.use('/posts', postRouter);
routes.use('/timeline', timelineRouter);
routes.use('/shares', shareRouter);

export default routes;

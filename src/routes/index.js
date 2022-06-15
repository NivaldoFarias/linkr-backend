import { Router } from 'express';
import usersRoute from './usersRoute.js';
import hashtagsRoute from './hashtagsRoute.js';

const routes = Router();
routes.use('/hashtags', hashtagsRoute);
routes.use('/users', usersRoute);

export default routes;

import { Router } from 'express';
import logThis from '../blueprints/logThis.js';
import { getTimelinePosts, checkTimelinePosts } from '../controllers/timelineController.js';
import { validateUserId } from '../middlewares/authMiddleware.js';
import { checkGetPostsQuery, checkCheckPostsQuery } from '../middlewares/postMiddleware.js';
import requireToken from '../middlewares/requireToken.js';


const timelineRouter = Router();

timelineRouter.get('/posts', logThis('Get user timeline'), requireToken, validateUserId, checkGetPostsQuery, getTimelinePosts);
timelineRouter.get('/posts/check', logThis('Check timeline'), requireToken, validateUserId, checkCheckPostsQuery, checkTimelinePosts);

export default timelineRouter;

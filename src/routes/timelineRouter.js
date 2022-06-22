import { Router } from 'express';
import logThis from '../blueprints/logThis.js';
import { getTimelinePosts, getTimelinePosts2 } from '../controllers/timelineController.js';
import { validateUserId } from '../middlewares/authMiddleware.js';
import { checkGetPostsQuery } from '../middlewares/postMiddleware.js';
import requireToken from '../middlewares/requireToken.js';


const timelineRouter = Router();

timelineRouter.get('/posts', logThis('Get user timeline'), requireToken, validateUserId, checkGetPostsQuery, getTimelinePosts2);

export default timelineRouter;

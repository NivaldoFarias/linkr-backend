import { Router } from 'express';
import logThis from '../blueprints/logThis.js';
import { getTimelinePosts } from '../controllers/timelineController.js';
import requireToken from '../middlewares/requireToken.js';


const timelineRouter = Router();

timelineRouter.get('/posts', logThis('Get user timeline'), requireToken, getTimelinePosts);

export default timelineRouter;

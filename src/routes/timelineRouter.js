import { Router } from 'express';
import { getTimelinePosts } from '../controllers/timelineController.js';
import requireToken from '../middlewares/requireToken.js';

const timelineRouter = Router();

timelineRouter.get('/', requireToken, getTimelinePosts);

export default timelineRouter;

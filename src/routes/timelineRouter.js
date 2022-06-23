import { Router } from 'express';
import logThis from '../blueprints/logThis.js';
import requireToken from '../middlewares/requireToken.js';
import { validateUserId } from '../middlewares/usersMiddleware.js';
import { checkGetSharesQuery, checkCheckSharesQuery } from '../middlewares/sharesMiddleware.js';
import { getTimelineData, checkTimelineShares } from '../controllers/feedSharesController.js';

const timelineRouter = Router();

timelineRouter.get(
  '/posts',
  logThis('Get user timeline'),
  requireToken,
  validateUserId,
  checkGetSharesQuery,
  getTimelineData,
);
timelineRouter.get(
  '/posts/check',
  logThis('Check timeline'),
  requireToken,
  validateUserId,
  checkCheckSharesQuery,
  checkTimelineShares,
);

export default timelineRouter;

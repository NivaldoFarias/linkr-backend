import { Router } from 'express';
import logThis from '../blueprints/logThis.js';

import requireToken from '../middlewares/requireToken.js';
import { getUser, usersByUserName } from '../controllers/usersController.js';
import { validateUserId, validateVisitedUserId } from '../middlewares/usersMiddleware.js';
import { checkGetSharesQuery, checkCheckSharesQuery } from '../middlewares/sharesMiddleware.js';
import { getUserData, checkUserShares } from '../controllers/feedSharesController.js';


const usersRoute = Router();

usersRoute.route('/').get(logThis('Get user'), requireToken, getUser);
usersRoute.route('/username/:username').get(logThis('Find users'), requireToken, usersByUserName);

usersRoute.get('/:userId/posts', logThis('Get user shares'), requireToken, validateUserId, validateVisitedUserId, checkGetSharesQuery, getUserData);
usersRoute.get('/:userId/check', logThis('Check user feed'), requireToken, validateUserId, validateVisitedUserId, checkCheckSharesQuery, checkUserShares);
export default usersRoute;

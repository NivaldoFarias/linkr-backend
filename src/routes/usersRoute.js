import { Router } from 'express';
import logThis from '../blueprints/logThis.js';
import { usersByUserName, usersPosts, getUser } from '../controllers/usersControllers.js';
import requireToken from '../middlewares/requireToken.js';

const usersRoute = Router();


usersRoute.route('/').get(logThis('Get user'), requireToken, getUser);
usersRoute.route('/username/:username').get(logThis('Find users'), requireToken, usersByUserName);
usersRoute.route('/:userId/posts').get(logThis('Get user posts'), requireToken, usersPosts);

export default usersRoute;

import { Router } from 'express';
import logThis from '../blueprints/logThis.js';
import { usersByUserName, usersPosts, getUser,  followUser } from '../controllers/usersControllers.js';
import requireToken from '../middlewares/requireToken.js';
import { verifyIfUserIsFollowed } from '../middlewares/userMiddleware.js';

const usersRoute = Router();


usersRoute.route('/').get(logThis('Get user'), requireToken, getUser);
usersRoute.route('/username/:username').get(logThis('Find users'), requireToken, usersByUserName);
usersRoute.route('/:userId/posts').get(logThis('Get user posts'), requireToken, usersPosts);
//usersRoute.route('/follow/:followed_id').get(logThis('Verify if this user is followed'), requireToken, verifyIfUserIsFollowed);
usersRoute.route('/follow/:followed_id').post(logThis('Follow or unfollow this user'), requireToken, verifyIfUserIsFollowed, followUser);

export default usersRoute;
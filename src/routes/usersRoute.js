import { Router } from 'express';
import logThis from '../blueprints/logThis.js';
import {
  usersByUserName,
  usersPosts,
  getUser,
  followUser,
  unfollowUser,
} from '../controllers/usersControllers.js';
import requireToken from '../middlewares/requireToken.js';
import { verifyIfUserIsFollowed } from '../middlewares/userMiddleware.js';

const usersRoute = Router();

usersRoute.route('/').get(logThis('Get user'), requireToken, getUser);
usersRoute.route('/username/:username').get(logThis('Find users'), requireToken, usersByUserName);
usersRoute.route('/:userId/posts').get(logThis('Get user posts'), requireToken, usersPosts);

usersRoute
  .route('/:followed_id/follow')
  .post(logThis('Follow this user'), requireToken, verifyIfUserIsFollowed, followUser);
usersRoute
  .route('/:followed_id/unfollow')
  .post(logThis('UnFollow this user'), requireToken, verifyIfUserIsFollowed, unfollowUser);

export default usersRoute;

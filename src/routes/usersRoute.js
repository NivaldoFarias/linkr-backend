import { Router } from 'express';
import { usersByUserName, usersPosts } from '../controllers/usersControllers.js';

const usersRoute = Router();

usersRoute.route('/username/:username').get(usersByUserName);
usersRoute.route('/:userId/posts').get(usersPosts);

export default usersRoute;

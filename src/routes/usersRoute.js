import { Router } from 'express';
import { usersByUserName, usersPosts } from '../controllers/usersControllers.js';
import requireToken from '../middlewares/requireToken.js';

const usersRoute = Router();

usersRoute.route('/username/:username').get(requireToken, usersByUserName);
usersRoute.route('/:userId/posts').get(requireToken, usersPosts);

export default usersRoute;

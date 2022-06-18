import { Router } from 'express';
import { usersByUserName, usersPosts, getUser } from '../controllers/usersControllers.js';
import requireToken from '../middlewares/requireToken.js';

const usersRoute = Router();


usersRoute.route('/').get(requireToken, getUser);
usersRoute.route('/username/:username').get(requireToken, usersByUserName);
usersRoute.route('/:userId/posts').get(requireToken, usersPosts);

export default usersRoute;

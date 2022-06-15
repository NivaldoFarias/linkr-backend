import { Router } from 'express';
import { usersByUserName, retrievePosts } from '../controllers/usersControllers.js';

const usersRoute = Router();

usersRoute.route('/username/:username').get(usersByUserName);

usersRoute.route('/:userId/posts').get(retrievePosts);

export default usersRoute;

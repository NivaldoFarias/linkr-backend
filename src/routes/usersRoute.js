import { Router } from 'express';
import { usersByUserName } from '../controllers/usersControllers.js';

const usersRoute = Router();

usersRoute
    .route('/users/username/:username')
    .get(usersByUserName);

export default usersRoute;
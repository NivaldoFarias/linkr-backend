import { Router } from 'express';
import usersRoute from './usersRoute.js';

const routes = Router();

routes.use(usersRoute);

export default routes;
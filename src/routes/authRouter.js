import { Router } from 'express';
import logThis from '../blueprints/logThis.js';


import { signUp, signIn } from './../controllers/authController.js';
import {
  validateSignUp,
  validateSignIn,
  usernameIsUnique,
  findUser,
  validatePassword,
} from './../middlewares/authMiddleware.js';

const authRouter = Router();

authRouter.post('/sign-up', logThis('Signin up'), validateSignUp, usernameIsUnique, signUp);
authRouter.post('/sign-in', logThis('Signin in'), validateSignIn, findUser, validatePassword, signIn);

export default authRouter;

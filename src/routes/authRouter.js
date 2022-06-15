import { Router } from 'express';

import { signUp, signIn } from './../controllers/authController.js';
import {
  validateSignUp,
  validateSignIn,
  usernameIsUnique,
  findUser,
  validatePassword,
} from './../middlewares/authMiddleware.js';

const authRouter = Router();

authRouter.post('/sign-up', validateSignUp, usernameIsUnique, signUp);
authRouter.post('/sign-in', validateSignIn, findUser, validatePassword, signIn);

export default authRouter;

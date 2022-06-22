import { Router } from 'express';
import logThis from '../blueprints/logThis.js';

import { validateSignUp, validateSignIn, usernameIsUnique, validatePassword } from '../middlewares/authMiddleware.js';
import { signIn, signUp } from '../controllers/authController.js';
import { findUser } from '../middlewares/usersMiddleware.js';

const authRouter = Router();

authRouter.post('/sign-up', logThis('Signin up'), validateSignUp, usernameIsUnique, signUp);
authRouter.post(
  '/sign-in',
  logThis('Signin in'),
  validateSignIn,
  findUser,
  validatePassword,
  signIn,
);

export default authRouter;

import { stripHtml } from 'string-strip-html';
import SqlString from 'sqlstring';
import urlExist from 'url-exist';
import bcrypt from 'bcrypt';
import chalk from 'chalk';

import CustomError from '../util/CustomError.js';
import { MIDDLEWARE } from '../blueprints/chalk.js';
import { SignInSchema, SignUpSchema } from '../models/authModel.js';
import { userRepository } from '../repositories/users.js';

async function validateSignUp(req, res, next) {
  const { password, imageUrl } = req.body;
  const username = stripHtml(req.body.username).result.trim();
  const email = stripHtml(req.body.email).result.trim();

  const urlExists = await urlExist(imageUrl);

  const validate = SignUpSchema.validate(
    {
      username,
      password,
      email,
      imageUrl,
    },
    { abortEarly: false },
  );
  if (validate.error || !urlExists) {
    throw new CustomError(
      422,
      `Invalid input`,
      validate.error.details.map((e) => e.message).join(', '),
    );
  }
  res.locals.username = username;
  res.locals.email = email;
  res.locals.password = password;
  res.locals.imageUrl = imageUrl;
  console.log(chalk.magenta(`${MIDDLEWARE} Valid sign up input`));
  next();
}

async function validateSignIn(req, res, next) {
  const password = req.body.password;
  const username = stripHtml(req.body.username).result.trim();

  const validate = SignInSchema.validate({ username, password }, { abortEarly: false });

  if (validate.error) {
    throw new CustomError(
      422,
      'Invalid input',
      validate.error.details.map((e) => e.message).join(', '),
    );
  }

  res.locals.username = username;
  res.locals.password = password;
  console.log(chalk.magenta(`${MIDDLEWARE} Valid sign in input`));
  next();
}

async function usernameIsUnique(_req, res, next) {
  const { username } = res.locals;

  const user = await userRepository.getUserByUsername(username);

  if (user) {
    throw new CustomError(
      409,
      `Username already registered`,
      'Ensure to provide an username that is not already registered',
    );
  }

  console.log(chalk.magenta(`${MIDDLEWARE} Username is unique`));
  next();
}

async function validatePassword(req, res, next) {
  const password = req.body.password;
  const { user } = res.locals;

  if (!bcrypt.compareSync(password, user.password)) {
    throw new CustomError(401, `Invalid password`, 'Ensure to provide a valid password');
  }

  console.log(chalk.magenta(`${MIDDLEWARE} Valid password`));
  next();
}

export { validateSignUp, validateSignIn, usernameIsUnique, validatePassword };

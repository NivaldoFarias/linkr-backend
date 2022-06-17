import { stripHtml } from 'string-strip-html';
import SqlString from 'sqlstring';
import urlExist from 'url-exist';
import bcrypt from 'bcrypt';
import chalk from 'chalk';

import CustomError from '../util/CustomError.js';
import { MIDDLEWARE } from '../blueprints/chalk.js';
import { SignInSchema, SignUpSchema } from '../models/authModel.js';
import db from '../database/index.js';
import { userRepository } from '../repositories/users.js';

async function validateSignUp(req, res, next) {
  try {
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
  } catch (e) {
    next(e);
  }
}

async function validateSignIn(req, res, next) {
  try {
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
  } catch (e) {
    next(e);
  }
}

async function usernameIsUnique(_req, res, next) {
  try {
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
  } catch (e) {
    next(e);
  }
}

async function findUser(req, res, next) {
  try {
    const username = stripHtml(req.body.username).result.trim();

    const user = await userRepository.getUserByUsername(username);

    if (!user) {
      throw new CustomError(
        404,
        'User not found',
        'Ensure to provide a valid username corresponding to a registered user',
      );
    }

    res.locals.user = user;
    console.log(chalk.magenta(`${MIDDLEWARE} User found`));
    next();
  } catch (e) {
    next(e);
  }
}

async function validateUserId(req, res, next) {
  try {
    const { userId } = res.locals;

    const user = await userRepository.getUserById(userId);

    if (!user) {
      throw new CustomError(
        404,
        'User not found',
        'Ensure to provide a valid username corresponding to a registered user',
      );
    }

    res.locals.user = user;
    console.log(res.locals);
    console.log(chalk.magenta(`${MIDDLEWARE} User found`));
    next();
  } catch (e) {
    next(e);
  }
}

async function validatePassword(req, res, next) {
  try {
    const password = req.body.password;
    const { user } = res.locals;

    if (!bcrypt.compareSync(password, user.password)) {
      throw new CustomError(401, `Invalid password`, 'Ensure to provide a valid password');
    }

    console.log(chalk.magenta(`${MIDDLEWARE} Valid password`));
    next();
  } catch (e) {
    next(e);
  }
}

export { validateSignUp, validateSignIn, usernameIsUnique, findUser, validatePassword, validateUserId };

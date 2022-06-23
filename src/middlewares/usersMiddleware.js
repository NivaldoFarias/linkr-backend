import chalk from 'chalk';
import { API, MIDDLEWARE } from '../blueprints/chalk.js';
import { stripHtml } from 'string-strip-html';
import { userRepository } from '../repositories/users.js';

export async function findUser(req, res, next) {
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

export async function validateUserId(req, res, next) {
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
    console.log(chalk.magenta(`${MIDDLEWARE} User found`));
    next();
  } catch (e) {
    next(e);
  }
}

export async function validateVisitedUserId(req, res, next) {
  try {
    const visitedUserId = req.params.userId;
    const visitedUser = await userRepository.getUserById(visitedUserId);
    if (!visitedUser) {
      throw new CustomError(
        404,
        'User not found',
        'Ensure to provide a valid username corresponding to a registered user',
      );
    }
    res.locals.visitedUserId = visitedUserId;
    console.log(chalk.magenta(`${MIDDLEWARE} Visited user found`));
    next();
  } catch (e) {
    next(e);
  }
}

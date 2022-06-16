import jwt from 'jsonwebtoken';
import chalk from 'chalk';

import CustomError from './../util/CustomError.js';
import { MIDDLEWARE } from './../blueprints/chalk.js';

async function requireToken(req, res, next) {
  try {
    const authorization = req.header('authorization') ?? '';
    const token = authorization.replace('Bearer ', '').trim() ?? null;
    const secretKey = process.env.JWT_SECRET ?? 'JWT_SECRET';
    const { sub, userId } = jwt.verify(token, secretKey);
    res.locals.subject = sub;
    res.locals.userId = userId;
    console.log(chalk.bold.magenta(`${MIDDLEWARE} Valid token`));
    return next();
  } catch (_error) {
    const e = new CustomError(401, `Invalid token`, 'Ensure to provide a valid token');
    next(e);
  }
}

export default requireToken;

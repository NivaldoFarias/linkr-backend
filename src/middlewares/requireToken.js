import jwt from 'jsonwebtoken';
import chalk from 'chalk';

import CustomError from './../util/CustomError.js';
import { MIDDLEWARE } from './../blueprints/chalk.js';

async function requireToken(req, res, next) {
  const authorization = req.header('authorization') ?? '';
  const token = authorization.replace('Bearer ', '').trim() ?? null;
  const secretKey = process.env.JWT_SECRET ?? 'JWT_SECRET';

  try {
    const { sub } = jwt.verify(token, secretKey);
    res.locals.subject = sub;
  } catch (_error) {
    throw new CustomError(401, `Invalid token`, 'Ensure to provide a valid token');
  }
  console.log(chalk.bold.magenta(`${MIDDLEWARE} Valid token`));
  return next();
}

export default requireToken;

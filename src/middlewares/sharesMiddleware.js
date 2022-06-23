import { MIDDLEWARE } from '../blueprints/chalk.js';
import chalk from 'chalk';
import { sharesRepository } from '../repositories/shares.js';

export async function checkIfUserHasSharedPost(req, res, next) {
  const { userId, postId } = res.locals;
  try {
    const shareId = await sharesRepository.findShareId(userId, postId);
    res.locals.shareId = shareId;
    console.log(
      chalk.magenta(`${MIDDLEWARE} user has ${shareId ? '' : 'not '}already shared post`),
    );
    next();
  } catch (e) {
    next(e);
  }
}

export function checkGetSharesQuery(req, res, next) {
  const { beforeDate, afterDate, limit } = req.query;

  res.locals.beforeDate = formatDateString(validateDate(beforeDate));
  res.locals.afterDate = formatDateString(validateDate(afterDate));
  res.locals.limit = limit && limit.match(/^\d+$/) ? limit : 10;

  console.log(chalk.magenta(`${MIDDLEWARE} query validated`));
  next();
}

export function checkCheckSharesQuery(req, res, next) {
  const { beforeDate, afterDate } = req.query;

  res.locals.beforeDate = formatDateString(validateDate(beforeDate));
  res.locals.afterDate = formatDateString(validateDate(afterDate));

  if (res.locals.beforeDate || res.locals.afterDate) {
    console.log(chalk.magenta(`${MIDDLEWARE} query validated`));
    next();
  } else {
    console.log(chalk.magenta(`${MIDDLEWARE} query not validated`));
    res.sendStatus(400);
  }
}

function validateDate(date) {
  if (date && date.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)) {
    return date;
  }
  return null;
}

function formatDateString(inputString) {
  if (inputString) {
    const date = new Date(inputString);
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    const outputString = offsetDate.toISOString();
    return outputString;
  }
  return null;
}

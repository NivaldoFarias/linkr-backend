import { MIDDLEWARE, API } from '../blueprints/chalk.js';
import chalk from 'chalk';
import { sharesRepository } from '../repositories/shares.js';

export async function unsharePost(_req, res) {
  const { shareId, userId, postCreatorId } = res.locals;
  console.log(userId, shareId, postCreatorId);

  if (!shareId) {
    console.log(chalk.magenta(`${API} not unsharing`));
    return res.sendStatus(404);
  } else if (userId === postCreatorId) {
    console.log(chalk.magenta(`${API} not unsharing`));
    return res.sendStatus(403);
  }

  await sharesRepository.deleteShare(shareId);
  console.log(chalk.magenta(`${API} post unshared`));
  return res.sendStatus(200);
}

export async function sharePost(_req, res) {
  const { userId, postId, shareId } = res.locals;
  if (shareId) {
    console.log(chalk.magenta(`${API} not sharing again`));
    return res.sendStatus(409);
  }

  await sharesRepository.insertShare(userId, postId);
  console.log(chalk.magenta(`${API} post shared`));
  return res.sendStatus(201);
}

export async function shareNewPost(_req, res, next) {
  const { userId, postId, shareId } = res.locals;
  if (shareId) {
    console.log(chalk.magenta(`${API} share already exists`));
    return res.sendStatus(409);
  }

  await sharesRepository.insertShare(userId, postId);
  console.log(chalk.magenta(`${API} new post shared`));
  return next();
}

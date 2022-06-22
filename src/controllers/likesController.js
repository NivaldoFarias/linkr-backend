import chalk from 'chalk';
import { MIDDLEWARE } from '../blueprints/chalk.js';
import { likesRepository } from '../repositories/likes.js';

export async function likePost(_req, res) {
  const { userId, postId, userHasLikedPost } = res.locals;
  if (!userHasLikedPost) {
    try {
      await likesRepository.likePost(userId, postId);
      console.log(chalk.magenta(`${MIDDLEWARE} user liked post`));
      res.sendStatus(201);
    } catch (e) {
      res.sendStatus(500);
    }
  } else {
    console.log(chalk.magenta(`${MIDDLEWARE} nothing happened`));
    res.sendStatus(200);
  }
}

export async function unlikePost(_req, res) {
  const { userId, postId, userHasLikedPost } = res.locals;
  if (userHasLikedPost) {
    try {
      await likesRepository.unlikePost(userId, postId);
      console.log(chalk.magenta(`${MIDDLEWARE} user unliked post`));
      res.sendStatus(200);
    } catch (e) {
      res.sendStatus(500);
    }
  } else {
    console.log(chalk.magenta(`nothing happened`));
    res.sendStatus(200);
  }
}
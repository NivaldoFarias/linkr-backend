import chalk from 'chalk';
import { MIDDLEWARE } from '../blueprints/chalk.js';
import { commentsRepository } from '../repositories/comments.js';

export async function createNewComment(req, res) {
  const { userId, postId, text } = res.locals;

  try {
    await commentsRepository.createNewComment(userId, postId, text);
    console.log(chalk.magenta(`${MIDDLEWARE} comment created`));
    res.sendStatus(201);
  } catch (error) {
    console.log(chalk.red(`${MIDDLEWARE} something went wrong creating comment`));
    res.sendStatus(500);
  }
}

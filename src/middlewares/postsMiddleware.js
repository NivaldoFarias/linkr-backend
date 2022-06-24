import { MIDDLEWARE } from '../blueprints/chalk.js';
import chalk from 'chalk';

import sanitizeHtml from 'sanitize-html';
import { postsRepository } from '../repositories/posts.js';
import { sharesRepository } from '../repositories/shares.js';

export async function createPost(req, res, next) {
  const { userId, url } = res.locals;
  const urlId = url.id;
  const { text } = req.body;

  const post = await postsRepository.insertPost(text, urlId, userId);
  res.locals.postId = post.id;
  console.log(chalk.magenta(`${MIDDLEWARE} post created. postId: `, post.id));

  const share = await sharesRepository.insertShare(userId, post.id);
  res.locals.shareId = share.id;
  console.log(chalk.magenta(`${MIDDLEWARE} post shared`));

  return next();
}

export async function validatePostId(req, res, next) {
  const { postId } = req.params;
  const post = await postsRepository.findPostById(postId);
  if (!post) {
    console.log(chalk.magenta(`${MIDDLEWARE} post not found`));
    return res.sendStatus(404);
  }

  res.locals.postCreatorId = post.user_id;
  res.locals.postId = postId;
  console.log(chalk.magenta(`${MIDDLEWARE} post found`));
  return next();
}

export async function validatePostText(req, res, next) {
  const { text } = req.body;
  if (!text) {
    console.log(chalk.magenta(`${MIDDLEWARE} text not validated`));
    return res.sendStatus(400);
  }
  res.locals.text = sanitizeHtml(text);
  console.log(chalk.magenta(`${MIDDLEWARE} text validated`));
  return next();
}

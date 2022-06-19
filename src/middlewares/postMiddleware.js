import { postsRepository } from '../repositories/posts.js';
import { MIDDLEWARE } from '../blueprints/chalk.js';
import chalk from 'chalk';
import { urlsRepository } from '../repositories/urls.js';
import urlMetadata from 'url-metadata';

export async function findUrl(req, res, next) {
  try {
    const url = await urlsRepository.findUrl(req.body.url);
    res.locals.url = url;
    console.log(chalk.magenta(`${MIDDLEWARE} url ${url ? '' : 'not '}found`));
    next();
  } catch (e) {
    next(e);
  }
}

export async function createUrl(req, res, next) {
  if (res.locals.url) {
    console.log(chalk.magenta(`${MIDDLEWARE} not creating url`));
    next();
    return;
  } else {
    console.log(chalk.magenta(`creating url...`));
    const url = { url: req.body.url, title: '', description: '', imageUrl: '' };
    try {
      const promise = await urlMetadata(url.url).then((metadata) => {
        url.title = metadata.title;
        url.description = metadata.description;
        url.imageUrl = metadata.image;
      });
      const newUrl = await urlsRepository.createUrl(
        url.url,
        url.title,
        url.description,
        url.imageUrl,
      );
      res.locals.url = newUrl;
      console.log(chalk.magenta(`${MIDDLEWARE} url created`));
      next();
    } catch (e) {
      next(e);
    }
  }
}

export async function createPost(req, res, next) {
  console.log(res.locals);
  const { userId, url } = res.locals;
  const urlId = url.id;
  const { text } = req.body;
  try {
    console.log('creating post...', userId, urlId, text);
    const post = await postsRepository.insertPost(text, urlId, userId);
    res.locals.postId = post.id;
    console.log(chalk.magenta(`${MIDDLEWARE} post created. postId: `, post.id));
    next();
  } catch (e) {
    next(e);
  }
}

export async function validatePostId(req, res, next) {
  const { postId } = req.params;
  try {
    const post = await postsRepository.findPostById(postId);
    if (post) {
      res.locals.postId = postId;
      console.log(chalk.magenta(`${MIDDLEWARE} post found`));
      next();
    } else {
      console.log(chalk.magenta(`${MIDDLEWARE} post not found`));
      res.sendStatus(404);
    }
  } catch (e) {
    next(e);
  }
}

export async function checkIfUserHasLikedPost(req, res, next) {
  const { userId } = res.locals;
  const { postId } = req.params;
  try {
    const userHasLikedPost = await postsRepository.userIdHasLikedPost(userId, postId);
    res.locals.userHasLikedPost = userHasLikedPost;
    console.log(
      chalk.magenta(`${MIDDLEWARE} user has ${userHasLikedPost ? '' : 'not '}already liked post`),
    );
    next();
  } catch (e) {
    next(e);
  }
}

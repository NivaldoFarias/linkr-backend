import { MIDDLEWARE } from '../blueprints/chalk.js';
import chalk from 'chalk';
import { likesRepository } from '../repositories/likes.js';

export async function checkIfUserHasLikedPost(req, res, next) {
  const { userId } = res.locals;
  const { postId } = req.params;
  try {
    const userHasLikedPost = await likesRepository.userIdHasLikedPost(userId, postId);
    res.locals.userHasLikedPost = userHasLikedPost;
    console.log(
      chalk.magenta(`${MIDDLEWARE} user has ${userHasLikedPost ? '' : 'not '}already liked post`),
    );
    next();
  } catch (e) {
    next(e);
  }
}

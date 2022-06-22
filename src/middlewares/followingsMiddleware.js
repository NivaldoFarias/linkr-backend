import chalk from 'chalk';
import { MIDDLEWARE } from '../blueprints/chalk.js';
import { followingsRepository } from '../repositories/followings.js';

export async function verifyIfUserIsFollowed(req, res, next) {
  const { followed_id } = req.params;
  const { userId } = res.locals;
  let isFollowed = false;

  try {
    const followed = await followingsRepository.getFollowing(followed_id, userId);
    if (followed !== null) {
      isFollowed = true;
    }
    res.locals.isFollowed = isFollowed;
    console.log(chalk.magenta(`${MIDDLEWARE} isFollowed: ${isFollowed}`));
    next();
  } catch (e) {
    next(e);
  }

  res.locals.isFollowed = isFollowed;
  next();
}
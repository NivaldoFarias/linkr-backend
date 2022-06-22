import chalk from 'chalk';
import { MIDDLEWARE, API } from '../blueprints/chalk.js';
import { followingsRepository } from '../repositories/followings.js';



export async function followUser(req, res, next) {
  const { followed_id } = req.params;
  const { userId, isFollowed } = res.locals;

  if (isFollowed === true) {
    console.log(chalk.magenta(`${API} cannot follow user`));
    return res.sendStatus(401);
  }

  try {
    await followingsRepository.followUserById(followed_id, userId, isFollowed);
    console.log(chalk.magenta(`${API} followed user`));
    res.status(200).json({ isFollowed: !isFollowed });
  } catch (e) {
    next(e);
  }
}

export async function unfollowUser(req, res, next) {
  const { followed_id } = req.params;
  const { userId, isFollowed } = res.locals;

  if (followed_id === userId || !isFollowed) {
    console.log(chalk.magenta(`${API} cannot unfollow user`));
    return res.sendStatus(401)
  }

  try {
    await followingsRepository.unfollowUserById(followed_id, userId);
    console.log(chalk.magenta(`${API} unfollowed user`));
    res.status(200).json({ isFollowed: !isFollowed });
  } catch (e) {
    next(e);
  }
}


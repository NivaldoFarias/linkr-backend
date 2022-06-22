import chalk from 'chalk';
import { MIDDLEWARE, API } from '../blueprints/chalk.js';
import { followingsRepository } from '../repositories/followings.js';



export async function followUser(req, res) {
  const { followed_id } = req.params;
  const { userId, isFollowed } = res.locals;

  if (isFollowed === true) {
    console.log(chalk.magenta(`${API} cannot follow user`));
    return res.sendStatus(401);
  } else {
    await followingsRepository.followUserById(followed_id, userId, isFollowed);
    console.log(chalk.magenta(`${API} followed user`));
    res.status(200).send({ isFollowed: !isFollowed });
  }
}

export async function unfollowUser(req, res) {
  const { followed_id } = req.params;
  const { userId, isFollowed } = res.locals;

  if (followed_id === userId || !isFollowed) {
    console.log(chalk.magenta(`${API} cannot unfollow user`));
    return res.sendStatus(401)
  }
  else {
    await followingsRepository.unfollowUserById(followed_id, userId);
    console.log(chalk.magenta(`${API} unfollowed user`));
    return res.status(200).send({ isFollowed: !isFollowed });
  }
}


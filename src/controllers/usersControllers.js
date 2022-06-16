import { userRepository } from '../repositories/users.js';
import { postsRepository } from '../repositories/posts.js';

export const usersByUserName = async (req, res, next) => {
  try {
    const { username } = req.params;
    const users = await userRepository.getUsersByUserName(username);
    res.status(200).json({ users });
  } catch (e) {
    next(e);
  }
};

export const usersPosts = async (req, res, next) => {
  try {
    const { userId: id } = req.params;
    const [user, posts] = await Promise.all([
      userRepository.getUserById(id), 
      postsRepository.getPostsByUserId(id),
    ]);
    res.status(200).json({ ...user, posts });
  } catch (e) {
    next(e);
  }
};

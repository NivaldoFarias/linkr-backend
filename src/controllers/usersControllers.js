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
    const id = req.params.userId;
    const [user, posts] = await Promise.all([
      userRepository.getUserById(id),
      postsRepository.getPostsByUserId(id),
    ]);

    for (const post of posts) {
      const likes = await postsRepository.getPostLikes(post.id);
      post.totalLikes = likes.length;
      post.usersWhoLiked =
        likes.length > 0 ? likes.slice(0, likes.length > 2 ? 2 : likes.length) : [];
      post.userHasLiked = false;
      for (const like of likes) {
        if (like.userId === res.locals.userId) {
          post.userHasLiked = true;
        }
      }
    }

    res.status(200).json({ ...user, posts });
  } catch (e) {
    next(e);
  }
};

export async function getUser(req, res, next) {
  try {
    const { userId } = res.locals;
    const user = await userRepository.getUserById(userId);
    res.status(200).json({ user });
  } catch (e) {
    next(e);
  }
}

export async function followUser(req, res, next) {
  const { followed_id } = req.params;
  const { userId, isFollowed } = res.locals;

  console.log(isFollowed);
  
  try {
    const teste = userRepository.alterFollow(followed_id, userId, isFollowed);
    res.status(200).json({isFollowed: !isFollowed});
  } catch (e) {
    next(e);
  }
}
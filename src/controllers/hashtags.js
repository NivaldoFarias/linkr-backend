import { hashtagRepository } from '../repositories/hashtags.js';
import { postsRepository } from '../repositories/posts.js';
import CustomError from '../util/CustomError.js';

export async function getTrendingHashtags(req, res) {
  try {
    const trending = await hashtagRepository.getTrendingHashtags();
    res.send(trending);
  } catch (e) {
    res.status(500).send({ error: e });
  }
}

export async function getHashtagPosts(req, res) {
  try {
    const { hashtagId } = res.locals;
    const posts = await postsRepository.getPostsByHashtagId(hashtagId);

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

    console.log(`[CONTROLLER] ${posts.length} posts`);
    res.send(posts);
  } catch (e) {
    res.status(500).send({ error: e });
  }
}

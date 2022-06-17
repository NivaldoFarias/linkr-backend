import { postsRepository } from '../repositories/posts.js';
export async function getTimelinePosts(req, res) {
  try {
    const posts = await postsRepository.getTimelinePosts();

    for (const post of posts) {
      const likes = await postsRepository.getPostLikes(post.id);
      post.totalLikes = likes.length;
      post.usersWhoLiked = likes.length > 0 ? likes.slice(0, likes.length > 2 ? 2 : likes.length) : [];
      post.userHasLiked = false;
      for (const like of likes) {
        if (like.userId === res.locals.userId) {
          post.userHasLiked = true;
        }
      }
    }

    res.send(posts);
  } catch (e) {
    res.status(500).send({ error: e });
  }
}
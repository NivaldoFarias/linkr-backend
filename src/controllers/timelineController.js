import { postsRepository } from '../repositories/posts.js';
export async function getTimelinePosts(req, res) {
  const { userId } = res.locals;
  try {
    const posts = await postsRepository.getTimelinePosts();
    for (const post of posts) {
      const likes = await postsRepository.getPostLikes(post.id);
      const likesFiltered = likes.filter(like => like.userId !== userId);
      post.totalLikes = likes.length;
      post.usersWhoLiked = likesFiltered.length > 0 ? likesFiltered.slice(0, likesFiltered.length > 2 ? 2 : likesFiltered.length) : [];
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
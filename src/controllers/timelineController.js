import { postsRepository } from '../repositories/posts.js';
export async function getTimelinePosts(req, res) {
  try {
    const posts = await postsRepository.getTimelinePosts();
    res.send(posts);
  } catch (e) {
    res.status(500).send({ error: e });
  }
}
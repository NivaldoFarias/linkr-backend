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
    res.send(posts);
  } catch (e) {
    res.status(500).send({ error: e });
  }
}

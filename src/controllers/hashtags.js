import { hashtagRepository } from "../repositories/hashtags.js";
import { postsRepository } from "../repositories/posts.js";
import CustomError from "../util/CustomError.js";

export async function getTrendingHashtags(req, res) {
    console.log('> ct getTrendingHashtags ');
    try {
        const trending = await hashtagRepository.getTrendingHashtags();
        console.log('> trending: ', trending);
        res.send(trending);
    } catch (e) {
        res.status(500).send({ error: e })
    }
}

export async function getHashtagPosts(req, res) {
    console.log('> ct getHashtagPosts');
    try {
        const { hashtagId } = res.locals;
        console.log('> hashtagId: ', hashtagId);
        const posts = await postsRepository.getPostsByHashtagId(hashtagId);
        console.log('> posts: ', posts);
        res.send(posts);
    } catch (e) {
        res.status(500).send({ error: e })
    }
}
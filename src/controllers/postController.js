import chalk from "chalk";
import { MIDDLEWARE } from "../blueprints/chalk.js";
import { hashtagRepository } from "../repositories/hashtags.js";
import { postsRepository } from "../repositories/posts.js";
import { userRepository } from "../repositories/users.js";



export async function saveHashtags(req, res, next) {
    const { text } = req.body;
    const { postId } = res.locals;
    const hashtags = text.match(/#[a-zA-Z0-9]+/g);
    if (hashtags) {
        try {
            // clean hashtags
            const cleanHashtags = hashtags.map(hashtag => hashtag.substring(1).toLowerCase());

            // create hashtags and create if not exist
            const hashtagIds = await Promise.all(cleanHashtags.map(async hashtag => {
                const foundHashtag = await hashtagRepository.findHashtag(hashtag);
                if (foundHashtag) {
                    return foundHashtag.id;
                } else {
                    const newHashtag = await hashtagRepository.createHashtag(hashtag);
                    return newHashtag.id;
                }
            }
            ));

            // check hashtags_posts and create if not exists
            await Promise.all(hashtagIds.map(async hashtagId => {
                const foundHashtagPost = await hashtagRepository.findHashtagPost(hashtagId, postId);
                if (!foundHashtagPost) {
                    await hashtagRepository.createHashtagPost(hashtagId, postId);
                }
            }
            ));
        } catch (e) {
            next(e);
        }

    }

    res.sendStatus(201);
}


export async function likePost(req, res) {
    const { userId, postId, userHasLikedPost } = res.locals;
    if (!userHasLikedPost) {
        try {
            await postsRepository.likePost(userId, postId);
            console.log(chalk.magenta(`${MIDDLEWARE} user liked post`));
            res.sendStatus(201);
        } catch (e) {
            res.sendStatus(500);
        }
    }
    else {
        console.log(chalk.magenta(`${MIDDLEWARE} nothing happened`));
        res.sendStatus(200);
    }
}

export async function unlikePost(req, res) {
    const { userId, postId, userHasLikedPost } = res.locals;
    if (userHasLikedPost) {
        try {
            await postsRepository.unlikePost(userId, postId);
            console.log(chalk.magenta(`${MIDDLEWARE} user unliked post`));
            res.sendStatus(200);
        } catch (e) {
            res.sendStatus(500);
        }
    }
    else {
        console.log(chalk.magenta(`nothing happened`));
        res.sendStatus(200);
    }
}


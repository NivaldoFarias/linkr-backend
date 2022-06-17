import { hashtagRepository } from "../repositories/hashtags.js";

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
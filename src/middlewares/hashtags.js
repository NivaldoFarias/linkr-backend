import { hashtagRepository } from "../repositories/hashtags.js";
import CustomError from "../util/CustomError.js";

export async function validateHashtag(req, res, next) {
    console.log('> mw: validateHashtag');
    const { hashtag } = req.params;
    console.log('> hashtag: ', hashtag);
    if (!hashtag) {
        throw new CustomError(400, 'Invalid hashtag');
    }
    try {
        const hashtagId = await hashtagRepository.getHashtagIdByName(hashtag);
        if (!hashtagId) {
            throw new CustomError(404, 'Hashtag not found');
        }
        console.log('> hashtagId: ', hashtagId);
        res.locals = { hashtagId };
        next();
    } catch (e) {
        next(e);
    }
}
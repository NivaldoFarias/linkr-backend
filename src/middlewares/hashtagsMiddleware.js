import { hashtagRepository } from '../repositories/hashtags.js';
import CustomError from '../util/CustomError.js';

export async function validateHashtag(req, res, next) {
  try {
    const { hashtag } = req.params;
    if (!hashtag) {
      throw new CustomError(400, 'Invalid hashtag');
    }
    const hashtagObj = await hashtagRepository.getHashtagIdByName(hashtag);
    const hashtagId = hashtagObj ? hashtagObj.id : null;

    if (!hashtagId) {
      throw new CustomError(404, 'Hashtag not found');
    }
    res.locals.hashtagId = hashtagId;
    console.log('[MIDDLEWARE] hashtagId: ', hashtagId);
    next();
  } catch (e) {
    next(e);
  }
}

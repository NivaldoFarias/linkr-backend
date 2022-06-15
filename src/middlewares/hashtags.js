import { hashtagRepository } from '../repositories/hashtags.js';
import CustomError from '../util/CustomError.js';

export async function validateHashtag(req, res, next) {
  const { hashtag } = req.params;
  if (!hashtag) {
    throw new CustomError(400, 'Invalid hashtag');
  }
  try {
    const hashtagId = await hashtagRepository.getHashtagIdByName(hashtag);
    if (!hashtagId) {
      throw new CustomError(404, 'Hashtag not found');
    }
    res.locals = { hashtagId };
    next();
  } catch (e) {
    next(e);
  }
}

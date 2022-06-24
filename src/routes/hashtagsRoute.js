import { Router } from 'express';
import logThis from '../blueprints/logThis.js';
import requireToken from '../middlewares/requireToken.js';
import { checkHashtagShares, getHashtagData } from '../controllers/feedSharesController.js';
import { getTrendingHashtags } from '../controllers/hashtagsController.js';
import { validateHashtag } from '../middlewares/hashtagsMiddleware.js';
import { validateUserId } from '../middlewares/usersMiddleware.js';
import { checkCheckSharesQuery, checkGetSharesQuery } from '../middlewares/sharesMiddleware.js';

const router = Router();

router.get('/trending', logThis('Get trending hashtags'), getTrendingHashtags);
router.get(
  '/:hashtag/posts',
  logThis('Get hashtags posts'),
  requireToken,
  validateUserId,
  validateHashtag,
  checkGetSharesQuery,
  getHashtagData,
);
router.get(
  '/:hashtag/posts/check',
  logThis('Check hashtag posts'),
  requireToken,
  validateUserId,
  validateHashtag,
  checkCheckSharesQuery,
  checkHashtagShares,
);

export default router;

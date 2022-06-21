import { Router } from 'express';
import logThis from '../blueprints/logThis.js';
import { getHashtagPosts, getTrendingHashtags } from '../controllers/hashtags.js';
import { validateHashtag } from '../middlewares/hashtags.js';
import requireToken from '../middlewares/requireToken.js';

const router = Router();



router.get('/trending', logThis('Get trending hashtags'), getTrendingHashtags);
router.get('/:hashtag/posts', logThis('Get hashtags posts'), requireToken, validateHashtag, getHashtagPosts);

export default router;

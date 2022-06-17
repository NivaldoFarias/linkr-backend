import { Router } from 'express';
import { getHashtagPosts, getTrendingHashtags } from '../controllers/hashtags.js';
import { validateHashtag } from '../middlewares/hashtags.js';
import requireToken from '../middlewares/requireToken.js';

const router = Router();

router.get('/trending', requireToken, getTrendingHashtags);
router.get('/:hashtag/posts', requireToken, validateHashtag, getHashtagPosts);

export default router;

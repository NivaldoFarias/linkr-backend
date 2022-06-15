import { Router } from 'express';
import { getHashtagPosts, getTrendingHashtags } from '../controllers/hashtags.js';
import { validateHashtag } from '../middlewares/hashtags.js';

const router = Router();

router.get('/trending', getTrendingHashtags);
router.get('/:hashtag/posts', validateHashtag, getHashtagPosts);

export default router;

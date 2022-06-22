import { Router } from 'express';
import logThis from '../blueprints/logThis.js';
import requireToken from '../middlewares/requireToken.js';
import { checkHashtagShares, getHashtagData } from '../controllers/feedSharesController.js';
import { getTrendingHashtags } from '../controllers/hashtagsController.js';
import { validateHashtag } from '../middlewares/hashtagsMiddleware.js';


const router = Router();



router.get('/trending', logThis('Get trending hashtags'), getTrendingHashtags);
router.get('/:hashtag/posts', logThis('Get hashtags posts'), requireToken, validateHashtag, getHashtagData);

export default router;

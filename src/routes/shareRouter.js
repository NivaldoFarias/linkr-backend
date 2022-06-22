import { Router } from 'express';
import logThis from '../blueprints/logThis.js';
import requireToken from '../middlewares/requireToken.js';
import { Unshare, share } from '../controllers/shareController.js';

const shareRouter = Router();

shareRouter.route('/:shareId').delete(
    logThis('Unshare'), 
    requireToken, 
    Unshare
);
shareRouter.route('/:postId').post(
    logThis('Share'),
    requireToken,
    share
);

export default shareRouter;
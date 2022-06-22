import { userRepository } from "../repositories/users.js";

export async function verifyIfUserIsFollowed(req, res, next) {
    const { followed_id } = req.params;
    const { userId } = res.locals;
    let isFollowed = false;
    
    try {
        const followed = await userRepository.getFollowing(followed_id, userId);
        if (followed !== null) {
            isFollowed = true;
        }

        res.locals.isFollowed = isFollowed;
        next();
    } catch (e) {
        next(e);
    }
}
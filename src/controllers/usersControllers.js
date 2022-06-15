import { userRepository } from "../repositories/users.js";

export const usersByUserName = async (req, res, next) => {
    try {
        const { username } = req.params;
        const users = await userRepository.getUsersByUserName(username);
        res.status(200).json({ users });
    } catch (e) {
        next(e);
    }
};

export const retrievePosts = async (req, res, next) => {
    try {
        const { userId: id } = req.params;
        const posts = await userRepository.getPostsByUserId(id);
        res.status(200).json({ posts });
    } catch (e) {
        next(e);
    }
}
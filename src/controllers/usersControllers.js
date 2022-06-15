import { userRepository } from "../repositories/users.js";

export const usersByUserName = async (req, res, next) => {
    try {
        console.log('> check users by username');
        const { username } = req.params;
        const users = await userRepository.getUsersByUserName(username);
        res.status(200).json({ users });
    } catch (e) {
        next(e);
    }
};
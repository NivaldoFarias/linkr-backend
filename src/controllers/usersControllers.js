import getUsersByUserName from "../repositories/getUsersByUserName.js";
import getPostsByUserId from "../repositories/getPostsByUserId.js";

export const usersByUserName = async (req,res,next) => {
    try {
        const { username } = req.params;
        const users = await getUsersByUserName(username);
        res.status(200).json({ users });
    } catch (e) {
        next(e);
    }
};

export const retrievePosts = async (req,res,next) => {
    try {
        const { userId:id } = req.params;
        const posts = await getPostsByUserId(id);
        res.status(200).json({ posts });
    } catch (e) {
        next(e);
    }
}
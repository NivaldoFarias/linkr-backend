import getUsersByUserName from "../repositories/getUsersByUserName.js";

export const usersByUserName = async (req,res,next) => {
    try {
        const { username } = req.params;
        const users = await getUsersByUserName(username);
        res.status(200).json({ users });
    } catch (e) {
        next(e);
    }
};
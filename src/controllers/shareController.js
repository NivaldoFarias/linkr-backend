import { sharesRepository } from "../repositories/shares.js";

export async function Unshare(req,res,next) {
    try {
        const {shareId} = req.params;
        await sharesRepository.deleteShare(shareId);
        res.sendStatus(200);
    } catch (e) {
        next(e);
    }
}

export async function share(req,res,next) {
    try {
        const {userId} = res.locals;
        const {postId} = req.params;
        await sharesRepository.insertShare(userId, postId);
        res.sendStatus(201);
    } catch (e) {
        next(e);
    }
}
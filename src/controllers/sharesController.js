import { MIDDLEWARE, API } from "../blueprints/chalk.js";
import chalk from "chalk";
import { sharesRepository } from "../repositories/shares.js";


export async function unsharePost(req, res, next) {
    try {
        const { shareId } = res.locals;
        if (shareId) {
            await sharesRepository.deleteShare(shareId);
            console.log(chalk.magenta(`${API} post unshared`));
            res.sendStatus(200);
        } else {
            console.log(chalk.magenta(`${API} not unsharing`));
            res.sendStatus(404);
        }
    } catch (e) {
        next(e);
    }
}

export async function sharePost(req, res, next) {
    try {
        const { userId, postId, shareId } = res.locals;
        if (!shareId) {
            await sharesRepository.insertShare(userId, postId);
            console.log(chalk.magenta(`${API} post shared`));
            res.sendStatus(201);
        } else {
            console.log(chalk.magenta(`${API} not sharing again`));
            res.sendStatus(409);
        }
    } catch (e) {
        next(e);
    }
}

export async function shareNewPost(req, res, next) {
    try {
        const { userId, postId, shareId } = res.locals;
        if (!shareId) {
            await sharesRepository.insertShare(userId, postId);
            console.log(chalk.magenta(`${API} new post shared`));
            next();
        } else {
            console.log(chalk.magenta(`${API} share already exists`));
            res.sendStatus(409);
        }
    } catch (e) {
        next(e);
    }
}
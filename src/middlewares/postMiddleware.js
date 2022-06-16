import { postsRepository } from '../repositories/posts.js';
import { MIDDLEWARE } from '../blueprints/chalk.js';
import chalk from 'chalk';
import { urlsRepository } from '../repositories/urls.js';
import urlMetadata from "url-metadata";



export async function findUrl(req, res, next) {
    try {
        const url = await urlsRepository.findUrl(req.body.url);
        res.locals.url = url;
        console.log(url);
        console.log(chalk.magenta(`${MIDDLEWARE} url ${url ? '' : 'not '}found`));
        next();
    } catch (e) {
        next(e);
    }
}


export async function createUrl(req, res, next) {
    if (res.locals.url) {
        console.log(chalk.magenta(`${MIDDLEWARE} not creating url`));
        next();
        return;
    }
    const url = { url: req.body.url, title: "", description: "", imageUrl: "" };
    try {
        const promise = await urlMetadata(url.url).then(
            (metadata) => {
                url.title = metadata.title;
                url.description = metadata.description;
                url.imageUrl = metadata.image;
            }
        );
        const newUrl = await urlsRepository.createUrl(url.url, url.title, url.description, url.imageUrl);
        res.locals.url = newUrl;
        console.log(chalk.magenta(`${MIDDLEWARE} url created`));
        next();
    } catch (e) { next(e); }
    next();
}

export async function createPost(req, res, next) {
    const { userId, url } = res.locals;
    const urlId = url.id;
    const { text } = req.body;
    try {
        const post = await postsRepository.insertPost(text, urlId, userId);
        res.locals.postId = post.id;
        console.log(chalk.magenta(`${MIDDLEWARE} url created`));
        next();
    } catch (e) {
        next(e);
    }
}

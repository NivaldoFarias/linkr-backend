import { MIDDLEWARE } from '../blueprints/chalk.js';
import chalk from 'chalk';
import sanitizeHtml from 'sanitize-html';

export function validateCommentText(req, res, next) {
    const { text } = req.body;
    if (text) {
        res.locals.text = sanitizeHtml(text);
        console.log(chalk.magenta(`${MIDDLEWARE} text validated`));
        next();
    } else {
        console.log(chalk.magenta(`${MIDDLEWARE} text not validated`));
        res.sendStatus(400);
    }
}

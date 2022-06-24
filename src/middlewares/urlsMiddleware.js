import { MIDDLEWARE } from '../blueprints/chalk.js';
import chalk from 'chalk';
import urlMetadata from 'url-metadata';
import { urlsRepository } from '../repositories/urls.js';

export async function findUrl(req, res, next) {
  try {
    const url = await urlsRepository.findUrl(req.body.url);
    res.locals.url = url;
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
  } else {
    console.log(chalk.magenta(`creating url...`));
    const url = { url: req.body.url, title: '', description: '', imageUrl: '' };
    try {
      const promise = await urlMetadata(url.url)
        .then((metadata) => {
          url.title = metadata.title;
          url.description = metadata.description;
          url.imageUrl = metadata.image;
        })
        .catch((e) => {
          console.log(chalk.red(`${MIDDLEWARE} error getting url metadata: ${e}`));
        });
      const newUrl = await urlsRepository.createUrl(
        url.url,
        url.title,
        url.description,
        url.imageUrl,
      );
      res.locals.url = newUrl;
      console.log(chalk.magenta(`${MIDDLEWARE} url created`));
      next();
    } catch (e) {
      console.log('ERROR!', e);
      next(e);
    }
  }
}

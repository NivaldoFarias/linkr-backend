import { postsRepository } from '../repositories/posts.js';
/*===MOCK===*/
const USER = {
  id: 1,
  name: 'saulo',
};
/*===MOCK===*/

export async function newPost(req, res, next) {
  /*===MOCK===*/
  res.locals.user = { ...USER };
  /*===MOCK===*/
  const { text, url } = req.body;
  const { user } = res.locals;

  try {
    await postsRepository.insertPost(text, url, user.id);
    res.sendStatus(201);
  } catch (e) {
    next(e);
  }
}

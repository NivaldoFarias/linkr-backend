import { LOG } from './chalk,js';

export default function logThis(text) {
  return (_req, _res, next) => {
    try {
      console.log(`${LOG} ${text}`);
      next();
    } catch (e) {
      next(e);
    }
  };
}

import { ROUTE } from "./chalk.js";

export default function logThis(text) {
  return (_req, _res, next) => {
    console.log(`${ROUTE} ${text}`);
    next();
  };
}

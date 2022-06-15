import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import chalk from 'chalk';

import { API } from './../blueprints/chalk.js';
import * as authRepository from './../repositories/auth.js';

dotenv.config();

async function signUp(_req, res) {
  const { username, email, password, imageUrl } = res.locals;
  const cryptPass = bcrypt.hashSync(password, 10);
  const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

  await authRepository.signUp(username, email, cryptPass, imageUrl, createdAt);
  console.log(chalk.blue(`${API} ${username} registered successfully`));
  return res.sendStatus(201);
}

async function signIn(_req, res) {
  const {
    user: { id, username },
  } = res.locals;
  const data = {};
  const secretKey = process.env.JWT_SECRET ?? 'JWT_SECRET';
  const expiresIn = process.env.JWT_EXPIRES_IN ?? '1d';
  const config = { expiresIn, subject: id.toString() };
  const token = jwt.sign(data, secretKey, config);

  console.log(chalk.blue(`${API} ${username} signed in successfully`));
  return res.status(200).send({ token });
}

export { signUp, signIn };

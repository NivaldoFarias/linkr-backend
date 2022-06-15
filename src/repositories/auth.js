import SqlString from 'sqlstring';
import db from './../database/index.js';

async function signUp(email = '', cryptPass = '', username = '', imageUrl = '', createdAt = '') {
  const query = SqlString.format(
    `INSERT INTO users (email, password, username, image_url, created_at) VALUES (?, ?, ?, ?, ?)`,
    [email, cryptPass, username, imageUrl, createdAt],
  );
  return db.query(query);
}

export { signUp };

import db from '../database/index.js';


async function getHashtagShares(userId, date, limit) {
  const query = `
      SELECT
        s.id, s.post_id AS "postId", s.user_id AS "userId", s.created_at AS "createdAt"
      FROM shares s
      JOIN followings f ON f.followed_id = s.user_id
      WHERE f.user_id = ${userId}
      ORDER BY s.created_at DESC
      LIMIT ${limit ? limit : 10};
    `
  const response = await db.query(query);
  return response.rows;
}


async function getHashtagSharesBeforeDate(userId, date, limit) {

  const query = `
      SELECT
        s.id, s.post_id AS "postId", s.user_id AS "userId", s.created_at AS "createdAt"
      FROM shares s
      JOIN followings f ON f.followed_id = s.user_id
      WHERE f.user_id = ${userId}
      AND s.created_at < '${date}'
      ORDER BY s.created_at DESC
      LIMIT ${limit ? limit : 10};
    `
  const response = await db.query(query);
  return response.rows;
}

async function getHashtagSharesAfterDate(userId, date, limit) {

  const query = `
      SELECT
        s.id, s.post_id AS "postId", s.user_id AS "userId", s.created_at AS "createdAt"
      FROM shares s
      JOIN followings f ON f.followed_id = s.user_id
      WHERE f.user_id = ${userId}
      AND s.created_at < '${date}'
      ORDER BY s.created_at DESC
      LIMIT ${limit ? limit : 10};
    `
  const response = await db.query(query);
  return response.rows;
}


async function checkHashtagSharesBeforeDate(userId, date) {
  const query = `
        SELECT
            COUNT(*) AS "numberOfShares"
        FROM shares s
        JOIN followings f ON f.followed_id = s.user_id
        WHERE f.user_id = ${userId}
        AND s.created_at < '${date}'
    `;
  const response = await db.query(query);
  return response.rows[0].numberOfShares || 0;
}

async function checkHashtagSharesAfterDate(userId, date) {
  const query = `
        SELECT
            COUNT(*) AS "numberOfShares"
        FROM shares s
        JOIN followings f ON f.followed_id = s.user_id
        WHERE f.user_id = ${userId}
        AND s.created_at > '${date}'
    `;
  const response = await db.query(query);
  return response.rows[0].numberOfShares || 0;
}


export const hashtagsSharesRepository = {
  getHashtagShares,
  getHashtagSharesBeforeDate,
  getHashtagSharesAfterDate,
  checkHashtagSharesBeforeDate,
  checkHashtagSharesAfterDate
};
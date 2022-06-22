import db from '../database/index.js';


async function getHashtagShares(hashtagId, before, after, limit) {
  const query = `
      SELECT
        s.id, s.post_id AS "postId", s.user_id AS "userId", s.created_at AS "createdAt"
      FROM shares s
      JOIN posts p ON p.id = s.post_id
      JOIN hashtags_posts hp ON hp.post_id = p.id
      WHERE hp.hashtag_id = ${hashtagId}
      ${before ? `AND s.created_at < '${before}'` : ''}
      ${after ? `AND s.created_at > '${after}'` : ''}
      ORDER BY s.created_at DESC
      LIMIT ${limit ? limit : 10};
    `
  const response = await db.query(query);
  return response.rows;
}


async function checkHashtagSharesBeforeDate(hashtagId, date) {
  const query = `
        SELECT
          COUNT(*) AS "numberOfShares"
        FROM shares s
        JOIN posts p ON p.id = s.post_id
        JOIN hashtags_posts hp ON hp.post_id = p.id
        WHERE hp.hashtag_id = ${hashtagId}
        AND s.created_at < '${date}'
    `;
  const response = await db.query(query);
  return response.rows[0].numberOfShares || 0;
}

async function checkHashtagSharesAfterDate(hashtagId, date) {
  const query = `
        SELECT
          COUNT(*) AS "numberOfShares"
        FROM shares s
        JOIN posts p ON p.id = s.post_id
        JOIN hashtags_posts hp ON hp.post_id = p.id
        WHERE hp.hashtag_id = ${hashtagId}
        AND s.created_at > '${date}'
    `;
  const response = await db.query(query);
  return response.rows[0].numberOfShares || 0;
}


export const hashtagsSharesRepository = {
  getHashtagShares,
  checkHashtagSharesBeforeDate,
  checkHashtagSharesAfterDate
};
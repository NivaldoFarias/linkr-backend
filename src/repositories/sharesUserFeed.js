import db from '../database/index.js';

async function getUserShares(userId, before, after, limit) {
  const query = `
      SELECT
        s.id, s.post_id AS "postId", s.user_id AS "userId", s.created_at AS "createdAt"
      FROM shares s
      JOIN users u ON u.id = s.user_id
      WHERE u.id = ${userId}
      ${before ? `AND s.created_at < '${before}'` : ''}
      ${after ? `AND s.created_at > '${after}'` : ''}
      ORDER BY s.created_at DESC
      LIMIT ${limit ? limit : 10};
    `;
  const response = await db.query(query);
  return response.rows;
}

async function checkUserSharesBeforeDate(userId, date) {
  const query = `
        SELECT
            COUNT(*) AS "numberOfShares"
        FROM shares s
        JOIN users u ON u.id = s.user_id
        WHERE u.id = ${userId}
        AND s.created_at < '${date}'
    `;
  const response = await db.query(query);
  return response.rows[0].numberOfShares || 0;
}

async function checkUserSharesAfterDate(userId, date) {
  const query = `
        SELECT
            COUNT(*) AS "numberOfShares"
        FROM shares s
        JOIN users u ON u.id = s.user_id
        WHERE u.id = ${userId}
        AND s.created_at > '${date}'
    `;
  const response = await db.query(query);
  return response.rows[0].numberOfShares || 0;
}

export const userSharesRepository = {
  getUserShares,
  checkUserSharesBeforeDate,
  checkUserSharesAfterDate,
};

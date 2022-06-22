import db from '../database/index.js';

async function getHashtagIdByName(hashtag) {
  const query = `
        SELECT * FROM hashtags WHERE name = $1;
    `;
  const response = await db.query(query, [hashtag]);
  return response.rows[0];
}

async function getTrendingHashtags(hashtag) {
  const query = `
        SELECT 
            h.*,
            COUNT(l.id) AS likes_count,
            COUNT(p.id) AS posts_count
        FROM hashtags h 
        JOIN hashtags_posts hp ON h.id = hp.hashtag_id
        LEFT JOIN posts p ON hp.post_id = p.id
        LEFT JOIN likes l ON p.id = l.post_id
        GROUP BY h.id
        ORDER BY likes_count DESC, posts_count DESC;
    `;
  const response = await db.query(query);
  return response.rows;
}

export async function findHashtag(hashtag) {
  const query = `
        SELECT * FROM hashtags WHERE "name" = $1;
    `;
  const response = await db.query(query, [hashtag]);
  return response.rows[0];
}

export async function createHashtag(hashtag) {
  const query = `
        INSERT INTO hashtags ("name") VALUES ($1) RETURNING *;`;
  const response = await db.query(query, [hashtag]);
  return response.rows[0];
}



export const hashtagRepository = {
  getHashtagIdByName,
  getTrendingHashtags,
  findHashtag,
  createHashtag,
};

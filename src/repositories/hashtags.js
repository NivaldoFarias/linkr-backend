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
        LEFT JOIN hashtags_posts hp ON h.id = hp.hashtag_id
        LEFT JOIN posts p ON hp.post_id = p.id
        LEFT JOIN likes l ON p.id = l.post_id
        GROUP BY h.id
        ORDER BY likes_count DESC, posts_count DESC
        LIMIT 10;
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

export async function findHashtagPost(hashtagId, postId) {
  const query = `
        SELECT * FROM hashtags_posts WHERE hashtag_id = $1 AND post_id = $2;
    `;
  const response = await db.query(query, [hashtagId, postId]);
  return response.rows[0];
}

export async function createHashtagPost(hashtagId, postId) {
  const query = `
        INSERT INTO hashtags_posts (hashtag_id, post_id) VALUES ($1, $2) RETURNING *;`;
  const response = await db.query(query, [hashtagId, postId]);
  return response.rows[0];
}

export async function deleteHashtagPost(id) {
  const query = `
      DELETE FROM hashtags_posts WHERE id = $1;
  `;
  const response = await db.query(query, [id]);
  return response.rows[0];
}

export async function findHashtagsPostsByPostId(postId) {
  const query = `
      SELECT hp.*, h.name AS hashtag
      FROM hashtags_posts hp 
      LEFT JOIN hashtags h ON hp.hashtag_id = h.id
      WHERE hp.post_id = $1;
  `;
  const response = await db.query(query, [postId]);
  return response.rows;
}

export const hashtagRepository = {
  getHashtagIdByName,
  getTrendingHashtags,
  findHashtag,
  createHashtag,
  findHashtagPost,
  createHashtagPost,
  findHashtagsPostsByPostId,
  deleteHashtagPost,
};

import db from '../database/index.js';

async function getPostsByHashtagId(hashtagId) {
  const query = `
    SELECT p.*, u.username, u.image_url FROM posts p
    JOIN users u ON p.user_id = u.id
    JOIN hashtags_posts hp ON p.id = hp.post_id
    WHERE hp.hashtag_id = $1
    ORDER BY p.created_at DESC;
    `;
  const response = await db.query(query, [hashtagId]);
  return response.rows;
}

async function getPostsByUserId(userId) {
  const query = `
        SELECT p.*, u.username, u.image_url FROM users u
        JOIN posts p ON p.user_id = u.id
        LEFT JOIN hashtags_posts hp ON p.id = hp.post_id
        WHERE p.user_id = $1
        ORDER BY p.created_at DESC;
    `;
  const response = await db.query(query, [userId]);
  return response.rows;
}

async function insertPost(text, urlId, userId) {

  const query = `
    INSERT INTO posts (text, url_id, user_id)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const response = await db.query(query, [text, urlId, userId]);
  return response.rows[0];
}

export const postsRepository = {
  getPostsByHashtagId,
  getPostsByUserId,
  insertPost,
};

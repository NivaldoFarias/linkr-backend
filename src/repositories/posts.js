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
        SELECT p.*, u.username, u.image_url FROM posts p
        JOIN users u ON p.user_id = u.id
        JOIN hashtags_posts hp ON p.id = hp.post_id
        WHERE p.user_id = $1
        ORDER BY p.created_at DESC;
    `;
  const response = await db.query(query, [userId]);
  return response.rows;
}

export const postsRepository = {
  getPostsByHashtagId,
  getPostsByUserId,
};

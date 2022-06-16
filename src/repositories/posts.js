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

async function getTimelinePosts(){
  const query = `
  SELECT
    p.id, p.text, 
    ur.url, ur.image_url as "urlPicture", ur.title as "urlTitle", ur.description as "urlDescription",
    us.id as "userId", us.image_url as "userPictureUrl", us.username
  FROM posts p
  JOIN urls ur on p.url_id = ur.id
  JOIN users us on p.user_id = us.id
  ORDER BY p.created_at DESC
  LIMIT 20;
  `;
  const response = await db.query(query);
  return response.rows;
}

async function insertPost(text, url, user_id) {
  return db.query(
    `
        INSERT INTO posts (text, url, user_id)
        VALUES ($1, $2, $3)
    `,
    [text, url, user_id],
  );
}

export const postsRepository = {
  getPostsByHashtagId,
  getPostsByUserId,
  insertPost,
};

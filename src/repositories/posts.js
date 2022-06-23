import db from '../database/index.js';

async function getPostsByHashtagId(hashtagId) {
  const query = `
      SELECT
        p.id, p.text, 
        ur.url, ur.image_url as "urlPicture", ur.title as "urlTitle", ur.description as "urlDescription",
        us.id as "userId", us.image_url as "userPictureUrl", us.username
      FROM users us
      JOIN posts p ON p.user_id = us.id
      JOIN urls ur on p.url_id = ur.id
      JOIN hashtags_posts hp on hp.post_id = p.id
      WHERE hp.hashtag_id = $1
      ORDER BY p.created_at DESC;
    `;
  const response = await db.query(query, [hashtagId]);
  return response.rows;
}

async function getPostsByUserId(userId) {
  const query = `
    SELECT
      p.id, p.text, 
      ur.url, ur.image_url as "urlPicture", ur.title as "urlTitle", ur.description as "urlDescription",
      us.id as "userId", us.image_url as "userPictureUrl", us.username
    FROM users us
    JOIN posts p ON p.user_id = us.id
    JOIN urls ur on p.url_id = ur.id
    WHERE p.user_id = $1
    ORDER BY p.created_at DESC;
    `;
  const response = await db.query(query, [userId]);
  return response.rows;
}

async function getTimelinePosts() {
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

async function insertPost(text, urlId, userId) {
  const query = `
    INSERT INTO posts (text, url_id, user_id)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const response = await db.query(query, [text, urlId, userId]);
  return response.rows[0];
}

async function findPostById(postId) {
  const query = `SELECT * FROM posts WHERE id = $1`;
  const response = await db.query(query, [postId]);
  return response.rows[0];
}

async function getPost(postId) {
  const query = `
  SELECT
    p.id, p.text, 
    ur.url, ur.image_url as "urlPicture", ur.title as "urlTitle", ur.description as "urlDescription",
    us.id as "userId", us.image_url as "userPictureUrl", us.username
  FROM posts p
  JOIN urls ur on p.url_id = ur.id
  JOIN users us on p.user_id = us.id
  WHERE p.id = $1
  LIMIT 20;`;
  const response = await db.query(query, [postId]);
  return response.rows[0];
}

async function updatePost(postId, text) {
  const query = `
    UPDATE posts
    SET text = '${text}'
    WHERE id = ${postId}
    RETURNING *;
  `;
  const response = await db.query(query);
  return response.rows[0];
}

async function deletePostById(postId, userId) {
  const query = `
    DELETE FROM posts 
    WHERE id=$1 AND user_id=$2
  `;

  const response = await db.query(query, [postId, userId]);
  return response.rows[0];
}

async function getPostById(postId) {
  const query = `
    SELECT
      p.id, p.created_at AS "createdAt", p.user_id AS "userId", p.text,
      ur.url, ur.image_url AS image, ur.title, ur.description
    FROM posts p
    JOIN urls ur ON p.url_id = ur.id
    WHERE p.id = $1
  `;
  const response = await db.query(query, [postId]);
  return response.rows[0];
}

export const postsRepository = {
  insertPost,
  updatePost,
  findPostById,
  getPostsByHashtagId,
  getPostsByUserId,
  getTimelinePosts,
  getPost,
  deletePostById,
  getPostById,
};

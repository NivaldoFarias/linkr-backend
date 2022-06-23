import db from './../database/index.js';

async function userIdHasLikedPost(userId, postId) {
  const query = `SELECT * FROM likes WHERE user_id = $1 AND post_id = $2`;
  const response = await db.query(query, [userId, postId]);
  const hasLiked = response.rows.length > 0 ?? false;
  return hasLiked;
}

async function likePost(userId, postId) {
  const query = `INSERT INTO likes (user_id, post_id) VALUES ($1, $2)`;
  const response = await db.query(query, [userId, postId]);
  return response.rows[0];
}

async function unlikePost(userId, postId) {
  const query = `DELETE FROM likes WHERE user_id = $1 AND post_id = $2`;
  const response = await db.query(query, [userId, postId]);
  return response.rows[0];
}

async function getPostLikes(postId) {
  const query = `
      SELECT u.id as "userId", u.username
      FROM likes l
      JOIN users u ON u.id = l.user_id
      WHERE post_id = $1;
    `;
  const response = await db.query(query, [postId]);
  return response.rows;
}

async function deleteLikesByPostId(postId) {
  const query = `
      DELETE FROM likes
      WHERE post_id=$1
    `;
  const response = await db.query(query, [postId]);
  return response.rows[0];
}

export const likesRepository = {
  userIdHasLikedPost,
  likePost,
  unlikePost,
  getPostLikes,
  deleteLikesByPostId,
};

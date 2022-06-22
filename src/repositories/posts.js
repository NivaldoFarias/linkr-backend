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

async function userIdHasLikedPost(userId, postId) {
  const query = `SELECT * FROM likes WHERE user_id = $1 AND post_id = $2`;
  const response = await db.query(query, [userId, postId]);
  const hasLiked = response.rows.length > 0 ?? false;
  return hasLiked;
}

async function likePost(userId, postId) {
  const query = `INSERT INTO likes (user_id, post_id) VALUES ($1, $2)`;
  console.log(query, [userId, postId]);
  const response = await db.query(query, [userId, postId]);
  return response.rows[0];
}

async function unlikePost(userId, postId) {
  const query = `DELETE FROM likes WHERE user_id = $1 AND post_id = $2`;
  const response = await db.query(query, [userId, postId]);
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

async function deleteHastagsPostsByPostId(postId) {
  const query = `
    DELETE FROM hashtags_posts 
    WHERE post_id=$1
  `;
  const response = await db.query(query, [postId]);
  return response.rows[0];
}

async function deleteLikesByPostId(postId) {
  const query = `
    DELETE FROM likes
    WHERE post_id=$1
  `;
  const response = await db.query(query, [postId]);
  return response.rows[0];
}



async function getTimelineShares(userId, beforeDate, afterDate, limit) {

  // get shares from users that userId follows
  // array of shares = {id, postId, userId, createdAt}
  // beforeDate and afterDate are strings and are optional
  // limit is an integer and is optional

  const query = `
    SELECT
      s.id, s.post_id AS "postId", s.user_id AS "userId", s.created_at AS "createdAt"
    FROM shares s
    JOIN followings f ON f.followed_id = s.user_id
    WHERE f.user_id = ${userId}
    ${beforeDate ? `AND s.created_at < '${beforeDate}'` : ''}
    ${afterDate ? `AND s.created_at > '${afterDate}'` : ''}
    ORDER BY s.created_at DESC
    ${limit ? `LIMIT ${limit}` : ''};
  `
  console.log(query);
  const response = await db.query(query);
  return response.rows;
}

async function getPostById(postId) {
  // id, createdAt, userId, text, url, image (url), title (url), description (url)
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

async function getPostComments(postId) {
  // userId, text, createdAt
  const query = `
    SELECT
      c.user_id AS "userId", c.text, c.created_at AS "createdAt"
    FROM comments c
    WHERE c.post_id = $1
  `;
  const response = await db.query(query, [postId]);
  return response.rows;
}

async function getSharesInfo(postId, userId) {
  // userHasShared AND numberOfShares
  const query = `
    SELECT
      COUNT(*) AS "numberOfShares",
      COUNT(CASE WHEN user_id = $2 THEN 1 END) > 0 AS "userHasShared"
    FROM shares
    WHERE post_id = $1
  `;
  const response = await db.query(query, [postId, userId]);
  return response.rows[0];
}

async function getUserDataById(otherUserId, userId) {
  // id, username, imageUrl, isFollowing
  // console.log('aqui', userId, otherUserId);
  const query = `
    SELECT
      u.id, u.username, u.image_url AS "imageUrl",
      COUNT(CASE WHEN f.user_id = $2 THEN 1 END) > 0 AS "isFollowing"
    FROM users u
    LEFT JOIN followings f ON f.followed_id = u.id
    WHERE u.id = $1
    GROUP BY u.id;
  `;

  const response = await db.query(query, [otherUserId, userId]);
  return response.rows[0];
}

export const postsRepository = {
  getPostsByHashtagId,
  getPostsByUserId,
  insertPost,
  getTimelinePosts,
  findPostById,
  userIdHasLikedPost,
  likePost,
  unlikePost,
  getPostLikes,
  getPost,
  deletePostById,
  deleteHastagsPostsByPostId,
  deleteLikesByPostId,
  updatePost,

  getTimelineShares,
  getPostById,
  getPostComments,
  getSharesInfo,
  getUserDataById
};

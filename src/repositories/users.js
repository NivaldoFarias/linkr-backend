import db from '../database/index.js';

const getUsersByUserName = async (username) => {
  const searchQuery = `
        SELECT users.id, users.username, users.image_url as "imageUrl"
        FROM users
        WHERE LOWER(users.username) LIKE $1
        ORDER BY users.username ASC;
    `;
  const result = await db.query(searchQuery, [`${username.toLowerCase()}%`]);
  return result.rows;
};

const getUserById = async (id) => {
  const searchQuery = `
      SELECT id, username, image_url as "imageUrl"
      FROM users
      WHERE users.id = $1;
    `;
  const result = await db.query(searchQuery, [id]);
  return result.rows[0] ?? null;
};

const getUserByUsername = async (username) => {
  const searchQuery = `
      SELECT id, username, image_url as "imageUrl", password
      FROM users
      WHERE users.username = $1;
    `;
  const result = await db.query(searchQuery, [username]);
  return result.rows[0] ?? null;
};

const getFollowing = async (userId, followedId) => {
  const searchQuery = `
    SELECT id
    FROM followings 
    WHERE user_id = $1 AND followed_id = $2;
  `;
  const result = await db.query(searchQuery, [followedId, userId]);
  return result.rows[0] ?? null;
};

const followUserById = async (userId, followedId) => {
  console.log(userId, followedId);
  const insertQuery = `
    INSERT INTO followings (user_id, followed_id)
    VALUES ($1, $2);
  `;

  const result = await db.query(insertQuery, [followedId, userId]);
  return result.rows[0] ?? null;
};

const unfollowUserById = async (userId, followedId) => {
  const deleteQuery = `
    DELETE FROM followings 
    WHERE user_id = $1 AND followed_id = $2
  `;

  const result = await db.query(deleteQuery, [followedId, userId]);
  return result.rows[0] ?? null;
};

export const userRepository = {
  getUsersByUserName,
  getUserByUsername,
  getUserById,
  getFollowing,
  followUserById,
  unfollowUserById,
};

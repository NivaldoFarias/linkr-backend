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

async function getUserDataById(otherUserId, userId) {
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

export const userRepository = {
  getUsersByUserName,
  getUserByUsername,
  getUserById,
  getUserDataById
};

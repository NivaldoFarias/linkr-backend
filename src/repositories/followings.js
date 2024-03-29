import db from '../database/index.js';

const getFollowing = async (userId, followedId) => {
  const searchQuery = `
      SELECT id
      FROM followings 
      WHERE user_id = $1 AND followed_id = $2;
    `;
  const result = await db.query(searchQuery, [followedId, userId]);
  return result.rows[0] ? result.rows[0] : null;
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

async function getUserFollowData(userId) {
  const searchQuery = `
        SELECT 
            COUNT(CASE WHEN f.user_id = $1 THEN 1 END) - 1 AS "numberOfFollowings",
            COUNT(CASE WHEN f.followed_id = $1 THEN 1 END) - 1 AS "numberOfFollowers"
        FROM followings f;
    `;
  const result = await db.query(searchQuery, [userId]);
  return result.rows[0] ?? null;
}

export const followingsRepository = {
  getFollowing,
  followUserById,
  unfollowUserById,
  getUserFollowData,
};

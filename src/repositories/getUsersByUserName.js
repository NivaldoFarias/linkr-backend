import db from '../database/index.js';

const getUsersByUserName = async (username) => {
    const searchQuery = `
        SELECT users.id, users.username, users.image_url as imageUrl
        FROM users
        WHERE LOWER(users.username) LIKE $1
        ORDER BY users.username ASC;
    `;
    const result = await db.query(searchQuery,[`${username.toLowerCase()}%`]);
    return result.rows;
}

export default getUsersByUserName;
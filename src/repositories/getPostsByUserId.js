import db from '../database/index.js';

const getPostsByUserId = async (id) => {

    const searchQuery = `
        SELECT posts.id, posts.text, posts.url, posts.created_at as "createdAt"
        FROM posts
        WHERE posts.user_id = $1;
    `;
    const results = await db.query(searchQuery,[id]);
    return results.rows;
};

export default getPostsByUserId;
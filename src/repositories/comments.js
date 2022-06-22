import db from '../database/index.js';

async function createNewComment(userId, postId, text) {
    const query = `INSERT INTO comments (user_id, post_id, text) VALUES ($1, $2, $3)`
    const response = await db.query(query, [userId, postId, text]);
    return response.rows;
}

export const commentsRepository = {
    createNewComment,
}
import db from '../database/index.js';

async function createNewComment(userId, postId, text) {
    const query = `INSERT INTO comments (user_id, post_id, text) VALUES ($1, $2, $3)`
    const response = await db.query(query, [userId, postId, text]);
    return response.rows;
}

async function getPostComments(postId) {
    const query = `
      SELECT
        c.id, c.user_id AS "userId", c.text, c.created_at AS "createdAt"
      FROM comments c
      WHERE c.post_id = $1
    `;
    const response = await db.query(query, [postId]);
    return response.rows;
}

export const commentsRepository = {
    createNewComment, getPostComments
}
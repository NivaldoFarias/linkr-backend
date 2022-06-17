import db from '../database/index.js';

export async function likePost(postId, userId) {
    const query = `
        INSERT INTO likes (post_id, user_id)
        VALUES ($1, $2)
        `;
    const response = await db.query(query, [postId, userId]);
    return response.rows[0];
}

export async function dislikePost(postId, userId) {
    const query = `
        DELETE FROM likes
        WHERE post_id = $1 AND user_id = $2
        `;
    const response = await db.query(query, [postId, userId]);
    return response.rows[0];
}
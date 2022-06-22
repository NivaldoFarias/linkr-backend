import db from '../database/index.js';

async function insertShare(userId, postId) {
    const query = `
        INSERT INTO reshares (user_id,post_id)
        VALUES ($1,$2);
    `;
    const response = await db.query(query, [userId,postId]);
    return response.rows[0];
}

async function deleteShare(shareId) {
    const query = `
        DELETE FROM reshares
        WHERE id = $1
    `;
    const response = await db.query(query, [shareId]);
    return response.rows[0];
}

export const sharesRepository = {
    insertShare,
    deleteShare,
};
import db from '../database/index.js';

async function insertShare(userId, postId) {
    const query = `
        INSERT INTO shares (user_id, post_id)
        VALUES ($1,$2)
        RETURNING *;
    `;
    const response = await db.query(query, [userId, postId]);
    return response.rows[0];
}

async function deleteShare(shareId) {
    const query = `
        DELETE FROM shares
        WHERE id = $1;
    `;
    const response = await db.query(query, [shareId]);
    return response.rows[0];
}

async function findShareId(userId, postId) {
    const query = `
        SELECT id
        FROM shares
        WHERE user_id = $1 AND post_id = $2;
    `;
    const response = await db.query(query, [userId, postId]);
    return response.rows[0] ? response.rows[0].id : null;
}

export const sharesRepository = {
    insertShare,
    deleteShare,
    findShareId
};
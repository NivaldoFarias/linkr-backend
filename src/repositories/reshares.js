import db from '../database/index.js';

async function insertRepost(userId, postId) {
    const query = `
        INSERT INTO reshares (user_id,post_id)
        VALUES ($1,$2);
    `;
    const response = await db.query(query,[userId,postId]);
    return response.rows[0];
}


export const resharesRepository = {
    insertRepost,
};
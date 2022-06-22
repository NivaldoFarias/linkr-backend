import db from './../database/index.js';

async function deleteHashtagsPostsByPostId(postId) {
    const query = `
        DELETE FROM hashtags_posts 
        WHERE post_id=$1
    `;
    const response = await db.query(query, [postId]);
    return response.rows[0];
}

export async function findHashtagPost(hashtagId, postId) {
    const query = `
        SELECT * FROM hashtags_posts WHERE hashtag_id = $1 AND post_id = $2;
    `;
    const response = await db.query(query, [hashtagId, postId]);
    return response.rows[0];
}

export async function createHashtagPost(hashtagId, postId) {
    const query = `
          INSERT INTO hashtags_posts (hashtag_id, post_id) VALUES ($1, $2) RETURNING *;`;
    const response = await db.query(query, [hashtagId, postId]);
    return response.rows[0];
}

export async function deleteHashtagPost(id) {
    const query = `
        DELETE FROM hashtags_posts WHERE id = $1;
    `;
    const response = await db.query(query, [id]);
    return response.rows[0];
}

export async function findHashtagsPostsByPostId(postId) {
    const query = `
        SELECT hp.*, h.name AS hashtag
        FROM hashtags_posts hp 
        LEFT JOIN hashtags h ON hp.hashtag_id = h.id
        WHERE hp.post_id = $1;
    `;
    const response = await db.query(query, [postId]);
    return response.rows;
}

export const hashtagsPostsRepository = {
    deleteHashtagsPostsByPostId,
    findHashtagPost,
    createHashtagPost,
    findHashtagsPostsByPostId,
    deleteHashtagPost,
}
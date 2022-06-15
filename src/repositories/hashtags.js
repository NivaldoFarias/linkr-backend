import db from '../database/index.js';

async function getHashtagIdByName(hashtag) {
    const query = `
        SELECT * FROM hashtags WHERE "name" = $1;
    `
    const response = await db.query(query, [hashtag]);
    return response.rows[0].id;
}

async function getHashtagPostsByHashtagId(hashtagId) {
    const query = `
        SELECT p.* FROM posts p
        JOIN hashtags_posts hp ON p.id = hp.post_id
        WHERE hp.hashtag_id = $1;
    `
    const response = await db.query(query, [hashtagId]);
    console.log(response);
    return response.rows;
}

async function getTrendingHashtags(hashtag) {
    const query = `
        SELECT 
            h.*,
            COUNT(l.id) AS likes_count,
            COUNT(p.id) AS posts_count
        FROM hashtags h 
        JOIN hashtags_posts hp ON h.id = hp.hashtag_id
        JOIN posts p ON hp.post_id = p.id
        JOIN likes l ON p.id = l.post_id
        GROUP BY h.id
        ORDER BY likes_count DESC, posts_count DESC
        LIMIT 10;
    `;
    console.log(query);
    const response = await db.query(query);
    return response.rows;
}

export const hashtagRepository = {
    getHashtagIdByName,
    getHashtagPostsByHashtagId,
    getTrendingHashtags
}
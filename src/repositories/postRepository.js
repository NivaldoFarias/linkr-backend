import db from "../database/index.js";

async function insertPost(text, url, user_id) {
    return db.query(`
        INSERT INTO posts (text, url, user_id)
        VALUES ($1, $2, $3)
    `, [text, url, user_id]);
}

const postRepository = {
    insertPost
}

export default postRepository;
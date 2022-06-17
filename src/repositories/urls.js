import db from '../database/index.js';

async function findUrl(url) {
    const query = `SELECT * FROM urls WHERE url=$1`;
    const result = await db.query(query, [url]);
    return result.rows[0] ?? null;
}

async function createUrl(url, title, description, imageUrl) {
    const query = `
    INSERT INTO urls (url, title, description, image_url)
    VALUES ($1, $2, $3, $4) RETURNING *`;
    const result = await db.query(query, [url, title, description, imageUrl]);
    return result.rows[0] ?? null;
}

export const urlsRepository = { findUrl, createUrl }
const getPostsByUserId = async (id) => {

    const searchQuery = `
        SELECT posts.id, posts.text, posts.url, posts.created_at as 'createdAt'
        FROM posts
        WHERE posts.user_id = $1;
    `;
    const posts = await db.query(searchQuery,[id]);
    return posts;
};

export default getPostsByUserId;
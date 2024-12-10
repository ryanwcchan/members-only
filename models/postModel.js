const pool = require("../db/pool");

const postModel = {
  async createPost(post, req) {
    if (!req.session.passport.user) {
      throw new Error("You must be logged in to create a post.");
    }

    const query = `INSERT INTO posts (title, content, date_created, user_id) VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [
      post.title,
      post.content,
      new Date(),
      req.session.passport.user,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getAllPosts() {
    const query = `
        SELECT 
            posts.*,
            users.first_name,
            users.last_name,
            users.email,
            users.role
        FROM posts
        JOIN users ON posts.user_id = users.user_id
        `;
    const result = await pool.query(query);
    return result.rows;
  },
};

module.exports = postModel;

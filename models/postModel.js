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

  async getRecentPosts() {
    const query = `
        SELECT 
            posts.*,
            users.username,
            users.first_name,
            users.last_name,
            users.email,
            users.role
        FROM posts
        JOIN users ON posts.user_id = users.user_id
        ORDER BY posts.date_created DESC
        LIMIT 5
        `;
    const result = await pool.query(query);
    return result.rows;
  },

  async deletePost(post_id) {
    const query = `DELETE FROM posts WHERE post_id = $1`;
    const result = await pool.query(query, [post_id]);
    return result.rows[0];
  },

  async getPostByUser(user_id) {
    const query = `SELECT * FROM posts WHERE user_id = $1`;
    const result = await pool.query(query, [user_id]);
    return result.rows;
  },

  async getPostById(post_id) {
    const query = `SELECT * FROM posts WHERE post_id = $1`;
    const result = await pool.query(query, [post_id]);
    return result.rows[0];
  },
};

module.exports = postModel;

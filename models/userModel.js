const pool = require("../db/pool");

const userModel = {
  async createUser({ username, password }) {
    const query = `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`;
    const values = [username, password];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getUserByUsername(username) {
    const query = `SELECT * FROM users WHERE username = $1`;
    const result = await pool.query(query, [username]);
    return result.rows[0];
  },
};

module.exports = userModel;

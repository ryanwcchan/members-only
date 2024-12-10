const pool = require("../db/pool");

const userModel = {
  async createUser({
    username,
    firstName,
    lastName,
    email,
    password,
    dateCreated = new Date(),
    role = "user",
  }) {
    const query = `INSERT INTO users (username, first_name, last_name, email, password, date_created, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const values = [
      username,
      firstName,
      lastName,
      email,
      password,
      dateCreated,
      role,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getUserByUsername(username) {
    const query = `SELECT * FROM users WHERE username = $1`;
    const result = await pool.query(query, [username]);
    return result.rows[0];
  },

  // async getFirstName(firstName) {
  //   const query = `SELECT * FROM users WHERE first_name = $1`;
  //   const result = await pool.query(query, [firstName]);
  //   return result.rows[0];
  // },

  // async getLastName(lastName) {
  //   const query = `SELECT * FROM users WHERE last_name = $1`;
  //   const result = await pool.query(query, [lastName]);
  //   return result.rows[0];
  // },

  async getUserById(user_id) {
    const query = `SELECT * FROM users WHERE user_id = $1`;
    const result = await pool.query(query, [user_id]);
    return result.rows[0];
  },
};

module.exports = userModel;

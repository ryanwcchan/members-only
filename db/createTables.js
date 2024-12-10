const pool = require("./pool");

const createTables = async () => {
  try {
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            user_id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            role VARCHAR(255) NOT NULL
        );
        `;

    const createPostsTable = `
        CREATE TABLE IF NOT EXISTS posts (
            post_id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            user_id INT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
    );
    `;

    await pool.query(createUsersTable);
    console.log("Users table created successfully");

    await pool.query(createPostsTable);
    console.log("Posts table created successfully");
  } catch (err) {
    console.log("Error creating tables:", err);
  } finally {
    pool.end();
  }
};

createTables();

const pool = require("../db/pool");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const result = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      const user = result.rows[0];
      console.log("user fetched from DB:", user);

      if (!user) {
        return done(null, false, { message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  console.log("Serializing user:", user); // Debugging
  done(null, user.user_id);
});

passport.deserializeUser(async (user_id, done) => {
  try {
    console.log("Deserializing user ID:", user_id);
    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      user_id,
    ]);
    const user = result.rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;

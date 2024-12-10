const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

const userController = {
  async registerUser(req, res) {
    try {
      const { username, fname, lname, email, password, confirmPassword } =
        req.body;

      // Validate required fields
      if (!username || !password || !email) {
        return res
          .status(400)
          .render("sign-up", { errorMessage: "Required fields are missing" });
      }
      if (password !== confirmPassword) {
        return res
          .status(400)
          .render("sign-up", { errorMessage: "Passwords do not match" });
      }

      const existingUser = await userModel.getUserByUsername(username);

      if (existingUser) {
        return res
          .status(400)
          .render("sign-up", { errorMessage: "Username already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await userModel.createUser({
        username,
        firstName: fname,
        lastName: lname,
        email,
        password: hashedPassword,
        dateCreated: new Date(),
        role: "user",
      });

      console.log(user);
      res.status(201).render("login-page", { errorMessage: null });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .render("sign-up", { errorMessage: "Internal Server Error" });
    }
  },

  async loginUser(req, res) {
    try {
      const { username, password } = req.body;

      const user = await userModel.getUserByUsername(username);

      if (!user) {
        return res
          .status(401)
          .render("login-page", { errorMessage: "Invalid credentials" });
      }

      // Compare the password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res
          .status(401)
          .render("login-page", { errorMessage: "Invalid credentials" });
      }

      req.session.user = {
        user_id: user.user_id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
      };

      // Check if session is set
      console.log("req.session.user: ", req.session.user);

      req.login(user, (err) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .render("login-page", { errorMessage: "Internal Server Error" });
        }
        res.status(200).redirect("/");
      });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .render("login-page", { errorMessage: "Internal Server Error" });
    }
  },

  async getUserById(req, res) {
    try {
      const user_id = req.params.user_id;
      const user = await userModel.getUserById(user_id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = userController;

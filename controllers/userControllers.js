const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

const userController = {
  async registerUser(req, res) {
    try {
      const { username, password } = req.body;

      const existingUser = await userModel.getUserByUsername(username);

      if (existingUser) {
        return res
          .status(400)
          .redirect("sign-up", { errorMessage: "Username already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await userModel.createUser({
        username,
        password: hashedPassword,
      });
      res.status(201).redirect("/login-page");
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .redirect("sign-up", { errorMessage: "Internal Server Error" });
    }
  },

  async loginUser(req, res) {
    try {
      const { username, password } = req.body;

      const user = await userModel.getUserByUsername(username);

      if (!user) {
        return res
          .status(401)
          .redirect("login-page", { errorMessage: "Invalid credentials" });
      }

      // Compare the password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res
          .status(401)
          .redirect("login-page", { errorMessage: "Invalid credentials" });
      }

      res.status(200).redirect("/");
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .redirect("login-page", { errorMessage: "Internal Server Error" });
    }
  },
};

module.exports = userController;

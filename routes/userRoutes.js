const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");

router.post("/sign-up", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .render("login-page", { errorMessage: "Internal Server Error" });
    }
    res.redirect("/login");
  });
});

router.get("/users/:user_id", userController.getUserById);
// router.get("/users", userController.getAllUsers);

module.exports = router;

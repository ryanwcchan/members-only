const express = require("express");
const router = express.Router();
const postController = require("../controllers/postControllers");

router.post("/create-post", postController.createPost);
router.get("/posts", postController.getAllPosts);

module.exports = router;

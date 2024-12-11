const express = require("express");
const router = express.Router();
const postController = require("../controllers/postControllers");

router.post("/create-post", postController.createPost);
router.get("/posts", postController.getAllPosts);
// router.get("/posts/:id", postController.getPostById);
router.delete("/post/:post_id", postController.deletePost);

module.exports = router;

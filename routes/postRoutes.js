const express = require("express");
const router = express.Router();
const postController = require("../controllers/postControllers");
const pool = require("../db/pool");

// const authorizeDelete = async (req, res, next) => {
//   const post_id = req.params.post_id;
//   const user_id = req.user.user_id;
//   const user_role = req.user.role;

//   try {
//     const query = `SELECT * FROM posts WHERE post_id = $1`;
//     const result = await pool.query(query, [post_id]);

//     if (result.rows.length === 0) {
//       return res.status(404).send("Post not found");
//     }

//     const postOwnerId = result.rows[0].user_id;

//     if ((postOwnerId = user_id || user_role === "admin")) {
//       next();
//     } else {
//       return res
//         .status(403)
//         .send("You do not have permission to delete this post");
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send("Internal Server Error");
//   }
// };

router.post("/create-post", postController.createPost);
router.get("/posts", postController.getAllPosts);
router.get("/posts/:post_id", postController.getPostById);
router.delete("/post/:post_id", postController.deletePost);

module.exports = router;

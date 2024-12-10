const postModel = require("../models/postModel");

const postController = {
  async createPost(req, res) {
    try {
      const post = req.body;
      const newPost = await postModel.createPost(post, req);

      res.status(201).json(newPost);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAllPosts(req, res) {
    try {
      const posts = await postModel.getAllPosts();
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = postController;

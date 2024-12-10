const postModel = require("../models/postModel");
const { post } = require("../routes/userRoutes");

const postController = {
  async createPost(req, res) {
    try {
      const post = req.body;
      await postModel.createPost(post, req);

      res.redirect("/posts");
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAllPosts(req, res) {
    try {
      let posts = await postModel.getAllPosts();

      posts.forEach((post) => {
        const date = new Date(post.date_created);
        post.formatted_date = `${date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}, ${date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })}`;
      });

      posts = posts.sort(
        (a, b) => new Date(b.date_created) - new Date(a.date_created)
      );

      res.render("posts", { posts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  async getPostByUser(req, res) {
    try {
      const user_id = req.params.user_id;
      const posts = await postModel.getPostByUser(user_id);
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getRecentPosts(req, res) {
    try {
      const recentPosts = await postModel.getRecentPosts();

      recentPosts.forEach((post) => {
        const date = new Date(post.date_created);
        post.formatted_date = `${date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}, ${date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })}`;
      });

      res.render("index", { posts: recentPosts });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = postController;

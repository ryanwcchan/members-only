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

      const user_id = req.user ? req.user.user_id : null;

      res.render("posts", { posts, user_id });
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

  async deletePost(req, res) {
    try {
      const post_id = req.params.post_id;

      const post = await postModel.getPostById(post_id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      if (post.user_id !== req.user.user_id && req.user.role !== "admin") {
        return res
          .status(403)
          .json({ error: "You do not have permission to delete this post" });
      }

      await postModel.deletePost(post_id);
      res.redirect("/posts");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getPostById(req, res) {
    try {
      const post_id = req.params.post_id;
      console.log("Post ID:", post_id);
      const post = await postModel.getPostById(post_id);

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

      if (!post) {
        return res.status(404).render("404", { message: "Post not found" });
      }

      console.log("Post:", post);

      res.render("post-page", {
        post,
        user_id: req.user ? req.user.user_id : null,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = postController;

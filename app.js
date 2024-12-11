const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const browserSync = require("browser-sync").create();
const passport = require("./config/passport.js");
const pool = require("./db/pool.js");

const session = require("express-session");
// const PgSession = require("connect-pg-simple")(session);

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
  } else {
    console.log("Database connected. Current time:", res.rows[0].now);
  }
});

// JSON and Form data Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files middleware
app.use(express.static(path.join(__dirname, "public")));

// Session middleware
app.use(
  session({
    // store: new PgSession({
    //   pool: pool,
    // }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log("Session Object:", req.session);
  console.log("User Object:", req.user);
  res.locals.user = req.user || null;
  next();
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const postController = require("./controllers/postControllers.js");

app.get("/", postController.getRecentPosts);

app.get("/sign-up", isAuthenticated, (req, res) => {
  res.render("sign-up", { errorMessage: null });
});

app.get("/login", isAuthenticated, (req, res) => {
  res.render("login-page", { errorMessage: null });
});

app.get("/profile", checkAuthenticated, (req, res) => {
  res.render("profile", { user: req.user });
});

app.get("/create-post", checkAuthenticated, (req, res) => {
  res.render("create-post", { user: req.user });
});

const authorizeDelete = async (req, res, next) => {
  const post_id = req.params.post_id;
  const user_id = req.user.user_id;
  const user_role = req.user.role;

  try {
    const query = `SELECT * FROM posts WHERE post_id = $1`;
    const result = await pool.query(query, [post_id]);

    if (result.rows.length === 0) {
      return res.status(404).send("Post not found");
    }

    const postOwnerId = result.rows[0].user_id;

    if ((postOwnerId = user_id || user_role === "admin")) {
      next();
    } else {
      return res
        .status(403)
        .send("You do not have permission to delete this post");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

// Routes
const userRoutes = require("./routes/userRoutes.js");

app.use("/", userRoutes);

const postRoutes = require("./routes/postRoutes.js");

app.use("/", postRoutes);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.listen(port, console.log(`Server running on http://localhost:${port}`));

// Initialize BrowserSync
browserSync.init({
  proxy: `http://localhost:${port}`,
  files: ["public/**/*.*", "views/**/*.ejs"], // Watch these files for changes
  notify: false, // Disable the notification in the browser
  open: false, // Don't automatically open the browser window
});

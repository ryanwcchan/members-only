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

const postModel = require("./models/postModel.js");

app.get("/profile", checkAuthenticated, async (req, res) => {
  try {
    const userPosts = await postModel.getPostByUser(req.user.user_id);

    userPosts.forEach((post) => {
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

    res.render("profile", { user: req.user, posts: userPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/create-post", checkAuthenticated, (req, res) => {
  res.render("create-post", { user: req.user });
});

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

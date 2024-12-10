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

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

app.get("/posts", (req, res) => {
  res.render("posts");
});

app.get("/sign-up", isAuthenticated, (req, res) => {
  res.render("sign-up", { errorMessage: null });
});

app.get("/login", isAuthenticated, (req, res) => {
  res.render("login-page", { errorMessage: null });
});

app.get("/profile", checkAuthenticated, (req, res) => {
  res.render("profile", { user: req.user });
});

// Routes
const userRoutes = require("./routes/userRoutes.js");

app.use("/auth", userRoutes);

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

const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const browserSync = require("browser-sync").create();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, console.log(`Server running on http://localhost:${port}`));

// Initialize BrowserSync
browserSync.init({
  proxy: `http://localhost:${port}`,
  files: ["public/**/*.*", "views/**/*.ejs"], // Watch these files for changes
  notify: false, // Disable the notification in the browser
  open: false, // Don't automatically open the browser window
});

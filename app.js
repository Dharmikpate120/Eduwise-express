const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "Public")));
app.use((req, res, next) => {
  if (req.path.endsWith(".css")) {
    res.setHeader("Content-Type", "text/css");
  }
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const indexRoutes = require("./routes/index.routes");
const adminRoutes = require("./routes/adminRoutes");
app.use("/", indexRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

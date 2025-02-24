const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

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
app.use("/admin", adminRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

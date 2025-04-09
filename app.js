const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const indexRoutes = require("./routes/index.routes");
const adminRoutes = require("./routes/adminRoutes");
const openTestRoutes = require("./routes/openTestRoutes");
const userRoutes = require("./routes/userRoutes");
const currentAffairRoutes = require("./routes/currentAffairsRoutes");

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

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  if (req.path.endsWith(".css")) {
    res.setHeader("Content-Type", "text/css");
  }
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Backend Routes
app.use("/", indexRoutes);
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/opentest", openTestRoutes);
app.use("/currentaffairData", currentAffairRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

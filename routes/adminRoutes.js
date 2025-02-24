const express = require("express");
const router = express.Router();
const updates = require("../utils/updates.json");
router.get("/", (req, res) => {
  res.render("index", { Resources });
});
module.exports = router;

const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const {
  verifyAdminToken,
  verifyUserToken,
  verifyTestToken,
} = require("../utils/middleware/verifyToken");
const CurrentAffairSchema = require("../utils/schema/CurrentAffailrs");
require("dotenv").config();

const storage = multer.diskStorage({
  destination: "./public/currentAffairsAssets",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // Limit file size to 10MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).fields([
  { name: "coverImage", maxCount: 1 },
  { name: "headerImage", maxCount: 1 },
]);
const upload1 = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

function checkFileType(file, cb) {
  // Allowed file extensions
  const filetypes = /(jpe?g|png|webp|heic|heif)$/i;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname));
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images only!");
  }
}

//admin routes
router.post("/admin/addcurrentaffair", verifyAdminToken, async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.json(err);
    }
    //file existance validation
    if (!req.files.headerImage || !req.files?.headerImage[0]) {
      if (!req.files.coverImage || !req.files?.coverImage[0]) {
        return res.status(400).json({ error: "Missing field entries!" });
      }
      fs.unlinkSync(
        `./public/currentAffairsAssets/${req.files.coverImage[0].filename}`
      );
      return res.status(400).json({ error: "Missing file entries!" });
    } else if (!req.files.coverImage || !req.files?.coverImage[0]) {
      if (!req.files.headerImage || !req.files?.headerImage[0]) {
        return res.status(400).json({ error: "Missing file entries!" });
      }
      fs.unlinkSync(
        `./public/currentAffairsAssets/${req.files.headerImage[0].filename}`
      );
      return res.status(400).json({ error: "Missing file entries!" });
    }
    //fields existance validation
    const { title, content, writer } = req.body;

    if (!title || !content || !writer) {
      return res.status(400).json({ error: "Missing parameters!" });
    }
    try {
      var {
        headerImage: [{ filename: headerImage }],
        coverImage: [{ filename: coverImage }],
      } = req.files;
      var result = new CurrentAffairSchema({
        title,
        content,
        writer,
        headerImage,
        coverImage,
        date: Date.now(),
        views: 0,
        deleted: false,
      });
      await result.save();

      res.json({
        success: "Current Affair added successfully!",
        title,
        content,
        writer,
      });
    } catch (err) {
      fs.unlinkSync(
        `./public/currentAffairsAssets/${req.files.headerImage[0].filename}`
      );
      fs.unlinkSync(
        `./public/currentAffairsAssets/${req.files.coverImage[0].filename}`
      );
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error!" });
    }
  });
});

router.post(
  "/admin/removecurrentaffair",
  verifyAdminToken,
  upload1.none(),
  async (req, res) => {
    try {
      const result = await CurrentAffairSchema.findOne({ _id: req.body.id });
      if (result.deleted) {
        return res
          .status(400)
          .json({ error: "current affair deleted already!" });
      }
      result.deleted = true;
      await result.save();
      return res.json({ success: "current affair deleted successfully!" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error!" });
    }
  }
);

router.post(
  "/admin/fetchdeletedcurrentaffair",
  verifyAdminToken,
  async (_, res) => {
    try {
      var result = await CurrentAffairSchema.find({ deleted: true });
      res.json({ result });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error!" });
    }
  }
);
router.post(
  "/admin/restoredeletedcurrentaffair",
  verifyAdminToken,
  upload1.none(),
  async (req, res) => {
    try {
      try {
        var result = await CurrentAffairSchema.findOne({
          _id: req.body.id,
        });
      } catch (err) {
        return res.status(422).json({ error: "Invalid current affair Id!" });
      }
      if (!result) {
        return res
          .status(400)
          .json({ error: "Please enter valid current affair Id!" });
      } else if (!result.deleted) {
        return res
          .status(400)
          .json({ error: "Current Affair with selected id is not deleted!" });
      }
      result.deleted = false;
      await result.save();
      res.json({ success: "Current Affair restored successfully!" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error!" });
    }
  }
);
router.post(
  "/admin/permenantlydeletecurrentaffair",
  verifyAdminToken,
  upload1.none(),
  async (req, res) => {
    try {
      const { id } = req.body;
      try {
        var result = await CurrentAffairSchema.findOne({ _id: id });
      } catch (error) {
        return res.status(400).json({ error: "please enter valid Id!" });
      }
      if (!result) {
        return res
          .status(422)
          .json({ error: "current affair with this Id doesn't exist!" });
      }
      if (!result.deleted) {
        return res
          .status(422)
          .json({ error: "You need to first move the current affair to Bin!" });
      }

      var result = await CurrentAffairSchema.deleteOne({ _id: id });
      res.json({ success: "Current Affair deleted successfully!" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error!" });
    }
  }
);

//user routes
router.post("/fetchcurrentaffairs", upload1.none(), async (req, res) => {
  try {
    var { latestFirst } = req.body;
    latestFirst =
      latestFirst === "true" || latestFirst === "false"
        ? latestFirst === "true"
          ? true
          : false
        : null;
    if (latestFirst === null) {
      return res.status(400).json({ error: "Invalid type for latestFirst!" });
    }
    var result = await CurrentAffairSchema.find({ deleted: false }).sort({
      date: latestFirst ? -1 : 1,
    });
    return res.json(result);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error!" });
  }
});

module.exports = router;

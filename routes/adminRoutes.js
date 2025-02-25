const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const UpdatesModel = require("../utils/schema/update");
const fs = require("fs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.JWT_SECRET_KEY;

const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 }, // Limit file size to 100MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("resourcePdf");

const upload1 = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

function checkFileType(file, cb) {
  // Allowed file extensions
  const filetypes = /pdf/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: pdfs Only!");
  }
}

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token" });
    }

    req.user = decoded;

    next();
  });
}

router.post("/adminsignin", upload1.none(), async (req, res) => {
  const { userName, password } = req.body;
  if (
    userName === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    try {
      const token = jwt.sign({ userName, password }, secretKey, {
        expiresIn: "10d",
      });
      res.json({ authorization: token });
    } catch (err) {
      console.log(err);
      res.json({ error: "error while signing in!" });
    }
  } else {
    res.json({ error: "invalid userName and Password Combination!" });
  }
});
router.post("/newUpdate", verifyToken, async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.send(err);
    } else {
      if (req.file == undefined) {
        res.json({ error: "No file selected!" });
      } else {
        const { subject, chapter } = req.body;
        var updates = await UpdatesModel.findOne({ subject });
        var chapters = updates.chapters.filter(
          (element) => chapter === element.title
        );
        if (chapters.length) {
          try {
            fs.unlinkSync(`./public/uploads/${req.file.filename}`);
            console.log("File deleted successfully");
          } catch (err) {
            console.error("Error deleting the file:");
          }
          return res.json({ error: "this chapter already exist" });
        }
        const result = await UpdatesModel.updateOne(
          { subject },
          {
            $push: {
              chapters: { title: chapter, resourcePdf: req.file.filename },
            },
          }
        );
        if (result.acknowledged) {
          res.json({ success: `New Update Added Successfully!` });
        } else {
          res.json({ error: "error adding new Update!" });
        }
      }
    }
  });
});
router.post("/changeUpdate", verifyToken, async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.send(err);
    } else {
      if (req.file == undefined) {
        res.json({ error: "No file selected!" });
      } else {
        const { chapter, subject } = req.body;
        var updates = await UpdatesModel.findOne({ subject });
        var chapters = updates.chapters.filter(
          (element) => chapter === element.title
        );
        if (!chapters.length) {
          try {
            fs.unlinkSync(`./public/uploads/${req.file.filename}`);
          } catch (err) {
            console.log(err);
          }
          return res.json({ error: "this chapter doesn't exist!" });
        }
        try {
          fs.unlinkSync(`./public/uploads/${chapters[0].resourcePdf}`);
        } catch (err) {
          console.error("Error deleting the file:");
        }
        const result = await UpdatesModel.updateOne(
          { subject, "chapters.title": chapter },
          { $set: { "chapters.$.resourcePdf": req.file.filename } }
        );
        if (result.acknowledged) {
          res.json({ success: `Update Changed Successfully!` });
        } else {
          res.json({ error: "error adding file" });
        }
      }
    }
  });
});
router.post("/deleteUpdate", verifyToken, upload1.none(), async (req, res) => {
  const { subject, chapter } = req.body;
  var updates = await UpdatesModel.findOne({ subject });
  var chapters = updates.chapters.filter(
    (element) => chapter === element.title
  );
  if (!chapters.length) {
    return res.json({ error: "this chapter doesn't exist" });
  }
  const result = await UpdatesModel.updateOne(
    { subject }, // Replace with your document's identifier
    { $pull: { chapters: { title: chapter } } }
  );
  if (result.acknowledged) {
    try {
      fs.unlinkSync(`./public/uploads/${chapters[0].resourcePdf}`);
    } catch (err) {
      console.log("Error deleting the file:");
    }
    return res.json({ success: "deleted successfully" });
  } else {
    return res.json({ error: "error deleting the chapter" });
  }
});

module.exports = router;

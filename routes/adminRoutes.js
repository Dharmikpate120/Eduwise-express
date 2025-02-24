const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const UpdatesModel = require("../utils/schema/update");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + "-" + file.originalname + path.extname(file.originalname)
    );
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

router.post("/newUpdate", async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.send(err);
    } else {
      if (req.file == undefined) {
        res.send("No file selected!");
      } else {
        const { chapter, subject } = req.body;
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
          return res.send("this chapter already exist");
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
          res.send(`File uploaded: ${req.file.filename}`);
        } else {
          res.send("error adding file");
        }
      }
    }
  });
});
router.post("/changeUpdate", async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.send(err);
    } else {
      if (req.file == undefined) {
        res.send("No file selected!");
      } else {
        const { chapter, subject } = req.body;
        var updates = await UpdatesModel.findOne({ subject });
        var chapters = updates.chapters.filter(
          (element) => chapter === element.title
        );
        if (!chapters.length) {
          try {
            fs.unlinkSync(`./public/uploads/${req.file.filename}`);
            console.log("File deleted successfully");
          } catch (err) {
            console.error("Error deleting the file:");
          }
          return res.send("this chapter doesn't exist!");
        }
        try {
          fs.unlinkSync(`./public/uploads/${chapters[0].resourcePdf}`);
          console.log("File deleted successfully");
        } catch (err) {
          console.error("Error deleting the file:");
        }
        const result = await UpdatesModel.updateOne(
          { subject, "chapters.title": chapter },
          { $set: { "chapters.$.resourcePdf": req.file.filename } }
        );
        if (result.acknowledged) {
          res.send(`File uploaded: ${req.file.filename}`);
        } else {
          res.send("error adding file");
        }
      }
    }
  });
});
router.post("/deleteUpdate", upload1.none(), async (req, res) => {
  const { subject, chapter } = req.body;
  var updates = await UpdatesModel.findOne({ subject });
  var chapters = updates.chapters.filter(
    (element) => chapter === element.title
  );
  if (!chapters.length) {
    return res.send("this chapter doesn't exist");
  }
  const result = await UpdatesModel.updateOne(
    { subject }, // Replace with your document's identifier
    { $pull: { chapters: { title: chapter } } }
  );
  if (result.acknowledged) {
    try {
      fs.unlinkSync(`./public/uploads/${chapters[0].resourcePdf}`);
      console.log("File deleted successfully");
    } catch (err) {
      console.error("Error deleting the file:");
    }
    return res.send("deleted successfully");
  } else {
    return res.send("error deleting the chapter");
  }
});

module.exports = router;

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
      return res.json(err);
    }
    if (req.file == undefined) {
      return res.json({ error: "No file selected!" });
    }
    const { subject, chapter, language } = req.body;
    if (!subject || !chapter || !language) {
      return res.json({ error: "Not Enough Parameters Passed!" });
    }
    var updates = await UpdatesModel.findOne({
      subject,
    });
    if (!updates) {
      try {
        fs.unlinkSync(`./public/uploads/${req.file.filename}`);
        console.log("File deleted successfully");
      } catch (err) {
        console.error("Error deleting the file:");
      }
      return res.json({ error: "Invalid Subject Name!" });
    }
    var chapters = updates.chapters.find((chap) => chap.title === chapter);

    if (!chapters) {
      try {
        updates.chapters.push({
          title: chapter,
          language: [{ name: language, resourcePdf: req.file.filename }],
        });
        await updates.save();
        return res.json({ success: "Chapter added successfully!" });
      } catch (err) {
        console.log(err);
        try {
          fs.unlinkSync(`./public/uploads/${req.file.filename}`);
          console.log("File deleted successfully");
        } catch (err) {
          console.error("Error deleting the file:");
        }
        return res.json({
          error: "Internal Server Error, Please Try Again Later!",
        });
      }
    }
    var lg = chapters.language.find((lang) => lang.name === language);
    if (!lg) {
      try {
        chapters.language.push({
          name: language,
          resourcePdf: req.file.filename,
        });
        await updates.save();
        return res.json({
          success: "New Language In Chapter Added Successfully!",
        });
      } catch (err) {
        try {
          fs.unlinkSync(`./public/uploads/${req.file.filename}`);
          console.log("File deleted successfully");
        } catch (err) {
          console.error("Error deleting the file:");
        }
        console.log(err);
        return res.json({ error: "Internal Error Occured!" });
      }
    }
    try {
      fs.unlinkSync(`./public/uploads/${req.file.filename}`);
      console.log("File deleted successfully");
    } catch (err) {
      console.error("Error deleting the file:");
    }
    res.json({ error: "Chapter Already Exist!" });
    // updates = updates.chapters.find((chap) => chap.title === chapter);
    // console.log(updates);
    // console.log(updates);
    // var updates = await UpdatesModel.aggregate([
    //   { $match: { subject } },
    //   { $unwind: "$chapters" },
    //   {
    //     $match: { "chapters.title": chapter },
    //   },
    //   { $unwind: "$chapters.language" },
    //   { $match: { "chapters.language.name": language } },
    //   {
    //     $project: { resourcePdf: "$chapters.language.resourcePdf" },
    //   },
    // ]);
    // console.log(updates);
    // if (updates.length) {
    //   res.json({ error: "Chapter already exist!" });
    // }
    // const result = await UpdatesModel.updateOne(
    //   {
    //     subject,
    //     "chapters.title": chapter,
    //   },
    //   {
    //     $push: {
    //       "chapters.language": {
    //         title: language,
    //         resourcePdf: req.file.filename,
    //       },
    //     },
    //   }
    // );
    // console.log(result);
    // var chapters = updates?.chapters?.filter((element) => {
    //   return chapter === element.title;
    // });
    // console.log(chapters);
    // if (chapters.length) {
    //   chapters = chapters[0].language.filter((element) => {
    //     return element.title === language;
    //   });
    // } else {
    // const result = await UpdatesModel.updateOne(
    //   { subject },
    //   {
    //     $push: {
    //       chapters: {
    //         title: chapter,
    //         language: [
    //           { title: language, resourcePdf: req.file.filename },
    //         ],
    //       },
    //     },
    //   }
    // );
    // return res.json(result);
    // }
    // console.log(chapters);
    // if (chapters.length) {
    //   try {
    //     fs.unlinkSync(`./public/uploads/${req.file.filename}`);
    //     console.log("File deleted successfully");
    //   } catch (err) {
    //     console.error("Error deleting the file:");
    //   }
    //   return res.json({ error: "this chapter already exist" });
    // }
    // const result = await UpdatesModel.updateOne(
    //   { subject },
    //   {
    //     $push: {
    //       chapters: { title: chapter, resourcePdf: req.file.filename },
    //     },
    //   }
    // );
    //   var result = { acknowledged: true };
    //   if (result.acknowledged) {
    //     res.json({ success: `New Update Added Successfully!` });
    //   } else {
    //     res.json({ error: "error adding new Update!" });
    //   }
  });
});
router.post("/changeUpdate", verifyToken, async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.send(err);
    }
    if (req.file == undefined) {
      return res.json({ error: "No file selected!" });
    }
    const { chapter, subject, language } = req.body;
    if (!subject || !chapter || !language) {
      return res.json({ error: "Not Enough Parameters Passed!" });
    }
    var updates = await UpdatesModel.findOne({ subject });
    if (!updates) {
      try {
        fs.unlinkSync(`./public/uploads/${req.file.filename}`);
        console.log("File deleted successfully");
      } catch (err) {
        console.error("Error deleting the file:");
      }
      return res.json({ error: "Invalid Subject Name!" });
    }
    var chapters = updates.chapters.find((chap) => chap.title === chapter);
    console.log(chapters, updates);
    if (!chapters) {
      try {
        fs.unlinkSync(`./public/uploads/${req.file.filename}`);
        console.log("File deleted successfully");
      } catch (err) {
        console.error("Error deleting the file:");
      }
      return res.json({ error: "this chapter doesn't exist!" });
    }
    var lg = chapters.language.find((lg) => lg.name === language);
    if (!lg) {
      try {
        fs.unlinkSync(`./public/uploads/${req.file.filename}`);
        console.log("File deleted successfully");
      } catch (err) {
        console.error("Error deleting the file:");
        return res.json({ error: "Internal Server Error!" });
      }
      return res.json({ error: "This Chapter doesn't have Given Language!" });
    }
    try {
      fs.unlinkSync(`./public/uploads/${lg.resourcePdf}`);
      console.log("File deleted successfully");
    } catch (err) {
      console.error("Error deleting the file:");
      return res.json({ error: "Internal Server Error!" });
    } finally {
      try {
        lg.resourcePdf = req.file.filename;
        await updates.save();
        res.json({ success: "Chapter Updated Successfully!" });
      } catch (err) {
        console.log(err);
        try {
          fs.unlinkSync(`./public/uploads/${req.file.filename}`);
          console.log("File deleted successfully");
        } catch (err) {
          console.error("Error deleting the file:");
        }
        return res.json({ error: "Internal Server Error!" });
      }
    }
    // try {
    //   fs.unlinkSync(`./public/uploads/${chapters[0].resourcePdf}`);
    // } catch (err) {
    //   console.error("Error deleting the file:");
    // }
    // const result = await UpdatesModel.updateOne(
    //   { subject, "chapters.title": chapter },
    //   { $set: { "chapters.$.resourcePdf": req.file.filename } }
    // );
    // var result = { acknowledged: true };
    // if (result.acknowledged) {
    //   res.json({ success: `Update Changed Successfully!` });
    // } else {
    //   res.json({ error: "error adding file" });
    // }
  });
});
router.post("/deleteUpdate", verifyToken, upload1.none(), async (req, res) => {
  const { subject, chapter, language } = req.body;
  if (!subject || !chapter || !language) {
    return res.json({ error: "Not Enough Parameters Passed!" });
  }
  var updates = await UpdatesModel.findOne({ subject });
  if (!updates) {
    return res.json({ error: "Invalid Subject Name!" });
  }
  var chapters = updates.chapters.find((chap) => chap.title === chapter);
  if (!chapters) {
    return res.json({ error: "this chapter doesn't exist!" });
  }
  var lg = chapters.language.find((lg) => lg.name === language);
  if (!lg) {
    return res.json({ error: "Selected Chapter Doesn't Even Exist!" });
  }
  try {
    chapters.language = chapters.language.filter((lg) => lg.name !== language);

    await updates.save();
    try {
      fs.unlinkSync(`./public/uploads/${lg.resourcePdf}`);
      console.log("File deleted successfully");
      res.json({ success: "Chapter Deleted Successfully!" });
    } catch (err) {
      console.error("Error deleting the file:", err);
      return res.json({ error: "Internal Server Error!" });
    }
  } catch (err) {
    console.log(err);
    res.json({ error: "Internal Server Error!" });
  }
  // const result = await UpdatesModel.updateOne(
  //   { subject }, // Replace with your document's identifier
  //   { $pull: { chapters: { title: chapter } } }
  // );
  // var result = { acknowledged: true };
  // if (result.acknowledged) {
  // try {
  //   fs.unlinkSync(`./public/uploads/${chapters[0].resourcePdf}`);
  // } catch (err) {
  //   console.log("Error deleting the file:");
  // }
  //   return res.json({ success: "deleted successfully" });
  // } else {
  //   return res.json({ error: "error deleting the chapter" });
  // }
});

module.exports = router;

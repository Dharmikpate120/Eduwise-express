const express = require("express");
const router = express.Router();
const cfdata = require("../demodata");
const UpdatesModel = require("../utils/schema/update");
var updates = require("../utils/updates.json");
const CurrentAffairSchema = require("../utils/schema/CurrentAffailrs");
const OpenTestModel = require("../utils/schema/OpenTests");
const Resources = [
  {
    title: "Economics",
    link: "/resources/economics",
    more: [
      { title: "Class 9", link: `/resources/economics/class9` },
      { title: "Class 10", link: `/resources/economics/class10` },
      { title: "Class 11", link: `/resources/economics/class11` },
      { title: "Class 12", link: `/resources/economics/class12` },
    ],
  },
  {
    title: "Geography",
    link: "/resources/geography",
    more: [
      { title: "Class 6", link: `/resources/geography/class6` },
      { title: "Class 7", link: `/resources/geography/class7` },
      { title: "Class 8", link: `/resources/geography/class8` },
      { title: "Class 9", link: `/resources/geography/class9` },
      { title: "Class 10", link: `/resources/geography/class10` },
      { title: "Class 11", link: `/resources/geography/class11` },
      { title: "Class 12", link: `/resources/geography/class12` },
    ],
  },
  {
    title: "History",
    link: "/resources/history",
    more: [
      { title: "Class 6", link: `/resources/history/class6` },
      { title: "Class 7", link: `/resources/history/class7` },
      { title: "Class 8", link: `/resources/history/class8` },
      { title: "Class 9", link: `/resources/history/class9` },
      { title: "Class 10", link: `/resources/history/class10` },
      { title: "Class 11", link: `/resources/history/class11` },
      { title: "Class 12", link: `/resources/history/class12` },
    ],
  },
  {
    title: "Polity",
    link: "/resources/polity",
    more: [
      { title: "Class 9", link: `/resources/polity/class9` },
      { title: "Class 10", link: `/resources/polity/class10` },
      { title: "Class 11", link: `/resources/polity/class11` },
      { title: "Class 12", link: `/resources/polity/class12` },
    ],
  },
  {
    title: "Sociology",
    link: "/resources/sociology",
    more: [
      { title: "Class 11", link: `/resources/sociology/class11` },
      { title: "Class 12", link: `/resources/sociology/class12` },
    ],
  },
];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
router.get("/", async (req, res) => {
  updates = await UpdatesModel.find({});
  res.render("index", { Resources, updates });
});

router.get("/updates/:subject/:chapter", async (req, res) => {
  updates = await UpdatesModel.find({});

  const subject = req.params.subject;
  const chapter = req.params.chapter;

  var content = await UpdatesModel.findOne(
    { subject, "chapters.title": chapter },
    { "chapters.$": 1 }
  );
  if (!content) {
    content = { warning: "The requested chapter Doesn't exist!" };
  } else {
    content = content.chapters[0];
  }

  res.render("updates", { Resources, updates, content, subject });
});

router.get("/resources/:subject/:className", async (req, res) => {
  updates = await UpdatesModel.find({});
  const subject = req.params.subject;
  const className = req.params.className;
  const booksAPI = {
    economics: {
      class9: {
        hindi: {
          part1: "../../assets/books/economics-hindi-ncert-class-9.pdf",
        },
        english: {
          part1: "../../assets/books/economics-ncert-class-9 (1).pdf",
        },
      },
      class10: {
        hindi: {
          part1: "../../assets/books/economics-hindi-ncert-class-10.pdf",
        },
        english: {
          part1:
            "../../assets/books/economics-ncert-class-10-indian-economic-development.pdf",
        },
      },
      class11: {
        hindi: {
          part1: "../../assets/books/economics-hindi-ncert-class-11.pdf",
        },
        english: {
          part1:
            "../../assets/books/economics-ncert-class-11-indian-economic-development.pdf",
        },
      },
      class12: {
        hindi: {
          part1: "../../assets/books/economics-hindi-ncert-class-12-part-1.pdf",
          part2: "../../assets/books/economics-hindi-ncert-class-12-part-2.pdf",
        },
        english: {
          part1: "../../assets/books/micro-economics-ncert-class-12-part-1.pdf",
          part2: "../../assets/books/micro-economics-ncert-class-12-part-2.pdf",
        },
      },
    },
    geography: {
      class6: {
        hindi: {
          part1: "../../assets/books/geography-hindi-ncert-class-6.pdf",
        },
        english: {
          part1:
            "../../assets/books/geography-ncert-class-6-social-science-the-earth-our-habitat (1).pdf",
        },
      },
      class7: {
        hindi: {
          part1: "../../assets/books/geography-hindi-ncert-class-7.pdf",
        },
        english: {
          part1:
            "../../assets/books/geography-ncert-class-7-social-science-our-environment.pdf",
        },
      },
      class8: {
        hindi: {
          part1: "../../assets/books/geography-hindi-ncert-class-8.pdf",
        },
        english: {
          part1:
            "../../assets/books/geography-ncert-class-8-social-science–resources-and-development.pdf",
        },
      },
      class9: {
        hindi: {
          part1: "../../assets/books/geography-hindi-ncert-class-9.pdf",
        },
        english: {
          part1:
            "../../assets/books/geography-ncert-class-9-social-science-contemporary-india-1.pdf",
        },
      },
      class10: {
        hindi: {
          part1: "../../assets/books/geography-hindi-ncert-class-10.pdf",
        },
        english: {
          part1:
            "../../assets/books/geography-ncert-class-10-social-science-contemporary-india-part-2.pdf",
        },
      },
      class11: {
        hindi: {
          part1: "../../assets/books/geography-hindi-ncert-class-11-part-1.pdf",
          part2: "../../assets/books/geography-hindi-ncert-class-11-part-2.pdf",
        },
        english: {
          part1:
            "../../assets/books/geography-ncert-class-11-fundamentals-of-physical-geography.pdf",
          part2:
            "../../assets/books/geography-ncert-class-11-india-physical-environment.pdf",
        },
      },
      class12: {
        hindi: {
          part1: "../../assets/books/geography-hindi-ncert-class-12-part-1.pdf",
          part2: "../../assets/books/geography-hindi-ncert-class-12-part-2.pdf",
        },
        english: {
          part1:
            "../../assets/books/geography-ncert-class-12-fundamentals-of-human-geography.pdf",
          part2:
            "../../assets/books/geography-ncert-class-12-india-people-and-economy.pdf",
        },
      },
    },
    history: {
      class6: {
        hindi: { part1: "../../assets/books/history-hindi-ncert-class-6.pdf" },
        english: {
          part1:
            "../../assets/books/history-ncert-class-6-social-science-our-past-1.pdf",
        },
      },
      class7: {
        hindi: { part1: "../../assets/books/history-hindi-ncert-class-7.pdf" },
        english: {
          part1:
            "../../assets/books/history-ncert-class-7-social-science-our-past-2.pdf",
        },
      },
      class8: {
        hindi: { part1: "../../assets/books/history-hindi-ncert-class-8.pdf" },
        english: {
          part1:
            "../../assets/books/history-ncert-class-8-social-science-our-past-3.pdf",
        },
      },
      class9: {
        hindi: { part1: "../../assets/books/history-hindi-ncert-class-9.pdf" },
        english: {
          part1:
            "../../assets/books/history-ncert-class-9-social-science-india-and-contemporary-world-1.pdf",
        },
      },
      class10: {
        hindi: { part1: "../../assets/books/history-hindi-ncert-class-10.pdf" },
        english: {
          part1:
            "../../assets/books/history-ncert-class-10-social-science-india-and-contemporary-world-2.pdf",
        },
      },
      class11: {
        hindi: { part1: "../../assets/books/history-hindi-ncert-class-11.pdf" },
        english: {
          part1:
            "../../assets/books/history-ncert-class-11-themes-in-world-history.pdf",
        },
      },
      class12: {
        hindi: {
          part1: "../../assets/books/history-hindi-ncert-class-12-part-1.pdf",
          part2: "../../assets/books/history-hindi-ncert-class-12-part-2.pdf",
          part3: "../../assets/books/history-hindi-ncert-class-12-part-3.pdf",
        },
        english: {
          part1:
            "../../assets/books/history-ncert-class-12-themes-in-indian-history-part-1.pdf",
          part2:
            "../../assets/books/history-ncert-class-12-themes-in-indian-history-part-2.pdf",
          part3:
            "../../assets/books/history-ncert-class-12-themes-in-indian-history-part-3.pdf",
        },
      },
    },
    polity: {
      class9: {
        hindi: {
          part1: "../../assets/books/polity-hindi-ncert-class-9-civics-1.pdf",
        },
        english: { part1: "../../assets/books/class 9 polity.pdf" },
      },
      class10: {
        hindi: {
          part1: "../../assets/books/polity-hindi-ncert-class-10-civics-2.pdf",
        },
        english: {
          part1:
            "../../assets/books/polity-ncert-class-10-democratic-politics-2.pdf",
        },
      },
      class11: {
        hindi: {
          part1:
            "../../assets/books/polity-hindi-ncert-class-11-political-science-1.pdf",
          part2:
            "../../assets/books/polity-hindi-ncert-class-11-political-science-2.pdf",
        },
        english: {
          part1:
            "../../assets/books/polity-ncert-class-11-indian-constitution-at-work.pdf",
          part2:
            "../../assets/books/polity-ncert-class-11-political-theory.pdf",
        },
      },
      class12: {
        hindi: {
          part1:
            "../../assets/books/polity-hindi-ncert-class-12-political-science.pdf",
        },
        english: {
          part1:
            "../../assets/books/polity-ncert-class-12-polity-politics-in-india-since-independence.pdf",
        },
      },
    },
    sociology: {
      class11: {
        hindi: {
          part1: "../../assets/books/sociology-hindi-ncert-class-11-part-1.pdf",
          part2: "../../assets/books/sociology-hindi-ncert-class-11-part-2.pdf",
        },
        english: {
          part1:
            "../../assets/books/sociology-ncert-class-11-part-1-introducing-sociology.pdf",
          part2:
            "../../assets/books/sociology-ncert-class-11-part-2-understanding-sociology.pdf",
        },
      },
      class12: {
        hindi: {
          part1: "../../assets/books/sociology-hindi-ncert-class-12-part-1.pdf",
          part2: "../../assets/books/sociology-hindi-ncert-class-12-part-2.pdf",
        },
        english: {
          part1:
            "../../assets/books/sociology-ncert-class-12-part-1-indian-society.pdf",
          part1:
            "../../assets/books/sociology-ncert-class-12-part-2-social-change-and-development.pdf",
        },
      },
    },
  };

  res.render("resources", {
    subject,
    className,
    Resources,
    updates,
    books: booksAPI[subject][className],
  });
});
router.get("/current-affairs", async (req, res) => {
  updates = await UpdatesModel.find({});
  var currentAffairs = await CurrentAffairSchema.find({ deleted: false }).sort({
    date: -1,
  });

  // var currentAffairs = [];
  res.render("current-affairs", {
    data: cfdata,
    Resources,
    updates,
    currentAffairs,
    monthNames,
  });
});

router.get("/mentorship", async (req, res) => {
  updates = await UpdatesModel.find({});
  res.render("mentorship", { Resources, updates });
});
router.get("/open-test", async (req, res) => {
  updates = await UpdatesModel.find({});

  res.render("open-test", { Resources, updates });
});

// admin routes
router.get("/admin-signin", async (req, res) => {
  updates = await UpdatesModel.find({});
  res.render("admin-signin", { Resources, updates });
});

router.get("/admin-dashboard", async (req, res) => {
  updates = await UpdatesModel.find({});
  res.render("admin-dashboard", { Resources, updates });
});
router.get("/admin-addupdates", async (req, res) => {
  updates = await UpdatesModel.find({});
  res.render("admin-addupdates", { Resources, updates });
});
router.get("/admin-changeupdates", async (req, res) => {
  updates = await UpdatesModel.find({});
  res.render("admin-changeupdates", { Resources, updates });
});
router.get("/admin-deleteupdates", async (req, res) => {
  updates = await UpdatesModel.find({});
  res.render("admin-deleteupdates", { Resources, updates });
});
router.get("/admin-currentaffair-add", async (req, res) => {
  updates = await UpdatesModel.find({});
  res.render("admin-ca-add", { Resources, updates });
});
router.get("/admin-currentaffair-bin", async (req, res) => {
  updates = await UpdatesModel.find({});
  var ca = await CurrentAffairSchema.find({ deleted: false });
  res.render("admin-ca-bin", { Resources, updates, ca, monthNames });
});
router.get("/admin-currentaffair-recycle-bin", async (req, res) => {
  updates = await UpdatesModel.find({});
  var ca = await CurrentAffairSchema.find({ deleted: true });
  res.render("admin-ca-recycle-bin", { Resources, updates, ca, monthNames });
});
router.get("/admin-opentest-add", async (req, res) => {
  updates = await UpdatesModel.find({});
  res.render("admin-ot-add", { Resources, updates });
});
router.get("/admin-opentest-delete", async (req, res) => {
  updates = await UpdatesModel.find({});
  var opentests = await OpenTestModel.find(
    {},
    { _id: 1, subject: 1, chapter: 1, standard: 1, teacher: 1, testName: 1 }
  );
  res.render("admin-ot-delete", { Resources, updates, opentests });
});

module.exports = router;

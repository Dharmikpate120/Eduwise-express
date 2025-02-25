const express = require("express");
const router = express.Router();
const cfdata = require("../demodata");
const UpdatesModel = require("../utils/schema/update");
var updates;
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
router.get("/", async (req, res) => {
  updates = await UpdatesModel.find({});
  res.render("index", { Resources, updates });
});

router.get("/updates/:subject/:chapter", async (req, res) => {
  if (!updates) {
    updates = await UpdatesModel.find({});
  }

  const subject = req.params.subject;
  const chapter = req.params.chapter;

  var content = await UpdatesModel.findOne(
    { subject, "chapters.title": chapter },
    { "chapters.$": 1 }
  );
  console.log(content);
  if (!content) {
    content = { warning: "The requested chapter Doesn't exist!" };
  } else {
    content = content.chapters[0];
  }

  res.render("updates", { Resources, updates, content, subject });
});

router.get("/resources/:subject/:className", async (req, res) => {
  if (!updates) {
    updates = await UpdatesModel.find({});
  }
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
  if (!updates) {
    updates = await UpdatesModel.find({});
  }
  res.render("current-affairs", { data: cfdata, Resources, updates });
});

router.get("/mentorship", async (req, res) => {
  if (!updates) {
    updates = await UpdatesModel.find({});
  }
  res.render("mentorship", { Resources, updates });
});
router.get("/open-test", async (req, res) => {
  if (!updates) {
    updates = await UpdatesModel.find({});
  }
  res.render("open-test", { Resources, updates });
});

// admin routes
router.get("/admin-signin", async (req, res) => {
  if (!updates) {
    updates = await UpdatesModel.find({});
  }
  res.render("admin-signin", { Resources, updates });
});

router.get("/admin-dashboard", async (req, res) => {
  updates = await UpdatesModel.find({});
  res.render("admin-dashboard", { Resources, updates });
});
// router.get("/about", async (req, res) => {
//   if (!updates) {
//     updates = await UpdatesModel.find({});
//   }
//   res.render("about", { Resources, updates });
// });

// router.get("/event", async (req, res) => {
//   if (!updates) {
//     updates = await UpdatesModel.find({});
//   }
//   res.render("event", { Resources, updates });
// });

// router.get("/forgot-password", (req, res) => {
//   res.render("forgot-password", { Resources });
// });

// router.get("/teacher-profile", (req, res) => {
//   res.render("teacher-profile", { Resources });
// });

// router.get("/team", (req, res) => {
//   res.render("team", { Resources });
// });

// router.get("/become-a-teacher", (req, res) => {
//   res.render("become-a-teacher", { Resources });
// });

// router.get("/course-details", (req, res) => {
//   res.render("course-details", { Resources });
// });
module.exports = router;

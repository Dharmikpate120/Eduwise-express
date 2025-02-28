const mongoose = require("mongoose");
const { Schema } = mongoose;

const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  resourcePdf: { type: String, required: true },
  // language: [languageSchema],
});

var Updates = new Schema({
  subject: { type: String, required: true },
  chapters: [chapterSchema],
});

const UpdatesModel =
  mongoose.models.Updates || mongoose.model("Updates", Updates);
module.exports = UpdatesModel;

const mongoose = require("mongoose");
const { Schema } = mongoose;

var currentaffair = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  writer: { type: String, required: true },
  date: { type: Number, required: true },
  coverImage: { type: String, required: true },
  headerImage: { type: String, required: true },
  views: { type: Number, required: true },
  deleted: { type: Boolean, default: false, required: true },
});

const CurrentAffairSchema =
  mongoose.models.currentaffair ||
  mongoose.model("currentaffair", currentaffair);
module.exports = CurrentAffairSchema;

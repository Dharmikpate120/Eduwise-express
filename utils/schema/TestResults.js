const mongoose = require("mongoose");
const { Schema } = mongoose;

const resultSchema = new mongoose.Schema({
  testId: { type: String, required: true },
  obtainedMarks: { type: Number, required: true },
  notAttempted: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  time: { type: String, required: true },
});
const pendingTestSchema = new mongoose.Schema({
  testId: { type: String, required: true },
  testToken: { type: String, required: true },
  starttime: { type: String, required: true },
});
var TestResults = new Schema({
  email: { type: String, required: true },
  tests: [resultSchema],
  pendingtest: pendingTestSchema,
});

const TestResultSchema =
  mongoose.models.TestResult || mongoose.model("TestResult", TestResults);
module.exports = TestResultSchema;

const mongoose = require("mongoose");

const FillBlankQuestionSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("fillblankquestions", FillBlankQuestionSchema);

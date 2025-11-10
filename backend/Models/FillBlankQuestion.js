const mongoose = require("mongoose");

const FillBlankQuestionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const FillBlankQuestion = mongoose.model(
  "fillblankquestions",
  FillBlankQuestionSchema
);

module.exports = FillBlankQuestion;

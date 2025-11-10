const mongoose = require("mongoose");

const TrueFalseQuestionSchema = new mongoose.Schema(
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
      enum: ["True", "False", "Partly True"], // ✅ Only allow these 3 values
      required: true,
    },
  },
  { timestamps: true }
);

const TrueFalseQuestion = mongoose.model(
  "truefalsequestions",
  TrueFalseQuestionSchema
);

module.exports = TrueFalseQuestion;

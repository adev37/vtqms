const mongoose = require("mongoose");

const TrueFalseQuestionSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, enum: ["True", "False", "Partly True"], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("truefalsequestions", TrueFalseQuestionSchema);

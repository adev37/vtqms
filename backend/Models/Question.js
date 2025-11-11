const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    answer: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("questions", questionSchema);

// 📁 routes/QuestionsRouter.js
const express = require("express");
const QuestionModel = require("../Models/Question");
const verifyToken = require("../Middlewares/verifyToken");

const router = express.Router();

// ✅ Optional middleware to restrict admin-only actions
const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Only admin allowed" });
  }
  next();
};

// 🔹 Add a single question (admin only)
router.post("/add", verifyToken, isAdmin, async (req, res) => {
  try {
    const { category, question, options, answer } = req.body;

    if (!category || !question || !options || !answer) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const newQuestion = new QuestionModel({
      category,
      question,
      options,
      answer,
    });
    await newQuestion.save();
    res
      .status(201)
      .json({ message: "Question added successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

// 🔹 Bulk Add API (admin only)
router.post("/bulk-add", verifyToken, isAdmin, async (req, res) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Questions must be a non-empty array",
      });
    }

    for (const q of questions) {
      if (
        !q.category ||
        !q.question ||
        !Array.isArray(q.options) ||
        q.options.length !== 4 ||
        !q.answer
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Each question must have category, question, 4 options, and answer",
        });
      }
    }

    await QuestionModel.insertMany(questions);
    res
      .status(201)
      .json({ success: true, message: "Questions added successfully" });
  } catch (error) {
    console.error("Bulk add error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🔹 Get all questions
router.get("/", async (req, res) => {
  try {
    const questions = await QuestionModel.find();
    res.status(200).json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

// ✅ Update a question
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { question, options, answer } = req.body;

    const updatedQuestion = await QuestionModel.findByIdAndUpdate(
      id,
      { question, options, answer },
      { new: true }
    );

    if (!updatedQuestion) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    res.json({
      success: true,
      message: "Question updated successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating question" });
  }
});

// 🔄 Bulk Update API (admin only)
router.put("/bulk-update", verifyToken, isAdmin, async (req, res) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Questions must be a non-empty array",
      });
    }

    const bulkOperations = [];

    for (const q of questions) {
      if (
        !q._id ||
        !q.category ||
        !q.question ||
        !Array.isArray(q.options) ||
        q.options.length !== 4 ||
        !q.answer
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Each question must have _id, category, question, 4 options, and answer",
        });
      }

      bulkOperations.push({
        updateOne: {
          filter: { _id: q._id },
          update: {
            $set: {
              category: q.category,
              question: q.question,
              options: q.options,
              answer: q.answer,
            },
          },
        },
      });
    }

    const result = await QuestionModel.bulkWrite(bulkOperations);
    res.status(200).json({
      success: true,
      message: "Questions updated successfully",
      result,
    });
  } catch (error) {
    console.error("Bulk update error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Delete a question
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedQuestion = await QuestionModel.findByIdAndDelete(id);
    if (!deletedQuestion) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    res.json({ success: true, message: "Question deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error deleting question" });
  }
});

module.exports = router;

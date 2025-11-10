const express = require("express");
const router = express.Router();
const FillBlankQuestion = require("../Models/FillBlankQuestion");
const verifyToken = require("../Middlewares/verifyToken");
const isAdmin = require("../Middlewares/isAdmin");

// Add a single fill blank question (admin only)
router.post("/add", verifyToken, isAdmin, async (req, res) => {
  try {
    const { category, question, answer } = req.body;

    if (!category || !question || !answer) {
      return res.status(400).json({
        success: false,
        message: "All fields (category, question, answer) are required",
      });
    }

    const newQuestion = new FillBlankQuestion({ category, question, answer });
    await newQuestion.save();

    res.status(201).json({
      success: true,
      message: "Fill in the blank question added successfully",
    });
  } catch (error) {
    console.error("Add Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Bulk add fill blank questions
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
      if (!q.category || !q.question || !q.answer) {
        return res.status(400).json({
          success: false,
          message:
            "Each question must have category, question, and answer fields",
        });
      }
    }

    await FillBlankQuestion.insertMany(questions);

    res.status(201).json({
      success: true,
      message: "Questions added successfully",
    });
  } catch (error) {
    console.error("Bulk Add Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get all fill blank questions
router.get("/", async (req, res) => {
  try {
    const questions = await FillBlankQuestion.find();
    res.status(200).json({ success: true, questions });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update a fill blank question (admin only)
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { category, question, answer } = req.body;

    const updated = await FillBlankQuestion.findByIdAndUpdate(
      id,
      { category, question, answer },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    res.json({ success: true, message: "Question updated", updated });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Delete a fill blank question (admin only)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await FillBlankQuestion.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    res.json({ success: true, message: "Question deleted" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;

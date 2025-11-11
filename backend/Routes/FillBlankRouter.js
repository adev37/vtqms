const express = require("express");
const FillBlankQuestion = require("../Models/FillBlankQuestion");
const verifyToken = require("../Middlewares/verifyToken");
const isAdmin = require("../Middlewares/isAdmin");

const router = express.Router();

router.post("/add", verifyToken, isAdmin, async (req, res) => {
  try {
    const { category, question, answer } = req.body;
    if (!category || !question || !answer) {
      return res.status(400).json({ success: false, message: "All fields (category, question, answer) are required" });
    }
    await new FillBlankQuestion({ category, question, answer }).save();
    return res.status(201).json({ success: true, message: "Fill in the blank question added successfully" });
  } catch (error) {
    console.error("Add Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/bulk-add", verifyToken, isAdmin, async (req, res) => {
  try {
    const { questions } = req.body;
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: "Questions must be a non-empty array" });
    }
    for (const q of questions) {
      if (!q.category || !q.question || !q.answer) {
        return res.status(400).json({ success: false, message: "Each question must have category, question, and answer" });
      }
    }
    await FillBlankQuestion.insertMany(questions);
    return res.status(201).json({ success: true, message: "Questions added successfully" });
  } catch (error) {
    console.error("Bulk Add Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const questions = await FillBlankQuestion.find();
    return res.status(200).json({ success: true, questions });
  } catch (error) {
    console.error("Fetch Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { category, question, answer } = req.body;
    const updated = await FillBlankQuestion.findByIdAndUpdate(
      id, { category, question, answer }, { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: "Question not found" });
    return res.json({ success: true, message: "Question updated", updated });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FillBlankQuestion.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Question not found" });
    return res.json({ success: true, message: "Question deleted" });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;

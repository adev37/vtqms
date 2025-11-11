const express = require("express");
const QuestionModel = require("../Models/Question");
const verifyToken = require("../Middlewares/verifyToken");
const isAdmin = require("../Middlewares/isAdmin");

const router = express.Router();

router.post("/add", verifyToken, isAdmin, async (req, res) => {
  try {
    const { category, question, options, answer } = req.body;
    if (!category || !question || !options || !answer) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    await new QuestionModel({ category, question, options, answer }).save();
    return res.status(201).json({ success: true, message: "Question added successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/bulk-add", verifyToken, isAdmin, async (req, res) => {
  try {
    const { questions } = req.body;
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: "Questions must be a non-empty array" });
    }
    for (const q of questions) {
      if (!q.category || !q.question || !Array.isArray(q.options) || q.options.length !== 4 || !q.answer) {
        return res.status(400).json({
          success: false,
          message: "Each question must have category, question, 4 options, and answer",
        });
      }
    }
    await QuestionModel.insertMany(questions);
    return res.status(201).json({ success: true, message: "Questions added successfully" });
  } catch (error) {
    console.error("Bulk add error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const questions = await QuestionModel.find();
    return res.status(200).json({ success: true, questions });
  } catch {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { question, options, answer, category } = req.body;
    const updated = await QuestionModel.findByIdAndUpdate(
      id, { question, options, answer, category }, { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: "Question not found" });
    return res.json({ success: true, message: "Question updated successfully", question: updated });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ success: false, message: "Error updating question" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await QuestionModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Question not found" });
    return res.json({ success: true, message: "Question deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ success: false, message: "Error deleting question" });
  }
});

module.exports = router;

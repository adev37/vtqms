const express = require("express");
const router = express.Router();
const TrueFalseQuestion = require("../Models/TrueFalseQuestion");
const verifyToken = require("../Middlewares/verifyToken");
const isAdmin = require("../Middlewares/isAdmin");

// ✅ Add a single True/False/Partly True question (admin only)
router.post("/add", verifyToken, isAdmin, async (req, res) => {
  try {
    const { category, question, answer } = req.body;

    // ✅ Updated validation to allow "True", "False", "Partly True"
    if (
      !category ||
      !question ||
      !["True", "False", "Partly True"].includes(answer)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Fields category, question, and answer (True, False, or Partly True) are required",
      });
    }

    const newQuestion = new TrueFalseQuestion({ category, question, answer });
    await newQuestion.save();

    res.status(201).json({
      success: true,
      message: "Question added successfully",
    });
  } catch (error) {
    console.error("Add Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Bulk add multiple questions (admin only)
router.post("/bulk-add", verifyToken, isAdmin, async (req, res) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Questions must be a non-empty array",
      });
    }

    // ✅ Validate each question inside array
    for (const q of questions) {
      if (
        !q.category ||
        !q.question ||
        !["True", "False", "Partly True"].includes(q.answer)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Each question must have category, question, and valid answer (True, False, or Partly True)",
        });
      }
    }

    await TrueFalseQuestion.insertMany(questions);

    res.status(201).json({
      success: true,
      message: "Questions added successfully",
    });
  } catch (error) {
    console.error("Bulk Add Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Get all true/false/partly true questions
router.get("/", async (req, res) => {
  try {
    const questions = await TrueFalseQuestion.find();
    res.status(200).json({ success: true, questions });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Update a question by ID (admin only)
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { category, question, answer } = req.body;

    // (Optional) You can add similar validation here if needed.

    const updated = await TrueFalseQuestion.findByIdAndUpdate(
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

// ✅ Delete a question by ID (admin only)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await TrueFalseQuestion.findByIdAndDelete(id);

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

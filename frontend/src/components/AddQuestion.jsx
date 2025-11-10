import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useBulkAddMcqMutation,
  useBulkAddTrueFalseMutation,
  useBulkAddFillBlankMutation,
} from "../services/api";
import { handleSuccess, handleError } from "../utils";

const AddQuestion = () => {
  const navigate = useNavigate();

  // RTK Query mutations (auto-invalidate cache on success)
  const [addMcq, { isLoading: addingMcq }] = useBulkAddMcqMutation();
  const [addTF, { isLoading: addingTF }] = useBulkAddTrueFalseMutation();
  const [addFB, { isLoading: addingFB }] = useBulkAddFillBlankMutation();

  const [category, setCategory] = useState("");
  const [questionType, setQuestionType] = useState("mcq"); // mcq | truefalse | fillblank
  const [questions, setQuestions] = useState([createEmptyQuestion("mcq")]);

  function createEmptyQuestion(type) {
    if (type === "mcq") {
      return { question: "", options: ["", "", "", ""], answer: "" };
    }
    // truefalse / fillblank
    return { question: "", answer: "" };
  }

  const handleTypeChange = (type) => {
    setQuestionType(type);
    setQuestions([createEmptyQuestion(type)]); // Reset when type changes
  };

  const handleChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const addNewQuestion = () => {
    setQuestions((prev) => [...prev, createEmptyQuestion(questionType)]);
  };

  const removeQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // quick front-end validation
    if (!category.trim()) {
      handleError("Category is required");
      return;
    }
    if (questionType === "mcq") {
      const invalid = questions.some(
        (q) =>
          !q.question.trim() ||
          q.options.some((o) => !o.trim()) ||
          !q.answer.trim()
      );
      if (invalid) {
        handleError("Please fill all MCQ fields (4 options and an answer).");
        return;
      }
    } else if (questionType === "truefalse") {
      const invalid = questions.some(
        (q) =>
          !q.question.trim() ||
          !["True", "False", "Partly True"].includes(q.answer)
      );
      if (invalid) {
        handleError(
          "Please fill question and choose a valid answer (True/False/Partly True)."
        );
        return;
      }
    } else {
      // fillblank
      const invalid = questions.some(
        (q) => !q.question.trim() || !q.answer.trim()
      );
      if (invalid) {
        handleError("Please fill question and the correct answer.");
        return;
      }
    }

    const payload = { questions: questions.map((q) => ({ ...q, category })) };

    try {
      if (questionType === "mcq") {
        await addMcq(payload).unwrap();
      } else if (questionType === "truefalse") {
        await addTF(payload).unwrap();
      } else {
        await addFB(payload).unwrap();
      }

      handleSuccess("Questions added successfully!");
      setQuestions([createEmptyQuestion(questionType)]);
      setCategory("");
    } catch (err) {
      handleError(err?.data?.message || "Server error while saving.");
    }
  };

  const saving = addingMcq || addingTF || addingFB;

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-4xl mx-auto p-6 bg-white shadow rounded-md"
    >
      <h2 className="text-2xl font-bold mb-4">Add Questions</h2>

      {/* Category */}
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 border rounded-md mb-6"
        required
      />

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          type="button"
          onClick={() => handleTypeChange("mcq")}
          className={`px-4 py-2 rounded-md font-semibold ${
            questionType === "mcq"
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-black"
          }`}
        >
          Multiple Choice
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange("truefalse")}
          className={`px-4 py-2 rounded-md font-semibold ${
            questionType === "truefalse"
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-black"
          }`}
        >
          True / False
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange("fillblank")}
          className={`px-4 py-2 rounded-md font-semibold ${
            questionType === "fillblank"
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-black"
          }`}
        >
          Fill in the Blanks
        </button>
      </div>

      {/* Questions */}
      {questions.map((q, index) => (
        <div key={index} className="mb-8 border-b pb-4 relative">
          <h4 className="text-lg font-semibold mb-2">
            {questionType === "mcq"
              ? "MCQ"
              : questionType === "truefalse"
              ? "True/False/Partly True"
              : "Fill in the Blank"}{" "}
            Question {index + 1}
          </h4>

          {/* Remove */}
          {questions.length > 1 && (
            <button
              type="button"
              onClick={() => removeQuestion(index)}
              className="absolute right-0 top-0 bg-red-500 text-white px-3 py-1 rounded-md text-sm"
            >
              Remove
            </button>
          )}

          {/* Question */}
          <input
            type="text"
            placeholder="Question"
            value={q.question}
            onChange={(e) => handleChange(index, "question", e.target.value)}
            className="w-full p-2 border rounded-md mb-2"
            required
          />

          {/* MCQ options */}
          {questionType === "mcq" &&
            q.options.map((opt, optIndex) => (
              <input
                key={optIndex}
                type="text"
                placeholder={`Option ${optIndex + 1}`}
                value={opt}
                onChange={(e) =>
                  handleOptionChange(index, optIndex, e.target.value)
                }
                className="w-full p-2 border rounded-md mb-2"
                required
              />
            ))}

          {/* MCQ answer */}
          {questionType === "mcq" && (
            <select
              value={q.answer}
              onChange={(e) => handleChange(index, "answer", e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="" disabled>
                Select Correct Answer
              </option>
              {q.options
                .filter((opt) => opt.trim() !== "")
                .map((opt, idx) => (
                  <option key={idx} value={opt}>
                    {opt}
                  </option>
                ))}
            </select>
          )}

          {/* True/False/Partly True answer */}
          {questionType === "truefalse" && (
            <select
              value={q.answer}
              onChange={(e) => handleChange(index, "answer", e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select Answer</option>
              <option value="True">True</option>
              <option value="False">False</option>
              <option value="Partly True">Partly True</option>
            </select>
          )}

          {/* Fill in the blank answer */}
          {questionType === "fillblank" && (
            <input
              type="text"
              placeholder="Correct Answer"
              value={q.answer}
              onChange={(e) => handleChange(index, "answer", e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          )}
        </div>
      ))}

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
        <button
          type="button"
          onClick={addNewQuestion}
          className="bg-purple-500 text-white px-4 py-2 rounded-md"
        >
          Add Question
        </button>

        <button
          type="submit"
          disabled={saving}
          className={`text-white px-4 py-2 rounded-md ${
            saving ? "bg-green-300 cursor-not-allowed" : "bg-green-500"
          }`}
        >
          {saving ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 inline-flex items-center space-x-2 text-sm"
        >
          <span className="text-blue-600">⬅</span>
          <span>Home</span>
        </button>
      </div>
    </form>
  );
};

export default AddQuestion;

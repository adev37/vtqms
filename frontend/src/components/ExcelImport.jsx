import React, { useState } from "react";
import * as XLSX from "xlsx";
import { FileDown, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBulkAddMcqMutation } from "../services/api";
import { handleError, handleSuccess } from "../utils";

const ExcelImport = () => {
  const navigate = useNavigate();
  const [formattedQuestions, setFormattedQuestions] = useState([]);
  const [importMcq, { isLoading }] = useBulkAddMcqMutation();

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const mapped = jsonData.map((row) => ({
          category: row.category,
          question: row.question,
          options: [row.option1, row.option2, row.option3, row.option4],
          answer: row.answer,
        }));

        setFormattedQuestions(mapped);
        handleSuccess("File loaded. Click 'Import Questions' to continue.");
      } catch (error) {
        handleError("Failed to read file: " + error.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImport = async () => {
    if (!formattedQuestions.length) {
      handleError("No data to import. Please upload a valid file first.");
      return;
    }

    // quick front-end validation
    const invalid = formattedQuestions.some(
      (q) =>
        !q.category ||
        !q.question ||
        !Array.isArray(q.options) ||
        q.options.length !== 4 ||
        q.options.some((o) => !o) ||
        !q.answer
    );
    if (invalid) {
      handleError("Invalid rows found. Ensure category, 4 options, and answer.");
      return;
    }

    try {
      await importMcq({ questions: formattedQuestions }).unwrap();
      handleSuccess("Questions imported successfully!");
      setFormattedQuestions([]);
    } catch (err) {
      handleError(err?.data?.message || "Upload error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
      <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
        📤 Import MCQ Questions
      </h2>

      <div className="space-y-6">
        {/* Upload Input */}
        <label className="block">
          <span className="text-gray-700 font-medium">Upload Excel File</span>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleExcelUpload}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <a
            href="/question-format.xlsx"
            download
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition-all"
          >
            <FileDown size={20} />
            Download Format
          </a>

          <button
            onClick={handleImport}
            disabled={!formattedQuestions.length || isLoading}
            className={`flex items-center justify-center gap-2 px-5 py-2 rounded-lg shadow transition-all ${
              formattedQuestions.length && !isLoading
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
          >
            <Send size={20} />
            {isLoading ? "Importing..." : "Import Questions"}
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
      </div>
    </div>
  );
};

export default ExcelImport;

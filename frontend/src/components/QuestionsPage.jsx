import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetMcqByCategoryQuery,
  useGetTFByCategoryQuery,
  useGetFBByCategoryQuery,
} from "../services/api";

const QuestionsPage = ({ category: propCategory }) => {
  const { category: paramCategory } = useParams();
  const navigate = useNavigate();
  const category = propCategory ?? paramCategory ?? "";

  // ---- Permissions (from login response saved in localStorage)
  const role = localStorage.getItem("role");
  const canSeeMCQ = localStorage.getItem("canSeeMCQ") === "true";
  const canSeeTrueFalse = localStorage.getItem("canSeeTrueFalse") === "true";
  const canSeeFillBlank = localStorage.getItem("canSeeFillBlank") === "true";

  const canAccessMCQ = role === "admin" || canSeeMCQ;
  const canAccessTrueFalse = role === "admin" || canSeeTrueFalse;
  const canAccessFillBlank = role === "admin" || canSeeFillBlank;

  // ---- Category-scoped cached queries
  const {
    data: mcqData,
    isLoading: mcqLoading,
    isFetching: mcqFetching,
    error: mcqError,
  } = useGetMcqByCategoryQuery(category, {
    skip: !category,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: tfData,
    isLoading: tfLoading,
    isFetching: tfFetching,
    error: tfError,
  } = useGetTFByCategoryQuery(category, {
    skip: !category,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: fbData,
    isLoading: fbLoading,
    isFetching: fbFetching,
    error: fbError,
  } = useGetFBByCategoryQuery(category, {
    skip: !category,
    refetchOnMountOrArgChange: true,
  });

  const mcq = mcqData?.questions ?? [];
  const tf = tfData?.questions ?? [];
  const fb = fbData?.questions ?? [];

  // ---- UI state
  const [selectedTab, setSelectedTab] = useState("mcq");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ---- Auto-switch if user lacks permission
  useEffect(() => {
    if (selectedTab === "mcq" && !canAccessMCQ) {
      if (canAccessTrueFalse) setSelectedTab("truefalse");
      else if (canAccessFillBlank) setSelectedTab("fillblank");
    } else if (selectedTab === "truefalse" && !canAccessTrueFalse) {
      if (canAccessMCQ) setSelectedTab("mcq");
      else if (canAccessFillBlank) setSelectedTab("fillblank");
    } else if (selectedTab === "fillblank" && !canAccessFillBlank) {
      if (canAccessMCQ) setSelectedTab("mcq");
      else if (canAccessTrueFalse) setSelectedTab("truefalse");
    }
  }, [canAccessMCQ, canAccessTrueFalse, canAccessFillBlank, selectedTab]);

  const anyLoading = mcqLoading || tfLoading || fbLoading;
  const anyFetching = mcqFetching || tfFetching || fbFetching;
  const anyError = mcqError || tfError || fbError;

  const headerTitle = useMemo(
    () => (category ? `${category} Questions` : "Questions"),
    [category]
  );

  return (
    <div className="flex flex-col bg-gray-100 h-screen">
      {/* Header */}
      <header className="bg-blue-600 text-white text-center py-4 text-2xl font-bold sticky top-0 z-30">
        {headerTitle}
      </header>

      {/* Tabs */}
      <div className="bg-white p-4 flex justify-center items-center space-x-4 shadow-sm sticky top-[4rem] z-20">
        {canAccessMCQ && (
          <button
            onClick={() => setSelectedTab("mcq")}
            className={`px-4 py-2 rounded-md font-semibold ${
              selectedTab === "mcq"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Multiple Choice
          </button>
        )}
        {canAccessTrueFalse && (
          <button
            onClick={() => setSelectedTab("truefalse")}
            className={`px-4 py-2 rounded-md font-semibold ${
              selectedTab === "truefalse"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            True / False
          </button>
        )}
        {canAccessFillBlank && (
          <button
            onClick={() => setSelectedTab("fillblank")}
            className={`px-4 py-2 rounded-md font-semibold ${
              selectedTab === "fillblank"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Fill in the Blanks
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-8 bg-gray-100">
        {anyLoading ? (
          <p className="text-center text-gray-500">Loading questions...</p>
        ) : anyError ? (
          <p className="text-center text-red-600">
            Failed to load questions. Please try again.
          </p>
        ) : (
          <>
            {/* MCQ */}
            {selectedTab === "mcq" &&
              (mcq.length ? (
                mcq.map((q, index) => (
                  <div
                    key={q._id || `${q.question}-${index}`}
                    className="p-4 bg-white rounded-md shadow-md"
                  >
                    <p className="font-semibold text-gray-800">
                      {index + 1}. {q.question}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {q.options?.map((opt, i) => (
                        <li key={i} className="text-gray-600">
                          ➡ {opt}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 font-bold text-green-600">
                      Answer: {q.answer}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No MCQ questions available.
                </p>
              ))}

            {/* True/False */}
            {selectedTab === "truefalse" &&
              (tf.length ? (
                tf.map((q, index) => (
                  <div
                    key={q._id || `${q.question}-${index}`}
                    className="p-4 bg-white rounded-md shadow-md"
                  >
                    <p className="font-semibold text-gray-800">
                      {index + 1}. {q.question}
                    </p>
                    <p className="mt-2 font-bold text-green-600">
                      Answer: {q.answer}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No True/False questions available.
                </p>
              ))}

            {/* Fill in the blanks */}
            {selectedTab === "fillblank" &&
              (fb.length ? (
                fb.map((q, index) => (
                  <div
                    key={q._id || `${q.question}-${index}`}
                    className="p-4 bg-white rounded-md shadow-md"
                  >
                    <p className="font-semibold text-gray-800">
                      {index + 1}. {q.question}
                    </p>
                    <p className="mt-2 font-bold text-green-600">
                      Answer: {q.answer}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No Fill in the Blanks questions available.
                </p>
              ))}
          </>
        )}

        {/* Subtle fetching indicator for background refetch */}
        {anyFetching && !anyLoading && (
          <p className="text-center text-gray-400 text-sm">Refreshing…</p>
        )}
      </div>

      {/* Mobile back */}
      {isMobile && (
        <div className="sticky bottom-0 px-4 py-2 bg-gray-100 border-t z-10">
          <button
            onClick={() => navigate("/question-bank")}
            className="w-full bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 flex items-center justify-center text-sm font-medium"
          >
            <span className="text-blue-600 mr-2">⬅</span> Go Back to Categories
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionsPage;

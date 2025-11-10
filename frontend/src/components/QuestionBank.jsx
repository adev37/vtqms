import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import QuestionsPage from "./QuestionsPage";

const categories = [
  "Human Anatomy",
  "Human Physiology",
  "Biochemistry",
  "Pathology",
  "Microbiology",
  "Pharmacology",
  "Forensic Medicine",
  "Community Medicine",
  "General Medicine",
  "Pediatrics",
  "Dermatology",
  "Psychiatry",
  "Radiology",
  "Surgery",
  "Orthopedics",
  "Ophthalmology",
  "Otorhinolaryngology (ENT)",
  "Obstetrics",
  "Gynecology",
  "Anesthesiology",
  "Cardiology",
  "Pulmonology",
  "Gastroenterology",
  "Nephrology",
  "Endocrinology",
  "Hematology",
  "Rheumatology",
  "Infectious Diseases",
  "Neurology",
  "Medical genetics",
  "Dermatopathology",
  "Hematopathology",
  "Surgical pathology",
  "Clinical pathology",
  "Immunology",
  "Virology",
  "Parasitology",
  "Mycology",
  "Bacteriology",
  "Epidemiology",
  "Public Health",
  "Biostatistics",
  "Health Promotion",
  "Maternal and Child Health",
  "Environmental Health",
  "Nutrition and Dietetics",
  "Health Policy",
  "Preventive Medicine",
  "Health Psychology",
  "Medical Ethics",
  "Medical Jurisprudence",
  "Medical Sociology",
  "Air Disinfection",
  "Hospital Aquired Infection",
  "Nursing Training IV Arm",
  "OT Table Handling",
  "ICU Bed Handling",
  "MRI Machine",
  "CT Machine",
  "DSA Machine",
];

const QuestionBank = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle screen resize for responsive
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (!mobile && location.pathname.startsWith("/questions/")) {
        // Redirect back to /question-bank when switching to large screen
        navigate("/question-bank", { replace: true });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [location.pathname, navigate]);

  const handleCategoryClick = useCallback(
    (category) => {
      setSelectedCategory(category);
      if (isMobile) navigate(`/questions/${category}`);
    },
    [isMobile, navigate]
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white text-center py-4 text-2xl font-bold shadow-md">
        VT Question Bank
      </header>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)]">
        {/* Category Sidebar */}
        <aside className="w-full md:w-1/4 bg-white shadow-md flex flex-col h-full">
          <h3 className="text-lg font-semibold text-center p-4 border-b bg-gray-200">
            Categories
          </h3>
          <div className="flex-1 overflow-y-auto">
            <ul className="p-2">
              {categories.map((category, index) => (
                <li
                  key={index}
                  className={`cursor-pointer p-3 text-gray-700 hover:bg-blue-200 transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-blue-500 text-white font-semibold"
                      : ""
                  }`}
                  onClick={() => handleCategoryClick(category)}>
                  {category}
                </li>
              ))}
            </ul>
          </div>
          <button
            className="m-4 p-2 bg-gray-300 rounded-md text-black hover:bg-gray-400 transition-all duration-200"
            onClick={() => navigate("/")}>
            ⬅ Home
          </button>
        </aside>

        {/* Questions Display */}
        {!isMobile && (
          <main className="flex-1 p-6 overflow-y-auto">
            {selectedCategory ? (
              <QuestionsPage category={selectedCategory} />
            ) : (
              <p className="text-center text-gray-500 mt-4">
                Select a category to view questions.
              </p>
            )}
          </main>
        )}
      </div>
    </div>
  );
};

export default QuestionBank;

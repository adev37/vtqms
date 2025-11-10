import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserEdit, FaFileAlt } from "react-icons/fa";
import dashboardLogo from "../assets/logo.png";
import UserDetails from "./UserDetails";
import EditProfile from "./EditProfile";

const MainContent = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  // ✅ Tab Routing Logic
  if (activeTab === "profile") return <UserDetails />;
  if (activeTab === "editprofile") return <EditProfile />;

  // ✅ Default Dashboard
  return (
    <main className="flex flex-col items-center justify-center p-6 min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-gray-200">
      <div className="bg-white p-6 rounded-lg shadow-md text-center w-full max-w-3xl flex flex-col items-center">
        <img
          src={dashboardLogo}
          alt="VT Question Bank Logo"
          className="w-24 h-auto mb-4 drop-shadow-md"
        />
        <h2 className="text-3xl font-bold text-gray-800">
          Explore a Vast Collection of Questions
        </h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Access thousands of questions for practice, revision, and
          self-evaluation. Enhance your preparation across multiple subjects.
        </p>
      </div>

      {/* Dashboard Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 w-full max-w-3xl">
        {/* View Question Bank */}
        <button
          onClick={() => navigate("/question-bank")}
          className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 w-full border border-gray-100"
        >
          <div className="text-5xl text-blue-600 mb-3">
            <FaFileAlt />
          </div>
          <span className="text-lg font-medium text-gray-800">
            View Question Bank
          </span>
          <p className="text-sm text-gray-500 mt-1">
            Browse MCQs, True/False, and Fill-in-the-Blank questions.
          </p>
        </button>

        {/* Edit Profile */}
        <button
          onClick={() => setActiveTab("editprofile")}
          className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 w-full border border-gray-100"
        >
          <div className="text-5xl text-blue-600 mb-3">
            <FaUserEdit />
          </div>
          <span className="text-lg font-medium text-gray-800">
            Edit Profile
          </span>
          <p className="text-sm text-gray-500 mt-1">
            Update your name, email, and view your account details.
          </p>
        </button>
      </div>
    </main>
  );
};

export default MainContent;

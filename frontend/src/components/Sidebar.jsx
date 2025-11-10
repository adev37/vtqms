import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { FiMenu, FiX } from "react-icons/fi";

const Sidebar = ({ activeTab, setActiveTab, onLogoutClick, userRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Define tabs
  const tabs = [
    { name: "dashboard", icon: "📊", label: "Dashboard" },
    {
      name: "questionbank",
      icon: "📚",
      label: "Question Bank",
      path: "/question-bank",
    },
    { name: "profile", icon: "👤", label: "Profile" },
  ];

  if (userRole === "admin") {
    tabs.push(
      { name: "add", icon: "➕", label: "Add", path: "/add" },
      {
        name: "import",
        icon: "📥",
        label: "Import Excel",
        path: "/import-excel",
      }
    );
  }

  // Handle tab click
  const handleNavigation = (name, path = null) => {
    setActiveTab(name);
    if (path) navigate(path);
    setTimeout(() => setIsOpen(false), 100);
  };

  return (
    <>
      {/* Mobile Hamburger Header */}
      <div className="md:hidden bg-white p-4 flex justify-between items-center shadow-md">
        <img src={logo} alt="Logo" className="h-10 w-auto" />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-3xl focus:outline-none">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 bg-white shadow-lg p-4 h-screen transform transition-transform 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:relative md:flex flex-col z-50`}>
        {/* Logo Section */}
        <div className="flex items-center space-x-2 pb-4 border-b">
          <img src={logo} alt="Logo" className="h-12 md:h-16 w-auto" />
        </div>

        {/* Navigation */}
        <nav className="mt-4 flex-1">
          {tabs.map(({ name, icon, label, path }) => (
            <button
              key={name}
              className={`w-full text-left p-3 rounded-lg mb-2 font-medium flex items-center space-x-2 transition-all duration-300 focus:outline-none ${
                activeTab === name
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-blue-300 text-black hover:bg-blue-400"
              }`}
              onClick={() => handleNavigation(name, path)}>
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}

          {/* Logout Button */}
          <button
            className="w-full text-left p-3 rounded-lg mb-2 font-medium flex items-center space-x-2 transition-all duration-300 bg-red-300 text-black hover:bg-red-400 focus:outline-none"
            onClick={onLogoutClick}>
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 md:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;

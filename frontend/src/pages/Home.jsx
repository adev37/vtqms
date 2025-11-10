import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import { useNavigate } from "react-router-dom";

const Home = ({ handleLogout }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onLogoutClick = () => {
    handleLogout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar stays visible on desktop */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogoutClick={onLogoutClick}
        userRole={userRole}
      />

      {/* Main content updates based on tab */}
      <main className="flex-1 overflow-y-auto">
        <MainContent activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>
    </div>
  );
};

export default Home;

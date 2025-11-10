import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import QuestionBank from "./components/QuestionBank";
import QuestionsPage from "./components/QuestionsPage";
import Login from "./pages/Login";
import Signup from "./components/Signup";
import PrivateRoute from "./PrivateRoute";
import NotFound from "./components/NotFound";
import AddQuestion from "./components/AddQuestion";
import EditProfile from "./components/EditProfile";
import UserDetails from "./components/UserDetails";
import Toaster from "./components/Toaster";
import LoadingScreen from "./components/LoadingScreen"; // ✅ Add this
import ExcelImport from "./components/ExcelImport";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    setIsAuthenticated(!!token);
    setUserRole(role?.toLowerCase());
    setLoading(false);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setUserRole(null);
  }, []);

  return {
    isAuthenticated,
    setIsAuthenticated,
    handleLogout,
    userRole,
    loading,
  };
};

const App = () => {
  const {
    isAuthenticated,
    setIsAuthenticated,
    handleLogout,
    userRole,
    loading,
  } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Toaster />
        <Routes>
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/brcomponent/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute
                element={
                  <Home handleLogout={handleLogout} userRole={userRole} />
                }
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/questions/:category"
            element={
              <PrivateRoute
                element={<QuestionsPage userRole={userRole} />}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/question-bank"
            element={
              <PrivateRoute
                element={<QuestionBank userRole={userRole} />}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/editprofile"
            element={
              <PrivateRoute
                element={<EditProfile />}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/userDetails"
            element={
              <PrivateRoute
                element={<UserDetails />}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          {/* =====  */}
          <Route
            path="/import-excel"
            element={
              <PrivateRoute
                element={<ExcelImport />}
                isAuthenticated={isAuthenticated}
                userRole={userRole}
                allowedRoles={["admin"]}
              />
            }
          />

          {/* ✅ Fixed Add Route */}
          <Route
            path="/add"
            element={
              <PrivateRoute
                element={<AddQuestion />}
                isAuthenticated={isAuthenticated}
                userRole={userRole}
                allowedRoles={["admin"]}
              />
            }
          />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

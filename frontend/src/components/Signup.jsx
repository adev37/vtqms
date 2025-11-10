import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import signupIllustration from "../assets/logo.png";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { useSignupMutation } from "../services/api";

const Signup = () => {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    canSeeMCQ: false,
    canSeeTrueFalse: false,
    canSeeFillBlank: false,
  });

  const [signup, { isLoading }] = useSignupMutation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupInfo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = signupInfo;

    if (!name || !email || !password || !role) {
      return handleError("All fields are required");
    }

    try {
      const res = await signup(signupInfo).unwrap();
      if (res?.success) {
        handleSuccess(res.message || "Signup successful");
        setTimeout(() => navigate("/login"), 800);
      } else {
        handleError(res?.message || "Signup failed");
      }
    } catch (err) {
      handleError(err?.data?.message || err?.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-100 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Curved Top with Logo */}
        <div className="bg-white relative pb-10 rounded-b-[50%] border-b border-blue-300">
          <div className="bg-gradient-to-b from-blue-100 to-blue-300 py-6 rounded-b-[50%]">
            <img src={signupIllustration} alt="logo" className="w-20 mx-auto mb-2" />
            <h2 className="text-center text-gray-800 font-bold text-xl mt-2">
              Create Account
            </h2>
            <p className="text-center text-gray-500 text-sm">Sign up to get started</p>
          </div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="px-6 py-8">
          {/* Full Name */}
          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 mb-4 shadow-sm">
            <FaUser className="text-gray-500 mr-2" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={signupInfo.name}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
              required
            />
          </div>

          {/* Email */}
          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 mb-4 shadow-sm">
            <FaEnvelope className="text-gray-500 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={signupInfo.email}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 mb-4 shadow-sm">
            <FaLock className="text-gray-500 mr-2" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={signupInfo.password}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
              required
            />
          </div>

          {/* Role Selection */}
          <select
            name="role"
            value={signupInfo.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-full px-4 py-2 mb-6 shadow-sm text-gray-700 focus:outline-none"
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>

          {/* Access Permissions (only for students) */}
          {signupInfo.role === "student" && (
            <div className="space-y-2 mb-6 text-sm">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="canSeeMCQ"
                  checked={signupInfo.canSeeMCQ}
                  onChange={handleChange}
                />
                <span className="text-gray-600">Access to Multiple Choice</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="canSeeTrueFalse"
                  checked={signupInfo.canSeeTrueFalse}
                  onChange={handleChange}
                />
                <span className="text-gray-600">Access to True/False</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="canSeeFillBlank"
                  checked={signupInfo.canSeeFillBlank}
                  onChange={handleChange}
                />
                <span className="text-gray-600">Access to Fill in the Blanks</span>
              </label>
            </div>
          )}

          {/* Signup Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white py-2 rounded-full shadow-md font-semibold text-lg mb-4 transition duration-200 ${
              isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Creating..." : "SIGN UP"}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?
            <Link to="/login" className="text-blue-600 font-semibold hover:underline ml-1">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;

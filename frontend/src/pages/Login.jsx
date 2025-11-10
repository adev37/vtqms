import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import loginIllustration from "../assets/logo.png";
import { FaUser, FaLock } from "react-icons/fa";
import { useLoginMutation } from "../services/api";

const Login = ({ setIsAuthenticated }) => {
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      return handleError("Email and password are required");
    }

    try {
      const res = await login(loginInfo).unwrap();

      const {
        success,
        message,
        jwtToken,
        name,
        role,
        canSeeMCQ,
        canSeeTrueFalse,
        canSeeFillBlank,
      } = res || {};

      if (success) {
        handleSuccess(message || "Login successful");

        // Persist session + permissions
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);
        localStorage.setItem("role", role);
        localStorage.setItem("canSeeMCQ", String(canSeeMCQ));
        localStorage.setItem("canSeeTrueFalse", String(canSeeTrueFalse));
        localStorage.setItem("canSeeFillBlank", String(canSeeFillBlank));

        // Optional remember email
        if (remember) {
          localStorage.setItem("rememberEmail", email);
        } else {
          localStorage.removeItem("rememberEmail");
        }

        setIsAuthenticated(true);
        setTimeout(() => navigate("/"), 400);
      } else {
        handleError(res?.message || "Invalid credentials");
      }
    } catch (err) {
      handleError(err?.data?.message || err?.error || "Error during login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Curved Top with Logo */}
        <div className="bg-white relative pb-10 rounded-b-[50%] border-b border-blue-300">
          <div className="bg-gradient-to-b from-blue-100 to-blue-300 py-6 rounded-b-[50%]">
            <img src={loginIllustration} alt="logo" className="w-20 mx-auto mb-2" />
            <h2 className="text-center text-gray-800 font-bold text-xl mt-2">
              Welcome Back
            </h2>
            <p className="text-center text-gray-500 text-sm">
              Login to your account
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="px-6 py-8">
          {/* Username */}
          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 mb-4 shadow-sm">
            <FaUser className="text-gray-500 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Username"
              value={loginInfo.email}
              onChange={handleChange}
              className="w-full outline-none bg-transparent"
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
              value={loginInfo.password}
              onChange={handleChange}
              className="w-full outline-none bg-transparent"
              required
            />
          </div>

          {/* Remember me */}
          <div className="flex justify-between items-center text-sm mb-6">
            <label className="flex items-center space-x-2 text-gray-600">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              <span>Remember me</span>
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white py-2 rounded-full shadow-md font-semibold text-lg ${
              isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Signing in..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

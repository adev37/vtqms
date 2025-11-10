import React from "react";
import { FaUser, FaEnvelope, FaBriefcase } from "react-icons/fa";
import { useUserDetailQuery } from "../services/api";

const UserDetails = () => {
  const { data, isLoading, error } = useUserDetailQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-100">
        <p className="text-blue-700 text-lg">Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100">
        <p className="text-red-600 font-semibold">
          {error?.data?.message || "Failed to fetch user data"}
        </p>
      </div>
    );
  }

  const user = data?.user || { name: "", email: "", role: "Student" };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-gray-200 p-4">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          User Profile
        </h2>

        <div className="space-y-4">
          {[
            { label: "Full Name", value: user.name, icon: <FaUser /> },
            { label: "Email", value: user.email, icon: <FaEnvelope /> },
            { label: "Profession", value: user.role, icon: <FaBriefcase /> },
          ].map((field, index) => (
            <div
              key={index}
              className="flex items-center border rounded-lg p-3 shadow-sm bg-gray-100"
            >
              <span className="text-blue-500 text-lg mx-2">{field.icon}</span>
              <input
                type="text"
                value={field.value}
                readOnly
                className="w-full bg-transparent outline-none text-gray-700"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;

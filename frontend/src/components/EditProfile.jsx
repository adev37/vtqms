import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserDetailQuery, useUpdateUserMutation } from "../services/api";
import { handleError, handleSuccess } from "../utils";

const EditProfile = () => {
  const navigate = useNavigate();

  // Cached user detail (auto re-fetches when invalidated)
  const { data, isLoading, error, refetch } = useUserDetailQuery();

  // Update mutation (invalidates "User" tag in api slice)
  const [updateUser, { isLoading: saving }] = useUpdateUserMutation();

  const [user, setUser] = useState({ name: "", email: "", role: "" });

  // Seed form from cache when available
  useEffect(() => {
    if (data?.user) {
      setUser({
        name: data.user.name || "",
        email: data.user.email || "",
        role: data.user.role || "student",
      });
    }
  }, [data]);

  // If token expired or unauthorized, kick to login
  useEffect(() => {
    if (error && (error.status === 401 || error.status === 403)) {
      handleError("Session expired. Please log in again.");
      navigate("/login", { replace: true });
    }
  }, [error, navigate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = user.name.trim();
    const trimmedEmail = user.email.trim();

    if (!trimmedName) {
      handleError("Name is required");
      return;
    }
    if (!trimmedEmail || !/.+@.+\..+/.test(trimmedEmail)) {
      handleError("Please enter a valid email");
      return;
    }

    try {
      await updateUser({ name: trimmedName, email: trimmedEmail }).unwrap();
      handleSuccess("Profile updated successfully!");

      // Optional: keep any UI that reads localStorage in sync (e.g., greeting)
      localStorage.setItem("loggedInUser", trimmedName);

      // Ensure freshest data shown
      refetch();
    } catch (err) {
      const msg =
        err?.data?.message ||
        err?.error ||
        "Update failed. Please try again.";
      handleError(msg);
      // If auth error, redirect
      if (err?.status === 401 || err?.status === 403) {
        navigate("/login", { replace: true });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-blue-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (error && !(error.status === 401 || error.status === 403)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 font-semibold">
          Failed to fetch user details.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          className="w-full p-3 border rounded-md"
          value={user.name}
          onChange={onChange}
          autoComplete="name"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-md"
          value={user.email}
          onChange={onChange}
          autoComplete="email"
        />

        <div className="w-full p-3 border rounded-md bg-gray-100 text-gray-700">
          Role: <strong className="capitalize">{user.role}</strong>
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`w-full text-white p-3 rounded-md ${
            saving ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;

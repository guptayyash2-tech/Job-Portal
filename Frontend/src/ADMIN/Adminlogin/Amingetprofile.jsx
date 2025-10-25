import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAdminProfile, setAuthToken } from "../Adminapi";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/adminlogin"); // Redirect if not logged in
      return;
    }
    setAuthToken(token);

    const fetchProfile = async () => {
      try {
        const data = await getAdminProfile();
        setAdmin(data.admin || data); // Adjust depending on backend structure
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // 🌀 Loading State
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <p className="text-white text-xl font-semibold animate-pulse">
          Loading admin profile...
        </p>
      </div>
    );

  // ❌ Error State
  if (error)
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-red-50">
        <p className="text-red-600 font-semibold text-lg mb-4">{error}</p>
        <Link
          to="/adminlogin"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Go to Login
        </Link>
      </div>
    );

  // ✅ Success — Profile View
  const { pancard, officeemailid, mobilenumber, userImage } = admin || {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md border border-indigo-100">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={
              userImage
                ? `data:image/png;base64,${userImage}`
                : "/default-avatar.png"
            }
            alt="Admin"
            className="w-28 h-28 rounded-full border-4 border-indigo-500 object-cover mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900">
            {pancard || "Admin"}
          </h2>
          <p className="text-gray-600">{officeemailid}</p>
          <p className="text-gray-600">{mobilenumber}</p>
        </div>

        {/* Profile Info */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition">
            <label className="block text-sm text-gray-600 font-medium">
              PAN Card
            </label>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {pancard || "N/A"}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition">
            <label className="block text-sm text-gray-600 font-medium">
              Email
            </label>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {officeemailid || "N/A"}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-pink-50 hover:bg-pink-100 transition">
            <label className="block text-sm text-gray-600 font-medium">
              Mobile Number
            </label>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {mobilenumber || "N/A"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            to="/adminupdateprofile"
            className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full font-medium shadow-md hover:scale-105 transition"
          >
            Edit Profile
          </Link>
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-2 rounded-full font-medium shadow-md hover:scale-105 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;

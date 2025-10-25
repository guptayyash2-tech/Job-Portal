import React, { useEffect, useState } from "react";
import { getUserProfile, setAuthToken } from "../../Api";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);

    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setUser(data.user ?? data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-10 text-indigo-600 font-medium animate-pulse">
        Loading profile...
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-10 text-red-500 font-semibold bg-red-50 py-3 px-4 rounded-xl inline-block">
        {error}
      </p>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md border border-indigo-100">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={user.image ? `data:image/png;base64,${user.image}` : "/default-avatar.png"}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-indigo-500 object-cover mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
          <p className="text-gray-600">{user.emailid}</p>
          <p className="text-gray-600">{user.mobilenumber}</p>
        </div>

        {/* Profile Info */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition">
            <label className="block text-sm text-gray-600 font-medium">Name</label>
            <p className="text-lg font-semibold text-gray-900 mt-1">{user.username}</p>
          </div>

          <div className="p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition">
            <label className="block text-sm text-gray-600 font-medium">Email</label>
            <p className="text-lg font-semibold text-gray-900 mt-1">{user.emailid}</p>
          </div>

          <div className="p-4 rounded-xl bg-pink-50 hover:bg-pink-100 transition">
            <label className="block text-sm text-gray-600 font-medium">Mobile</label>
            <p className="text-lg font-semibold text-gray-900 mt-1">{user.mobilenumber}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            to="/updateuserprofile"
            className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full font-medium shadow-md hover:scale-105 transition"
          >
            Edit Profile
          </Link>
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full font-medium shadow-md hover:scale-105 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

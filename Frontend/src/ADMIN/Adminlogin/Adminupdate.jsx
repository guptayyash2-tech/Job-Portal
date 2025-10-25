import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAdminProfile, setAuthToken, updateadminProfile } from "../Adminapi";

const AdminUpdate = () => {
  const [formData, setFormData] = useState({
    pancard: "",
    officeemailid: "",
    mobilenumber: "",
    userImage: null,
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Load current admin profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) setAuthToken(token);

        const data = await getAdminProfile();
        setFormData({
          pancard: data.pancard || "",
          officeemailid: data.officeemailid || "",
          mobilenumber: data.mobilenumber || "",
          userImage: null, // file input starts empty
        });
      } catch (err) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, userImage: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("pancard", formData.pancard);
      data.append("officeemailid", formData.officeemailid);
      data.append("mobilenumber", formData.mobilenumber);
      if (formData.userImage) data.append("userImage", formData.userImage);

      const token = localStorage.getItem("token");
      if (token) setAuthToken(token);

      await updateadminProfile(data);

      setMessage("✅ Profile updated successfully!");
      setTimeout(() => navigate("/admingetprofile"), 1000);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-indigo-600 font-medium animate-pulse">
        Loading profile...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-500 font-semibold bg-red-50 py-3 px-4 rounded-xl inline-block">
        {error}
      </p>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Update Admin Profile
        </h2>

        {message && (
          <div
            className={`text-center mb-4 ${
              message.includes("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="pancard"
            placeholder="Pancard Number"
            value={formData.pancard}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <input
            type="email"
            name="officeemailid"
            placeholder="Email Address"
            value={formData.officeemailid}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <input
            type="text"
            name="mobilenumber"
            placeholder="Mobile Number"
            value={formData.mobilenumber}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <input
            type="file"
            name="userImage"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-3 transition duration-200"
          >
            Save Changes
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Back to{" "}
          <Link
            to="/admingetprofile"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Admin Profile
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminUpdate;

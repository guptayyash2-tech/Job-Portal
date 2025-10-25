import React, { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile, setAuthToken } from "../../Api";
import { useNavigate } from "react-router-dom";

const UpdateUserProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    emailid: "",
    mobilenumber: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);
    const fetchData = async () => {
      const data = await getUserProfile();
      setFormData({
        username: data.user.username || "",
        emailid: data.user.emailid || "",
        mobilenumber: data.user.mobilenumber || "",
      });
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(formData);
      setMessage("✅ Profile updated successfully!");
      setTimeout(() => navigate("/getpersonalinfo"), 1000);
    } 
    catch (err) {
      setMessage("❌ Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Profile</h2>
        {message && <p className="text-center mb-4">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full border rounded-lg p-3"
          />
          <input
            type="email"
            name="emailid"
            value={formData.emailid}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border rounded-lg p-3"
          />
          <input
            type="text"
            name="mobilenumber"
            value={formData.mobilenumber}
            onChange={handleChange}
            placeholder="Mobile Number"
            className="w-full border rounded-lg p-3"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold rounded-lg py-3 hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserProfile;

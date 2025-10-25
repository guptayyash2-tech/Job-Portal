import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminRegister, setAuthToken } from "../Adminapi";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    pancard: "",
    officeemailid: "",
    password: "",
    mobilenumber: "",
    userImage: null, // file
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, userImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convert form data into FormData object for multipart upload
      const data = new FormData();
      data.append("pancard", formData.pancard);
      data.append("officeemailid", formData.officeemailid);
      data.append("password", formData.password);
      data.append("mobilenumber", formData.mobilenumber);
      if (formData.userImage) {
        data.append("userImage", formData.userImage);
      }

      const response = await adminRegister(data);

      // Save token
      const { token } = response;
      setAuthToken(token);
      localStorage.setItem("token", token);

      setMessage("✅ Registration successful!");
      navigate("/adminlogin");
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Account
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
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
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
            required
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-3 transition duration-200"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminLogin, setAuthToken } from "../Adminapi";

const Adminlogin = () => {
  const [formData, setFormData] = useState({ officeemailid: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await adminLogin(formData);
      const { token, role } = data;

      // Save token & role
      localStorage.setItem("token", token);
      localStorage.setItem("role", (role || "admin").toLowerCase());

      // Set axios auth header
      setAuthToken(token);

      setMessage("✅ Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 800);

    } catch (err) {
      console.error(err.response?.data || err);
      setMessage(`❌ ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>

        {message && (
          <div className={`text-center mb-4 ${message.includes("✅") ? "text-green-600" : "text-red-500"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="officeemailid"
            placeholder="Email Address"
            value={formData.officeemailid}
            onChange={handleChange}
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"} text-white font-semibold rounded-lg py-3 transition duration-200`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link to="/adminregister" className="text-indigo-600 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Adminlogin;

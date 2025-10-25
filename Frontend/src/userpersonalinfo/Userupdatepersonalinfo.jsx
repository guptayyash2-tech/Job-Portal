import React, { useEffect, useState } from "react";
import { getPersonalInfo, updatePersonalInfo, setAuthToken } from "../../Api";
import { useNavigate } from "react-router-dom";

const UserUpdateInfo = () => {
  const [formData, setFormData] = useState({
    address: "",
    pincode: "",
    city: "",
    mobilenumber1: "",
    mobilenumber2: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch current personal info
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);

    const fetchPersonalInfo = async () => {
      try {
        const data = await getPersonalInfo();
        const user = data.user ?? data;
        setFormData({
          address: user.address || "",
          pincode: user.pincode || "",
          city: user.city || "",
          mobilenumber1: user.mobilenumber1 || "",
          mobilenumber2: user.mobilenumber2 || "",
        });
      } catch (err) {
        setMessage(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await updatePersonalInfo(formData);
      setMessage("✅ Personal info updated successfully!");
      // Optionally redirect
      setTimeout(() => navigate("/getpersonalinfo"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <p className="text-center mt-10 text-indigo-600 animate-pulse">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md border border-indigo-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
          Update Personal Info
        </h2>

        {message && (
          <div
            className={`mb-4 text-center ${
              message.includes("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="text"
            name="mobilenumber1"
            placeholder="Mobile 1"
            value={formData.mobilenumber1}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="text"
            name="mobilenumber2"
            placeholder="Mobile 2"
            value={formData.mobilenumber2}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-3 transition duration-200"
          >
            Update Info
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserUpdateInfo;

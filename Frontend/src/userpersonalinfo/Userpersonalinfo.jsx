import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { savePersonalInfo, setAuthToken } from "../../Api";

const Userpersonalinfo = () => {
  const navigate = useNavigate();

  const [personalData, setPersonalData] = useState({
    address: "",
    pincode: "",
    city: "",
    mobilenumber1: "",
    mobilenumber2: "",
  });

  const [message, setMessage] = useState("");

  // ✅ Set auth token from localStorage once when component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonalData({ ...personalData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await savePersonalInfo(personalData); // token is already in Axios headers
      setMessage("✅ Personal information saved successfully!");
      navigate("/"); // redirect after success
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          User Personal Information
        </h2>

        {message && <p className="text-center mb-4">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="address"
            value={personalData.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full border rounded-lg p-2.5"
            required
          />
          <input
            type="text"
            name="pincode"
            value={personalData.pincode}
            onChange={handleChange}
            placeholder="Pincode"
            className="w-full border rounded-lg p-2.5"
            required
          />
          <input
            type="text"
            name="city"
            value={personalData.city}
            onChange={handleChange}
            placeholder="City"
            className="w-full border rounded-lg p-2.5"
            required
          />
          <input
            type="text"
            name="mobilenumber1"
            value={personalData.mobilenumber1}
            onChange={handleChange}
            placeholder="Primary Mobile Number"
            className="w-full border rounded-lg p-2.5"
            required
          />
          <input
            type="text"
            name="mobilenumber2"
            value={personalData.mobilenumber2}
            onChange={handleChange}
            placeholder="Secondary Mobile Number"
            className="w-full border rounded-lg p-2.5"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Save Information
          </button>
        </form>
      </div>
    </div>
  );
};

export default Userpersonalinfo;

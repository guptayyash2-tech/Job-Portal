import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { getCompanyInformationByUserId, updateCompanyInformation, setAuthToken } from "../Adminapi";

const UpdateCompanyInformation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    website: "",
    address: "",
    city: "",
    pincode: "",
    contactPersonName: "",
    contactPersonEmail: "",
    contactPersonPhone: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirect if not logged in
      return;
    }

    setAuthToken(token);

    const fetchCompanyInfo = async () => {
      try {
        const data = await getCompanyInformationByUserId();
        if (data.company) {
          setFormData({ ...data.company });
        } else {
          setError("No company information found.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch company information.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyInfo();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await updateCompanyInformation(formData);
      setSuccess("Company information updated successfully!");
      setTimeout(() => navigate("/getcompanyinfo"), 1500); // redirect after success
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update company information.");
    }
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Update Company Information
        </h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Company Name"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="email"
            name="companyEmail"
            value={formData.companyEmail}
            onChange={handleChange}
            placeholder="Company Email"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            name="companyPhone"
            value={formData.companyPhone}
            onChange={handleChange}
            placeholder="Company Phone"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Website"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="Pincode"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="contactPersonName"
            value={formData.contactPersonName}
            onChange={handleChange}
            placeholder="Contact Person Name"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="email"
            name="contactPersonEmail"
            value={formData.contactPersonEmail}
            onChange={handleChange}
            placeholder="Contact Person Email"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="contactPersonPhone"
            value={formData.contactPersonPhone}
            onChange={handleChange}
            placeholder="Contact Person Phone"
            className="w-full p-2 border border-gray-300 rounded"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Update Information
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default UpdateCompanyInformation;

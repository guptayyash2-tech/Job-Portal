import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createCompanyInformation, getCompanyInformationByUserId, setAuthToken } from "../Adminapi";


const CompanyInformation = () => {
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState({
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
  const [message, setMessage] = useState("");

  // ✅ Load existing company info
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);

    const fetchCompanyInfo = async () => {
      try {
        const data = await getCompanyInformationByUserId();
        if (data.user) setCompanyData(data.user);
      } catch (err) {
        console.log("No company info found yet.");
      }
    };
    fetchCompanyInfo();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData({ ...companyData, [name]: value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCompanyInformation(companyData);
      setMessage("✅ Company information saved successfully!");
      navigate("/dashboard"); // redirect after save
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Company Information</h2>
        {message && <p className="text-center mb-4">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="companyName" value={companyData.companyName} onChange={handleChange} placeholder="Company Name" className="w-full border p-2 rounded" required />
          <input name="companyEmail" value={companyData.companyEmail} onChange={handleChange} placeholder="Company Email" className="w-full border p-2 rounded" required />
          <input name="companyPhone" value={companyData.companyPhone} onChange={handleChange} placeholder="Company Phone" className="w-full border p-2 rounded" required />
          <input name="website" value={companyData.website} onChange={handleChange} placeholder="Website" className="w-full border p-2 rounded" />
          <input name="address" value={companyData.address} onChange={handleChange} placeholder="Address" className="w-full border p-2 rounded" required />
          <input name="city" value={companyData.city} onChange={handleChange} placeholder="City" className="w-full border p-2 rounded" required />
          <input name="pincode" value={companyData.pincode} onChange={handleChange} placeholder="Pincode" className="w-full border p-2 rounded" required />
          <input name="contactPersonName" value={companyData.contactPersonName} onChange={handleChange} placeholder="Contact Person Name" className="w-full border p-2 rounded" required />
          <input name="contactPersonEmail" value={companyData.contactPersonEmail} onChange={handleChange} placeholder="Contact Person Email" className="w-full border p-2 rounded" required />
          <input name="contactPersonPhone" value={companyData.contactPersonPhone} onChange={handleChange} placeholder="Contact Person Phone" className="w-full border p-2 rounded" required />

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save Company Info</button>
        </form>
      </div>
    </div>
  );
};

export default CompanyInformation;

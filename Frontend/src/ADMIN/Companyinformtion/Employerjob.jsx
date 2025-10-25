import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createJobListing, setAuthToken } from "../Adminapi";



const Employerjob = () => {
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState({
    jobTitle: "",
    description: "",
    totalVacancies: "",
    location: "",
    qualifications: "",
    responsibilities: "",
    salaryRange: ""


  });
  const [message, setMessage] = useState("");

  // ✅ Load existing company info
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);

    const fetchCompanyInfo = async () => {
      try {
        const data = await createJobListing();
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
      await createJobListing(companyData);
      setMessage("✅ Job listing created successfully!");
      navigate("/"); // redirect after save
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
            <div>
            <label className="block mb-1 font-medium">Job Title</label>
            <input
              type="text"   
                name="jobTitle"
                value={companyData.jobTitle}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                required
            />
            </div>
            <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea   
                name="description"
                value={companyData.description}
                onChange={handleChange}                     
                className="w-full border border-gray-300 p-2 rounded"                                           
                required
            />
            </div>  
            <div>
            <label className="block mb-1 font-medium">Total Vacancies</label>
            <input
              type="number"   
                name="totalVacancies"
                value={companyData.totalVacancies}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                required
            />
            </div>
            <div>
            <label className="block mb-1 font-medium">Location</label>
            <input
                type="text"
                name="location"
                value={companyData.location}
                onChange={handleChange}

                className="w-full border border-gray-300 p-2 rounded"
                required
            />  
            </div>

            <div>
            <label className="block mb-1 font-medium">Qualifications</label>
            <textarea   
                name="qualifications"
                value={companyData.qualifications}
                onChange={handleChange}                     
                className="w-full border border-gray-300 p-2 rounded"                                           
                required
            />
            </div>  
            <div>
            <label className="block mb-1 font-medium">Responsibilities</label>
            <textarea   
                name="responsibilities"
                value={companyData.responsibilities}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                required
            />
            </div>
            <div>
            <label className="block mb-1 font-medium">Salary Range</label>
            <input
                type="text"
                name="salaryRange"
                value={companyData.salaryRange}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                required
            />
            </div>


          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save Company Info</button>
        </form>
      </div>
    </div>
  );
};




         
export default Employerjob;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postresume, setAuthToken } from "./Api";

const CreateResume = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobilenumber: "",
    address: "",
    education: "",
    experience: "",
    skills: "",
    hoobys: "",
    resume: null,
    image: null,
    title: "",
    summary: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Set Auth Token
  const token = localStorage.getItem("token");
  if (token) setAuthToken(token);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = new FormData();
      Object.keys(formData).forEach((key) =>
        dataToSend.append(key, formData[key])
      );

      const response = await postresume(dataToSend);
      setMessage("✅ Resume uploaded successfully!");
      console.log(response);
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full max-w-3xl border border-white/30 transition transform hover:scale-[1.01] duration-300">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-indigo-700 drop-shadow-md">
          ✨ Create Your Resume
        </h2>

        {message && (
          <div
            className={`text-center mb-6 font-medium border py-2 rounded-xl ${
              message.includes("✅")
                ? "text-green-700 bg-green-50 border-green-200"
                : "text-red-700 bg-red-50 border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          {/* Left Column */}
          <div className="space-y-4">
            {["name", "email", "mobilenumber", "address", "education"].map((field) => (
              <input
                key={field}
                type={field === "email" ? "email" : "text"}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                required={["name", "email", "mobilenumber"].includes(field)}
              />
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {["experience", "skills", "hoobys", "title", "summary"].map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            ))}

            {/* Resume Upload */}
            <div className="border border-dashed border-indigo-400 rounded-xl p-3 bg-indigo-50/40 hover:bg-indigo-100 transition">
              <label className="block text-sm font-medium text-indigo-700 mb-1">
                Upload Resume (.pdf / .docx)
              </label>
              <input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-700"
                required
              />
            </div>

            {/* Profile Image Upload */}
            <div className="border border-dashed border-purple-400 rounded-xl p-3 bg-purple-50/40 hover:bg-purple-100 transition">
              <label className="block text-sm font-medium text-purple-700 mb-1">
                Upload Profile Image
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-700"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 mt-8">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold rounded-2xl py-3 shadow-lg transform hover:scale-[1.02] transition-all duration-300"
            >
              🚀 Upload Resume
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateResume;

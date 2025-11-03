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
    title: "",
    summary: "",
    resume: null,
    image: null,
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ✅ Set Auth Token from localStorage
  const token = localStorage.getItem("token");
  if (token) setAuthToken(token);

  // ✅ Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle file inputs
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, [e.target.name]: file }));
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = new FormData();

      // Append only non-empty fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          dataToSend.append(key, value);
        }
      });

      const response = await postresume(dataToSend);
      setMessage("✅ Resume uploaded successfully!");
      console.log("Upload success:", response);

      setTimeout(() => navigate("/getresumes"), 1500);
    } catch (err) {
      console.error("Upload error:", err);
      setMessage(`❌ ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full max-w-3xl border border-white/30 transition transform hover:scale-[1.01] duration-300">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-indigo-700 drop-shadow-md">
          ✨ Create Your Resume
        </h2>

        {/* ✅ Message */}
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

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          {/* Left Column */}
          <div className="space-y-4">
            {["name", "email", "mobilenumber", "address", "education"].map(
              (field) => (
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
              )
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {["experience", "skills", "hoobys", "title", "summary"].map(
              (field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
              )
            )}

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

              {/* ✅ Preview uploaded image */}
              {formData.image && (
                <div className="mt-3 flex justify-center">
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    className="w-28 h-28 rounded-xl object-cover border shadow"
                  />
                </div>
              )}
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

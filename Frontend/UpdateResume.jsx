import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getResumes, updateResume, setAuthToken } from "./Api";

const UpdateResume = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [resume, setResume] = useState({
    name: "",
    title: "",
    summary: "",
    experience: "",
    education: "",
    email: "",
    mobilenumber: "",
    address: "",
    skills: "",
    hobbies: "",
    resumeLink: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    setAuthToken(token);

    const fetchResume = async () => {
      try {
        const data = await getResumes();
        if (data.resumes?.[0]) {
          setResume(data.resumes[0]);
        } else {
          setError("No resume found. Please create one first.");
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResume((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await updateResume(id || resume._id, resume);
      setSuccess("Resume updated successfully!");
      setTimeout(() => navigate("/getresumes"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update resume.");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-blue-600 font-medium">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8 mt-6 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Update Resume
        </h2>

        {error && <p className="text-red-600 font-medium mb-4">{error}</p>}
        {success && <p className="text-green-600 font-medium mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={resume.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="text"
              name="title"
              value={resume.title}
              onChange={handleChange}
              placeholder="Title / Position"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Summary */}
          <textarea
            name="summary"
            value={resume.summary}
            onChange={handleChange}
            placeholder="Professional Summary"
            className="w-full p-2 border border-gray-300 rounded"
            rows={3}
          />

          {/* Experience */}
          <textarea
            name="experience"
            value={resume.experience}
            onChange={handleChange}
            placeholder="Work Experience"
            className="w-full p-2 border border-gray-300 rounded"
            rows={4}
          />

          {/* Education */}
          <textarea
            name="education"
            value={resume.education}
            onChange={handleChange}
            placeholder="Education"
            className="w-full p-2 border border-gray-300 rounded"
            rows={3}
          />

          {/* Contact Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="email"
              name="email"
              value={resume.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="mobilenumber"
              value={resume.mobilenumber}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Address */}
          <input
            type="text"
            name="address"
            value={resume.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full p-2 border border-gray-300 rounded"
          />

          {/* Skills */}
          <textarea
            name="skills"
            value={resume.skills}
            onChange={handleChange}
            placeholder="Skills (comma separated)"
            className="w-full p-2 border border-gray-300 rounded"
            rows={2}
          />

          {/* Hobbies */}
          <textarea
            name="hobbies"
            value={resume.hobbies}
            onChange={handleChange}
            placeholder="Hobbies"
            className="w-full p-2 border border-gray-300 rounded"
            rows={2}
          />

      

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Update Resume
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateResume;

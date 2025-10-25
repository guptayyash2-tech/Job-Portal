import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { applyForJob, getJobById, setAuthToken } from "../../Api";

const ApplyJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resume, setResume] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setAuthToken(token);

    const fetchJob = async () => {
      try {
        const data = await getJobById(jobId);
        setJob(data.job);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, navigate]);

  const handleApply = async () => {
    if (!resume) {
      setMessage("❌ Please upload your resume before applying.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("resume", resume);

      const res = await applyForJob(jobId, formData);
      setMessage("✅ " + res.message);
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Failed to apply"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500 text-lg font-medium">
        Loading job...
      </p>
    );

  if (!job)
    return (
      <p className="text-center mt-10 text-gray-500 text-lg font-medium">
        Job not found.
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl p-10">
        <h2 className="text-4xl font-extrabold text-blue-700 mb-6">
          {job.jobTitle}
        </h2>

        <div className="space-y-4 text-gray-800">
          <p>
            <span className="font-semibold text-gray-900">Description:</span>{" "}
            {job.description}
          </p>
          <p>
            <span className="font-semibold text-gray-900">Vacancies:</span>{" "}
            {job.totalVacancies}
          </p>
          <p>
            <span className="font-semibold text-gray-900">Location:</span>{" "}
            {job.location}
          </p>
          <p>
            <span className="font-semibold text-gray-900">Qualifications:</span>{" "}
            {job.qualifications}
          </p>
          <p>
            <span className="font-semibold text-gray-900">Experience:</span>{" "}
            {job.responsibilities}
          </p>
          <p>
            <span className="font-semibold text-gray-900">Salary:</span>{" "}
            {job.salaryRange}
          </p>
        </div>

        {/* Resume Upload */}
        <div className="mt-6">
          <label className="block mb-2 font-medium text-gray-700">
            Upload Resume (PDF/DOC):
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files[0])}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {message && (
          <p
            className={`mt-6 text-center text-lg font-medium ${
              message.includes("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <button
          onClick={handleApply}
          disabled={submitting}
          className={`mt-8 w-full py-3 rounded-2xl text-white font-bold text-lg transition-transform transform ${
            submitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
          }`}
        >
          {submitting ? "Applying..." : "Apply Now"}
        </button>
      </div>
    </div>
  );
};

export default ApplyJob;

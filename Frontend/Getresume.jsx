import React, { useEffect, useState } from "react";
import { getResumes, setAuthToken } from "./Api";
import { Link, useNavigate } from "react-router-dom";

const UserGetResume = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);

    const fetchResume = async () => {
      try {
        const data = await getResumes();
        // handle null, empty array, or empty object
        const firstResume = data?.resumes?.[0] || null;
        setResume(firstResume);
        console.log("Fetched resume:", firstResume);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load resume.");
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  const imageSrc = resume?.image ? `data:image/png;base64,${resume.image}` : null;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      {loading ? (
        <p className="text-sky-700 font-medium">Loading resume...</p>
      ) : error ? (
        <p className="text-red-600 font-semibold">{error}</p>
      ) : !resume || Object.keys(resume).length === 0 ? (
        // === No Resume ===
        <div className="bg-white shadow-lg rounded-xl p-10 max-w-md text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">No Resume Found</h2>
          <p className="text-gray-600 mb-6">
            You don’t have a resume yet. Create one to showcase your professional details.
          </p>
          <button
            onClick={() => navigate("/postresume")}
            className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ➕ Add Resume
          </button>
          <Link
            to="/"
            className="block mt-6 text-gray-600 hover:text-blue-600 transition"
          >
            ← Back to Home
          </Link>
        </div>
      ) : (
        // === Resume Found ===
        <div className="w-full max-w-5xl bg-white shadow-md rounded-xl overflow-hidden">
          {/* Header */}
          <header className="bg-gray-50 border-b border-gray-200 px-10 py-8 flex flex-col md:flex-row items-center gap-8">
            {imageSrc && (
              <div className="w-28 h-36 overflow-hidden rounded-lg border shadow bg-white">
                <img src={imageSrc} alt="Profile" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 text-center md:text-left">
              {resume.name && <h1 className="text-3xl font-bold text-gray-900">{resume.name}</h1>}
              {resume.title && <p className="text-lg text-gray-700 mt-1">{resume.title}</p>}
              {resume.summary && (
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">{resume.summary}</p>
              )}
            </div>
          </header>

          {/* Body */}
          <main className="grid md:grid-cols-3 gap-8 p-10 bg-white">
            <div className="md:col-span-2 space-y-8">
              {resume.experience && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">Work Experience</h2>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{resume.experience}</p>
                </section>
              )}
              {resume.education && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">Education</h2>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{resume.education}</p>
                </section>
              )}
            </div>

            <aside className="space-y-8">
              {(resume.email || resume.mobilenumber || resume.address) && (
                <section>
                  <h3 className="text-md font-semibold text-gray-800 border-b pb-1 mb-2">Contact</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {resume.email && <li>{resume.email}</li>}
                    {resume.mobilenumber && <li>{resume.mobilenumber}</li>}
                    {resume.address && <li>{resume.address}</li>}
                  </ul>
                </section>
              )}
              {resume.skills && (
                <section>
                  <h3 className="text-md font-semibold text-gray-800 border-b pb-1 mb-2">Skills</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{resume.skills}</p>
                </section>
              )}
              {resume.hobbies && (
                <section>
                  <h3 className="text-md font-semibold text-gray-800 border-b pb-1 mb-2">Hobbies</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{resume.hobbies}</p>
                </section>
              )}
            </aside>
          </main>

          {/* Footer */}
          <footer className="bg-gray-100 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 px-10 py-6">
            {resume.resumeLink && (
              <a
                href={resume.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                ⬇️ Download Resume
              </a>
            )}
            <div className="flex gap-3">
              <Link
                to={`/updateresume/${resume._id}`}
                className="bg-green-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-green-700 transition"
              >
                ✏️ Edit Resume
              </Link>
              <Link
                to="/"
                className="bg-gray-300 text-gray-800 font-medium px-5 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                🏠 Home
              </Link>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default UserGetResume;

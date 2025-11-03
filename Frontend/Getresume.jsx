import React, { useEffect, useState } from "react";
import { getResumes, setAuthToken } from "./Api";
import { Link, useNavigate } from "react-router-dom";

const UserGetResume = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🔹 Convert MongoDB Buffer to Base64 if needed
  const bufferToBase64 = (buffer) => {
    if (!buffer) return "";
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
    return window.btoa(binary);
  };

  // 🔹 Download base64 resume as file
  const downloadBase64File = (base64Data, fileName = "resume.pdf") => {
    try {
      const cleanedBase64 = base64Data.replace(/^data:.*;base64,/, "");
      const byteCharacters = atob(cleanedBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      let mimeType = "application/pdf";
      if (cleanedBase64.startsWith("UEsDB")) {
        mimeType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        fileName = "resume.docx";
      }

      const blob = new Blob([byteArray], { type: mimeType });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 10000);
    } catch (err) {
      console.error("❌ Error downloading file:", err);
      alert("Failed to download resume.");
    }
  };

  // 🔹 Fetch Resume
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);

    const fetchResume = async () => {
      try {
        const data = await getResumes();
        const firstResume = data?.resumes?.[0] || null;
        setResume(firstResume);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load resume.");
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  // 🔹 Handle image (supports both buffer & base64)
  const imageSrc =
    resume?.image && resume.image.data
      ? `data:image/png;base64,${bufferToBase64(resume.image.data)}`
      : resume?.image
      ? `data:image/png;base64,${resume.image}`
      : null;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      {loading ? (
        <p className="text-sky-700 font-medium">Loading resume...</p>
      ) : error ? (
        <p className="text-red-600 font-semibold">{error}</p>
      ) : !resume ? (
        // === No Resume Found ===
        <div className="bg-white shadow-lg rounded-xl p-10 max-w-md text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            No Resume Found
          </h2>
          <p className="text-gray-600 mb-6">
            You don’t have a resume yet. Create one to showcase your
            professional details.
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
        // === Resume Display ===
        <div className="w-full max-w-5xl bg-white shadow-md rounded-xl overflow-hidden">
          {/* Header */}
          <header className="bg-gray-50 border-b border-gray-200 px-10 py-8 flex flex-col md:flex-row items-center gap-8">
            {imageSrc && (
              <div className="w-28 h-36 overflow-hidden rounded-lg border shadow bg-white">
                <img
                  src={imageSrc}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 text-center md:text-left">
              {resume.name && (
                <h1 className="text-3xl font-bold text-gray-900">
                  {resume.name}
                </h1>
              )}
              {resume.title && (
                <p className="text-lg text-gray-700 mt-1">{resume.title}</p>
              )}
              {resume.summary && (
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                  {resume.summary}
                </p>
              )}
            </div>
          </header>

          {/* Main Body */}
          <main className="grid md:grid-cols-3 gap-8 p-10 bg-white">
            <div className="md:col-span-2 space-y-8">
              {resume.experience && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">
                    Work Experience
                  </h2>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {resume.experience}
                  </p>
                </section>
              )}
              {resume.education && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">
                    Education
                  </h2>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {resume.education}
                  </p>
                </section>
              )}
            </div>

            <aside className="space-y-8">
              {(resume.email || resume.mobilenumber || resume.address) && (
                <section>
                  <h3 className="text-md font-semibold text-gray-800 border-b pb-1 mb-2">
                    Contact
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {resume.email && <li>{resume.email}</li>}
                    {resume.mobilenumber && <li>{resume.mobilenumber}</li>}
                    {resume.address && <li>{resume.address}</li>}
                  </ul>
                </section>
              )}
              {resume.skills && (
                <section>
                  <h3 className="text-md font-semibold text-gray-800 border-b pb-1 mb-2">
                    Skills
                  </h3>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {resume.skills}
                  </p>
                </section>
              )}
              {resume.hoobys && (
                <section>
                  <h3 className="text-md font-semibold text-gray-800 border-b pb-1 mb-2">
                    Hobbies
                  </h3>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {resume.hoobys}
                  </p>
                </section>
              )}
            </aside>
          </main>

          {/* Footer */}
          <footer className="bg-gray-100 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 px-10 py-6">
            {resume.resumeLink && (
              <button
                onClick={() => downloadBase64File(resume.resumeLink)}
                className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                ⬇️ Download Resume
              </button>
            )}
            <div className="flex gap-3">
              <Link
                to={`/updateresume/${resume._id}`}
                className="bg-green-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-green-700 transition"
              >
                ✏️ Edit Resume
              </Link>
              <button
                onClick={() => navigate("/postresume")}
                className="bg-blue-500 text-white font-medium px-5 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                ➕ Add New
              </button>
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

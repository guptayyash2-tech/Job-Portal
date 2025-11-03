import React, { useEffect, useState } from "react";
import { getUserApplications, setAuthToken } from "../../Api";
import { useNavigate } from "react-router-dom";

const UserApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setAuthToken(token);

    const fetchApplications = async () => {
      try {
        const data = await getUserApplications();
        if (data.success) {
          setApplications(data.applications);
        }
      } catch (err) {
        setError("❌ Failed to fetch applications.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);

  const openResume = (base64Data) => {
    if (!base64Data) {
      alert("No resume found.");
      return;
    }
    try {
      const cleanedBase64 = base64Data.replace(/^data:.*;base64,/, "");
      let mimeType = "application/pdf";
      let fileExtension = "pdf";
      if (cleanedBase64.startsWith("UEsDB")) {
        mimeType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        fileExtension = "docx";
      }

      const byteCharacters = atob(cleanedBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);

      if (fileExtension === "pdf") {
        const newTab = window.open(blobUrl, "_blank");
        if (!newTab) alert("Please allow pop-ups to view PDF files.");
      } else {
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `resume.${fileExtension}`;
        link.click();
      }

      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    } catch (error) {
      console.error("❌ Error opening resume:", error);
      alert("Failed to open resume. The file may be corrupted.");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-indigo-600 font-semibold animate-pulse text-xl">
        Loading your applications...
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-10 text-red-600 font-bold bg-red-50 py-3 px-6 rounded-xl inline-block">
        {error}
      </p>
    );

  if (applications.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 p-6">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg text-center border border-indigo-100">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4">
            No Applications Yet
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have any approved or rejected applications yet.
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold shadow-md hover:scale-105 transition-transform"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 py-12 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border border-indigo-100">
        <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500 mb-10">
          📋 My Applications
        </h2>

        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-md">
          <table className="w-full border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <th className="p-4 text-left">#</th>
                <th className="p-4 text-left">Job Title</th>
                <th className="p-4 text-left">Location</th>
                <th className="p-4 text-left">Resume</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Applied On</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {applications.map((app, index) => (
                <tr
                  key={app._id}
                  className="hover:bg-indigo-50 transition-all duration-200"
                >
                  <td className="p-4 text-gray-700 font-medium">{index + 1}</td>
                  <td className="p-4 text-indigo-700 font-semibold">{app.jobListing?.jobTitle || "N/A"}</td>
                  <td className="p-4 text-gray-700">{app.jobListing?.location || "N/A"}</td>
                  <td className="p-4">
                    {app.resume ? (
                      <button
                        onClick={() => openResume(app.resume)}
                        className="text-blue-600 hover:text-blue-800 underline font-medium"
                      >
                        Preview / Download
                      </button>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                <td className="p-4">
  {app.status === "approved" ? (
    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
      Approved
    </span>
  ) : app.status === "rejected" ? (
    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
      Rejected
    </span>
  ) : (
    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
      Pending
    </span>
  )}
</td>

                  <td className="p-4 text-gray-500">{new Date(app.appliedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold shadow-md hover:scale-105 transition-transform"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserApplications;

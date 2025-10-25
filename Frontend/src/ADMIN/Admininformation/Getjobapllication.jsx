import React, { useEffect, useState } from "react";
import {
  getAllApplications,
  setAuthToken,
  approveApplication,
  rejectApplication,
} from "../Adminapi";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setAuthToken(token);

    const fetchApplications = async () => {
      try {
        const data = await getAllApplications();
        if (data.success) {
          setApplications(data.applications);
          setFilteredApps(data.applications);
        }
      } catch (err) {
        setError("Failed to fetch job applications.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredApps(applications);
    } else {
      const lowerSearch = search.toLowerCase();
      const filtered = applications.filter(
        (app) =>
          app.user?.username?.toLowerCase().includes(lowerSearch) ||
          app.jobListing?.jobTitle?.toLowerCase().includes(lowerSearch) ||
          app.user?.emailid?.toLowerCase().includes(lowerSearch)
      );
      setFilteredApps(filtered);
    }
  }, [search, applications]);

    const openResume = (base64Data) => {
    try {
      if (!base64Data) {
        alert("No resume found.");
        return;
      }

      const cleanedBase64 = base64Data.replace(/^data:.*;base64,/, "");

      // Detect type
      let mimeType = "application/pdf";
      let fileExtension = "pdf";
      if (cleanedBase64.startsWith("UEsDB")) {
        mimeType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        fileExtension = "docx";
      }

      // Convert base64 to Blob
      const byteCharacters = atob(cleanedBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);

      // PDF → open | DOCX → download
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


  const handleApprove = async (id) => {
    if (!window.confirm("Approve this application?")) return;
    try {
      await approveApplication(id);
      alert("✅ Application approved!");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to approve.");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this application?")) return;
    try {
      await rejectApplication(id);
      alert("❌ Application rejected!");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to reject.");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-indigo-600 font-medium animate-pulse">
        Loading applications...
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-10 text-red-500 font-semibold bg-red-50 py-3 px-4 rounded-xl inline-block">
        {error}
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-12 px-6">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-indigo-100">
        <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500 mb-10">
          📋 Job Applications
        </h2>

        {/* 🔍 Search Bar */}
        <div className="flex justify-center mb-10">
          <input
            type="text"
            placeholder="🔎 Search by name, email, or job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-2/3 p-3 rounded-full border border-indigo-300 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
          />
        </div>

        {filteredApps.length === 0 ? (
          <p className="text-center text-gray-600 text-lg font-medium">
            No matching applications found.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-md">
            <table className="w-full border-collapse text-sm md:text-base">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <th className="p-4 text-left">#</th>
                  <th className="p-4 text-left">Applicant</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Job Title</th>
                  <th className="p-4 text-left">Location</th>
                  <th className="p-4 text-left">Resume</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Actions</th>
                  <th className="p-4 text-left">Applied On</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {filteredApps.map((app, index) => (
                  <tr
                    key={app._id}
                    className="hover:bg-indigo-50 transition-all duration-200"
                  >
                    <td className="p-4 text-gray-700">{index + 1}</td>
                    <td className="p-4 font-semibold text-gray-800 flex items-center gap-3">
                      {app.user?.image ? (
                        <img
                          src={`data:image/jpeg;base64,${app.user.image}`}
                          alt="user"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                          {app.user?.username?.[0]?.toUpperCase()}
                        </span>
                      )}
                      {app.user?.username || "N/A"}
                    </td>
                    <td className="p-4 text-gray-600">
                      {app.user?.emailid || "N/A"}
                    </td>
                    <td className="p-4 text-indigo-700 font-medium">
                      {app.jobListing?.jobTitle || "N/A"}
                    </td>
                    <td className="p-4 text-gray-700">
                      {app.jobListing?.location || "N/A"}
                    </td>
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
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => handleApprove(app._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-full text-sm transition-transform hover:scale-105 shadow-md"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(app._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full text-sm transition-transform hover:scale-105 shadow-md"
                      >
                        Reject
                      </button>
                    </td>
                    <td className="p-4 text-gray-500">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApplications;

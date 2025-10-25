import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { deleteJobListingById, getAllJobListings, setAuthToken } from "../Adminapi";

const GetjobListings = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    setAuthToken(token);

    const fetchJobListings = async () => {
      try {
        const data = await getAllJobListings();
        if (data.jobs && data.jobs.length > 0) {
          setJobs(data.jobs);
        } else {
          setError("No job listings found. Please add one.");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch job listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobListings();
  }, [navigate]);

  const handleDelete = async (jobId) => {
    try {
      await deleteJobListingById(jobId);
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
    } catch (err) {
      setError(err.message || "Failed to delete job listing.");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-12 text-gray-500 text-lg font-medium">
        Loading job listings...
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-14">
          Job Listings
        </h2>

        {jobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
                >
                  <h3 className="text-2xl font-bold text-blue-600 mb-5">
                    {job.jobTitle}
                  </h3>
                  <div className="space-y-3 text-gray-800">
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
                      <span className="font-semibold text-gray-900">Responsibilities:</span>{" "}
                      {job.responsibilities}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">Salary:</span>{" "}
                      {job.salaryRange}
                    </p>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => navigate(`/createjoblisting/${job._id}`)}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      className="flex-1 bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-colors duration-200 font-semibold"
                      onClick={() => handleDelete(job._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/createjoblisting")}
              className="mt-12 w-full bg-green-600 text-white py-4 rounded-2xl hover:bg-green-700 transition-colors duration-200 text-lg font-bold"
            >
              Add More Job Listings
            </button>
          </>
        ) : (
          <div className="text-center mt-12">
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={() => navigate("/createjoblisting")}
              className="px-8 py-4 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-colors duration-200 font-semibold text-lg"
            >
              Add Job Listing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetjobListings;

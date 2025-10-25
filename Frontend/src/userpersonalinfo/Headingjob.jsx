import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllJob, setAuthToken } from "../../Api";

const HeadingJob = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setAuthToken(token);

    const fetchJobs = async () => {
      try {
        const data = await getAllJob();
        if (data.jobs) {
          setJobs(data.jobs);
          setFilteredJobs(data.jobs);
        }
      } catch (err) {
        console.error("❌ Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [navigate]);

  // Filtering logic
  useEffect(() => {
    let filtered = jobs;

    // Keyword search (title + description)
    if (search) {
      filtered = filtered.filter(
        (job) =>
          job.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
          job.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Job Type filter (matches inside jobTitle)
    if (jobType) {
      filtered = filtered.filter(
        (job) =>
          job.jobTitle &&
          job.jobTitle.toLowerCase().includes(jobType.toLowerCase())
      );
    }

    // Location filter
    if (location) {
      filtered = filtered.filter(
        (job) =>
          job.location &&
          job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [search, jobType, location, jobs]);

  if (loading)
    return (
      <p className="text-center mt-10 text-blue-600 font-medium animate-pulse">
        Loading jobs...
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-10">
      <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-10">
        🌟 Find Your Dream Job
      </h2>

      {/* Search & Filter Section */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-10 max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="🔍 Search by keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Job Types</option>
          <option value="Backend">Backend</option>
          <option value="Frontend">Frontend</option>
          <option value="Data Science">Data Science</option>
          <option value="Web Developer">Web Developer</option>
        </select>

        <input
          type="text"
          placeholder="📍 Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      {/* Job Listings */}
      {filteredJobs.length === 0 ? (
        <p className="text-center text-gray-600 text-lg font-medium">
          No matching jobs found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <Link
                to={`/applyjob/${job._id}`}
                className="block text-2xl font-bold text-indigo-600 mb-3 hover:text-indigo-800 hover:underline transition-colors duration-200 truncate"
                title={job.jobTitle}
              >
                {job.jobTitle}
              </Link>

              <p className="text-gray-700 mb-2 line-clamp-2">
                <span className="font-semibold text-gray-900">
                  Description:
                </span>{" "}
                {job.description}
              </p>

              <p className="text-gray-700 mb-1">
                <span className="font-semibold text-gray-900">Location:</span>{" "}
                {job.location}
              </p>

              <div className="mt-4">
                <Link
                  to={`/applyjob/${job._id}`}
                  className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-full font-medium shadow-md hover:scale-105 transition-transform"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeadingJob;

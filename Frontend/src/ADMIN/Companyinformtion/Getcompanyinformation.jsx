import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { getCompanyInformationByUserId, setAuthToken } from "../Adminapi";

const GetCompanyInformation = () => {
  const navigate = useNavigate();
  const [information, setInformation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirect if not logged in
      return;
    }

    setAuthToken(token);

    const fetchCompanyInfo = async () => {
      try {
        const data = await getCompanyInformationByUserId();

        if (data.company) {
          setInformation(data.company);
        } else {
          setError("No company information found. Please add it.");
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setError("No company information found. Please add it.");
        } else {
          setError(err.message || "Failed to fetch company information.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyInfo();
  }, [navigate]);

  if (loading)
    return <p className="text-center mt-6 text-gray-600 text-lg">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8 mb-6">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
          Company Information
        </h2>

        {information ? (
          <div className="space-y-3 text-gray-800">
            <p>
              <span className="font-semibold text-blue-600">Company Name:</span>{" "}
              {information.companyName}
            </p>
            <p>
              <span className="font-semibold text-blue-600">Email:</span>{" "}
              {information.companyEmail}
            </p>
            <p>
              <span className="font-semibold text-blue-600">Phone:</span>{" "}
              {information.companyPhone}
            </p>
            <p>
              <span className="font-semibold text-blue-600">Website:</span>{" "}
              {information.website}
            </p>
            <p>
              <span className="font-semibold text-blue-600">Address:</span>{" "}
              {information.address}
            </p>
            <p>
              <span className="font-semibold text-blue-600">City:</span>{" "}
              {information.city}
            </p>
            <p>
              <span className="font-semibold text-blue-600">Pincode:</span>{" "}
              {information.pincode}
            </p>
            <p>
              <span className="font-semibold text-blue-600">
                Contact Person:
              </span>{" "}
              {information.contactPersonName}
            </p>
            <p>
              <span className="font-semibold text-blue-600">
                Contact Email:
              </span>{" "}
              {information.contactPersonEmail}
            </p>
            <p>
              <span className="font-semibold text-blue-600">
                Contact Phone:
              </span>{" "}
              {information.contactPersonPhone}
            </p>

            <button
              onClick={() => navigate("/updatecompanyinfo")}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200"
            >
              Edit Company Info
            </button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-red-500 font-medium">{error}</p>
            <button
              onClick={() => navigate("/companycreate")}
              className="w-full bg-green-600 text-white py-2 rounded-lg shadow hover:bg-green-700 transition duration-200"
            >
              Add Company Info
            </button>
          </div>
        )}
      </div>

      <Link
        to="/"
        className="w-full max-w-lg text-center bg-gray-600 text-white py-2 rounded-lg shadow hover:bg-gray-700 transition duration-200"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default GetCompanyInformation;

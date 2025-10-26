import React, { useEffect, useState } from "react";
import { getPersonalInfo, setAuthToken } from "../../Api";
import { Link } from "react-router-dom";

const UserGetPersonalInfo = () => {
  const [user, setUser] = useState(null);       // holds personal info when present
  const [loading, setLoading] = useState(true);
  const [noInfo, setNoInfo] = useState(false);  // true when backend returns 404 (no personal info)
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true; // prevent state updates after unmount

    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);

    const fetchProfile = async () => {
      try {
        const data = await getPersonalInfo();
        // controller returns { user: userInfo } on success
        if (!isMounted) return;
        setUser(data.user ?? data);
        setNoInfo(false);
      } catch (err) {
        if (!isMounted) return;

        const status = err.response?.status;
        // If backend responds 404 -> personal info not found -> show Add Personal Info screen
        if (status === 404) {
          setUser(null);
          setNoInfo(true);
          setError("");
        } else if (status === 401) {
          setError("Unauthorized. Please login again.");
        } else {
          setError(err.response?.data?.message || err.message || "Something went wrong");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  // Loading state
  if (loading)
    return (
      <p className="text-center mt-10 text-indigo-600 font-medium animate-pulse">
        Loading profile...
      </p>
    );

  // Error state (non-404)
  if (error)
    return (
      <p className="text-center mt-10 text-red-500 font-semibold bg-red-50 py-3 px-4 rounded-xl inline-block">
        {error}
      </p>
    );

  // No personal info found (404)
  if (noInfo)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 p-6">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md text-center border border-indigo-100">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4">
            No Personal Information Found 📝
          </h2>
          <p className="text-gray-600 mb-6">
            It looks like you haven’t added your personal info yet. Add it now to complete your profile!
          </p>
          <Link
            to="/savepersonalinfo"
            className="inline-block bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-full font-semibold shadow-md hover:scale-105 transition-transform"
          >
            ➕ Add Personal Info
          </Link>
        </div>
      </div>
    );

  // Success state: show user info (user exists)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md border border-indigo-100">
        <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">
          User Profile Information
        </h2>

        <div className="space-y-4">
          {[
            { label: "Address", value: user?.address },
            { label: "Pincode", value: user?.pincode },
            { label: "City", value: user?.city },
            { label: "Mobile 1", value: user?.mobilenumber1 },
            { label: "Mobile 2", value: user?.mobilenumber2 },
          ].map((field, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl transition-shadow shadow-sm hover:shadow-md ${
                [
                  "bg-indigo-50 hover:bg-indigo-100",
                  "bg-purple-50 hover:bg-purple-100",
                  "bg-pink-50 hover:bg-pink-100",
                  "bg-green-50 hover:bg-green-100",
                  "bg-yellow-50 hover:bg-yellow-100",
                ][idx]
              }`}
            >
              <label className="block text-sm text-gray-600 font-medium">{field.label}:</label>
              <p className="text-lg font-semibold text-gray-900 mt-1">{field.value || "N/A"}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link
            to="/updatepersonalinfo"
            className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full font-medium shadow-md hover:scale-105 transition-transform"
          >
            ✏️ Edit Personal Info
          </Link>
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-2 rounded-full font-medium shadow-md hover:scale-105 transition-transform"
          >
            🏠 Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserGetPersonalInfo;

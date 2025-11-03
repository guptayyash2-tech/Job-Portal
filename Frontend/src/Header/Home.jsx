import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const guestLinks = [
  { to: "/register", label: "User Register", style: "bg-gradient-to-r from-white to-indigo-200 text-indigo-700" },
  { to: "/login", label: "User Login", style: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" },
  { to: "/adminregister", label: "Admin Register", style: "bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-600 text-white shadow-lg" },
  { to: "/adminlogin", label: "Admin Login", style: "bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-lg" },
];

const userLinks = [
  { to: "/getpersonalinfo", label: "User Personal Info", style: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white" },

  { to: "/usergetprofile", label: "User Profile", style: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white" },
  { to: "applyjob", label: "Show Job Detail", style: "bg-gradient-to-r from-sky-500 to-blue-600 text-white" },
  {to : "/applications" ,label :"Track Job",style: "bg-gradient-to-r from-sky-500 to-blue-600 text-white"}
];

const adminLinks = [
  { to: "/admingetprofile", label: "Admin Profile", style: "bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white shadow-xl" },
  { to: "/getjoblistings", label: "Get Job Listing", style: "bg-gradient-to-r from-indigo-500 via-blue-600 to-cyan-400 text-white shadow-xl" },
  { to: "/getcompanyinfo", label: "Get Company Info", style: "bg-gradient-to-r from-blue-500 via-sky-500 to-teal-400 text-white shadow-xl" },
  { to: "/getjobapplications", label: "Get All Job Applications", style: "bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 text-white shadow-xl" },
];

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));
  const [role, setRole] = useState(() => localStorage.getItem("role"));
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
    navigate("/");
  };

  // Animated gradient background
  const baseBg = "bg-gradient-to-r animate-gradient-slow bg-[length:200%_200%]";
  const bgClass = !isLoggedIn
    ? `${baseBg} from-indigo-500 via-purple-500 to-pink-500`
    : role === "user"
    ? `${baseBg} from-emerald-500 via-teal-500 to-green-600`
    : `${baseBg} from-blue-600 via-indigo-600 to-fuchsia-600`; // admin theme more colorful

  const welcomeMessage = !isLoggedIn
    ? "Welcome to Job.com 🚀"
    : role === "user"
    ? "Welcome back, Job Seeker! 👩‍💻"
    : "Welcome back, Admin! ⚙️";

  const subheadingMessage = !isLoggedIn
    ? "Please login or register to continue."
    : role === "user"
    ? "Find your dream job and take the next step in your career!"
    : "Manage listings, monitor data, and lead with style!";

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center text-white relative overflow-hidden ${bgClass}`}>
      {/* translucent layer for readability */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      {/* top buttons */}
      <div className="absolute top-6 right-8 flex flex-wrap gap-3 z-10">
        {!isLoggedIn ? (
          guestLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`${link.style} font-semibold px-5 py-2 rounded-xl shadow-lg hover:scale-110 hover:shadow-2xl hover:brightness-110 transition-all duration-300`}
            >
              {link.label}
            </Link>
          ))
        ) : (
          <>
            {role === "admin" &&
              adminLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`${link.style} font-semibold px-5 py-2 rounded-xl hover:scale-110 hover:shadow-2xl hover:brightness-110 transition-all duration-300`}
                >
                  {link.label}
                </Link>
              ))
            }

            {role === "user" &&
              userLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`${link.style} font-semibold px-5 py-2 rounded-xl hover:scale-110 hover:shadow-2xl hover:brightness-110 transition-all duration-300`}
                >
                  {link.label}
                </Link>
              ))
            }

            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 font-semibold px-5 py-2 rounded-xl shadow-xl hover:scale-110 transition-all duration-300"
            >
              Logout
            </button>
          </>
        )}
      </div>

      {/* main content */}
      <div className="relative text-center px-6 mt-20 z-10">
        <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg animate-pulse">
          {welcomeMessage}
        </h1>

        <p className="text-lg mb-6 text-white/90">{subheadingMessage}</p>

        {!isLoggedIn && (
          <p className="text-sm text-white/70">Please login or register to continue.</p>
        )}
      </div>

      {/* footer */}
      <p className="absolute bottom-4 text-sm text-white/70 z-10">
        &copy; 2025 Dream Job. All rights reserved.
      </p>
    </div>
  );
};

export default Home;

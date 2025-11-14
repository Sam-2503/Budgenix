import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/sidebar";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const handleLogout = () => {
    // Add logout logic here

    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    // Clear authentication data
    console.log("Logging out...");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // Call logout from auth context if available
    if (logout) {
      logout();
    }

    setShowLogoutConfirm(false);

    // Redirect to welcome page after a short delay
    setTimeout(() => {
      navigate("/");
    }, 300);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleDeleteAccount = () => {
    // Add delete account logic here
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      console.log("Deleting account...");
    }
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  const handleReportBug = () => {
    // Open GitHub issues page in a new window
    window.open("https://github.com/kaihere14/Budgenix/issues", "_blank");
  };

  const handleContact = () => {
    // Add contact logic here
    console.log("Opening contact...");
  };

  const settingsButtons = [
    {
      id: "logout",
      icon: "🚪",
      label: "Log Out",
      onClick: handleLogout,
      variant: "default",
    },
    {
      id: "report",
      icon: "🐛",
      label: "Report a Bug",
      onClick: handleReportBug,
      variant: "default",
    },
    {
      id: "contact",
      icon: "📧",
      label: "Contact Support",
      onClick: handleContact,
      variant: "default",
    },
    {
      id: "delete",
      icon: "🗑️",
      label: "Delete Account",
      onClick: handleDeleteAccount,
      variant: "danger",
    },
  ];

  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl font-semibold text-white mb-3">Settings</h1>
          <p className="text-zinc-400">
            Manage your account preferences and application settings
          </p>
        </header>

        <div className="max-w-3xl">
          {/* User Profile Section */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-6">
              {/* Profile Picture */}
              <div className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-zinc-700">
                <span className="text-white text-xl font-semibold">
                  {user?.username
                    ? getInitial(user.username)
                    : user?.email?.charAt(0).toUpperCase() || "NA"}
                </span>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-1">
                  {user.username || "No Username"}
                </h2>
                <p className="text-zinc-400 mb-2">
                  {user?.email || "No email provided"}
                </p>
                <div className="flex items-center space-x-4 text-sm text-zinc-500">
                  <span className="flex items-center space-x-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z"
                      />
                    </svg>
                    <span>
                      Member since{" "}
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })
                        : "Recently"}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Settings List */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg divide-y divide-zinc-800">
            {/* Sign Out */}
            <Link to="/">
              <div
                className="p-6 hover:bg-zinc-800/50 transition-colors cursor-pointer"
                onClick={handleLogout}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-zinc-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Sign Out</h3>
                      <p className="text-zinc-400 text-sm">
                        Sign out of your account
                      </p>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Report Issue */}
            <a
              href="https://github.com/kaihere14/Budgenix/issues"
              target="_blank"
            >
              <div
                className="p-6 hover:bg-zinc-800/50 transition-colors cursor-pointer"
                onClick={handleReportBug}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-zinc-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.193 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Report Issue</h3>
                      <p className="text-zinc-400 text-sm">
                        Report bugs or request features
                      </p>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </a>

            {/* Contact Support */}
            <Link to="/contact">
              <div
                className="p-6 hover:bg-zinc-800/50 transition-colors cursor-pointer"
                onClick={handleContact}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-zinc-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">
                        Contact Support
                      </h3>
                      <p className="text-zinc-400 text-sm">
                        Get help from our support team
                      </p>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Delete Account */}
            <div
              className="p-6 hover:bg-red-900/10 transition-colors cursor-pointer border-t border-red-800/20"
              onClick={handleDeleteAccount}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-red-900/20 border border-red-800/30 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-red-400 font-medium">Delete Account</h3>
                    <p className="text-zinc-400 text-sm">
                      Permanently delete your account and data
                    </p>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;

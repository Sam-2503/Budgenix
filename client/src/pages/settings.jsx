import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/sidebar";
import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
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

  const getButtonStyles = (variant) => {
    const baseStyles =
      "w-full px-6 py-3 rounded-lg text-left font-medium transition-colors flex items-center justify-between";

    switch (variant) {
      case "danger":
        return `${baseStyles} bg-zinc-800 border border-red-800 hover:bg-red-900/20 text-white`;
      default:
        return `${baseStyles} bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-white`;
    }
  };

  const getTextStyles = (variant) => {
    return variant === "danger" ? "text-red-400" : "";
  };

  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-2xl px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-white mb-2">
              Account Settings
            </h1>
            <p className="text-zinc-400">Manage your account and get support</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <div className="space-y-4">
              {settingsButtons.map((button) => (
                <button
                  key={button.id}
                  onClick={button.onClick}
                  className={getButtonStyles(button.variant)}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`text-xl ${getTextStyles(button.variant)}`}
                    >
                      {button.icon}
                    </span>
                    <span className={getTextStyles(button.variant)}>
                      {button.label}
                    </span>
                  </div>
                  <span
                    className={
                      button.variant === "danger"
                        ? "text-red-400"
                        : "text-zinc-400"
                    }
                  >
                    →
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-700">
              <p className="text-sm text-zinc-500 text-center">
                Need help? Contact our support team or report any issues you
                encounter.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 max-w-sm w-full mx-4">
            <h2 className="text-xl font-semibold text-white mb-2">Log Out</h2>
            <p className="text-zinc-400 mb-6">
              Are you sure you want to log out? You'll need to log in again to
              access your account.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded-lg bg-red-900 border border-red-800 hover:bg-red-800 text-white font-medium transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;

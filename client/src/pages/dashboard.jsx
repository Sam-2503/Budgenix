import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import RecentActivity from "../components/recentActivity";
import { Sidebar } from "../components/sidebar";
import { StatCard } from "../components/card";
import { Chart } from "../components/categoryCard";
import { AddExpenseModal } from "../components/AddExpenseModal";
import { useAuth } from "../context/AuthContext";
import { useExpense } from "../context/ExpenseContext";
import VoiceAssistant from "../components/voicechat";

export const Dashboard = () => {
  const { user, isFetchingUserData, isLoading } = useAuth();
  const { expenses, getTotalSpent, getTotalIncome } = useExpense();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // responsive sidebar

  useEffect(() => {
    if (!isLoading && !isFetchingUserData) {
      const token = localStorage.getItem("accessToken");
      if (!token || !user) {
        toast.error("Please login to continue", {
          duration: 3000,
          position: "top-center",
        });
        navigate("/login");
        return;
      }
    }
  }, [isLoading, isFetchingUserData, user, navigate]);

  const totalSpent = getTotalSpent();
  const additionalIncome = getTotalIncome();
  const initialIncome = user?.income || 0;
  const totalIncome = initialIncome + additionalIncome;
  const budgetRemaining = totalIncome - totalSpent;

  const spendPercentage =
    totalIncome > 0 ? ((totalSpent / totalIncome) * 100).toFixed(1) : 0;

  const remainingPercentage =
    totalIncome > 0
      ? Math.max(0, Math.floor((budgetRemaining / totalIncome) * 100))
      : 0;

  if (isLoading || isFetchingUserData) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-zinc-800 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen w-full bg-black flex">

      {/* RESPONSIVE SIDEBAR */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8">

        {/* HEADER SECTION */}
        <header className="mb-8">

          {/* TOP ROW (hamburger + title + desktop button) */}
          <div className="flex items-center justify-between md:justify-start md:gap-4">

            {/* HAMBURGER FOR MOBILE */}
            <button
              className="p-2 rounded-md bg-zinc-900 border border-zinc-800 text-white md:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                fill="none"
              >
                <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* WELCOME TEXT */}
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-white">
                Welcome back, {user.username}
              </h1>
              <p className="mt-1 text-sm text-zinc-400">
                Here's your financial overview for this month
              </p>
            </div>

            {/* DESKTOP ADD EXPENSE BUTTON */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-white hover:bg-zinc-100 text-black font-medium rounded-lg transition shadow-lg ml-auto"
            >
              <Plus size={20} />
              Add Expense
            </button>
          </div>

          {/* MOBILE ADD EXPENSE BUTTON (full width) */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="md:hidden mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-zinc-100 text-black font-medium rounded-lg transition shadow-lg"
          >
            <Plus size={20} />
            Add Expense
          </button>

        </header>

        {/* MAIN DASHBOARD SECTIONS */}
        <section className="space-y-6">

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard
              title="Total Income"
              value={totalIncome}
              trend="neutral"
              trendText={
                additionalIncome > 0
                  ? `₹${initialIncome.toLocaleString(
                      "en-IN"
                    )} + ₹${additionalIncome.toLocaleString("en-IN")} added`
                  : `${user.categories?.length || 0} budget categories`
              }
            />

            <StatCard
              title="Total Spent this Month"
              value={totalSpent}
              trend={totalSpent > 0 ? "down" : "neutral"}
              trendText={
                totalSpent > 0 ? `${spendPercentage}% of income` : "No expenses yet"
              }
            />

            <StatCard
              title="Budget Remaining"
              value={budgetRemaining}
              trend={budgetRemaining > 0 ? "up" : "down"}
              trendText={`${remainingPercentage}% remaining`}
            />
          </div>

          {/* CATEGORY TAGS */}
          {user.categories && user.categories.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Your Budget Categories
              </h2>
              <div className="flex flex-wrap gap-2">
                {user.categories.map((category, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg text-sm font-medium"
                  >
                    {category}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CHART + RECENT ACTIVITY */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Chart categories={user.categories} expenses={expenses} />
            <RecentActivity expenses={expenses} />
          </div>
        </section>
      </main>

      {/* ADD EXPENSE MODAL */}
      <AddExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <VoiceAssistant />

    </div>
  );
};

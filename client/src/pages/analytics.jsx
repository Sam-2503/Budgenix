import React, { useState, useMemo } from "react";
import { Sidebar } from "../components/sidebar";
import { Chart } from "../components/categoryCard";
import { useExpense } from "../context/ExpenseContext";
import { useAuth } from "../context/AuthContext";

export function Analytics() {
  const { expenses } = useExpense();
  const { user } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // MOBILE SIDEBAR
  const [selectedTimeRange, setSelectedTimeRange] = useState("30days");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const timeRanges = [
    { value: "7days", label: "Last 7 days" },
    { value: "30days", label: "Last 30 days" },
    { value: "3months", label: "Last 3 months" },
    { value: "6months", label: "Last 6 months" },
    { value: "year", label: "This year" },
  ];

  // categories from user profile
  const categories = useMemo(() => {
    const userCategories = user?.categories || [];
    return [
      { value: "all", label: "All Categories" },
      ...userCategories.map((cat) => ({
        value: cat.toLowerCase(),
        label: cat,
      })),
    ];
  }, [user?.categories]);

  // filter expenses based on time and category
  const filteredExpenses = useMemo(() => {
    const now = new Date();
    const filterDate = new Date();

    switch (selectedTimeRange) {
      case "7days":
        filterDate.setDate(now.getDate() - 7);
        break;
      case "30days":
        filterDate.setDate(now.getDate() - 30);
        break;
      case "3months":
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case "6months":
        filterDate.setMonth(now.getMonth() - 6);
        break;
      case "year":
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    let filtered = expenses.filter((exp) => {
      const d = new Date(exp.date);
      return d >= filterDate && exp.type === "expense";
    });

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (exp) => exp.category?.toLowerCase() === selectedCategory
      );
    }

    return filtered;
  }, [expenses, selectedTimeRange, selectedCategory]);

  return (
    <div className="min-h-screen w-full bg-black flex">
      {/* RESPONSIVE SIDEBAR */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* MAIN */}
      <main className="flex-1 p-4 md:p-8">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-start gap-4 md:items-center">
            {/* MOBILE HAMBURGER */}
            <button
              className="p-2 rounded-md bg-zinc-900 border border-zinc-800 text-white md:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg
                className="w-6 h-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* TITLE */}
            <div className="pt-1">
              <h1 className="text-2xl md:text-3xl font-semibold text-white mb-1">
                Financial Analytics
              </h1>
              <p className="text-zinc-400">
                Detailed insights into your financial activity
              </p>
            </div>
          </div>
        </div>

        {/* FILTERS CARD */}
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Time Range */}
            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Time Range
              </label>
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-zinc-600 rounded-lg text-white text-sm focus:border-zinc-500"
              >
                {timeRanges.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Focus Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-zinc-600 rounded-lg text-white text-sm focus:border-zinc-500"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* CHART BLOCK */}
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 mb-8">
          <h3 className="text-lg font-semibold text-white mb-6">
            Overall Spending by Category
          </h3>
          <Chart categories={user?.categories} expenses={filteredExpenses} />
        </div>

        {/* CATEGORY BREAKDOWN */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user?.categories?.map((category) => {
            const categoryExpenses = filteredExpenses.filter(
              (exp) => exp.category?.toLowerCase() === category.toLowerCase()
            );

            const total = categoryExpenses.reduce(
              (s, exp) => s + exp.amount,
              0
            );

            return (
              <div
                key={category}
                className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <div className="flex justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">
                    {category}
                  </h4>
                  <span className="text-sm text-zinc-400">
                    {categoryExpenses.length}{" "}
                    {categoryExpenses.length === 1 ? "expense" : "expenses"}
                  </span>
                </div>

                <p className="text-2xl font-bold text-white">
                  ₹{total.toLocaleString("en-IN")}
                </p>

                {/* Recent expenses */}
                {categoryExpenses.length > 0 ? (
                  <div className="mt-4 border-t border-zinc-700 pt-3">
                    <p className="text-xs text-zinc-500 mb-2">
                      Recent expenses:
                    </p>

                    <div className="space-y-1">
                      {categoryExpenses.slice(0, 3).map((exp, i) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span className="text-zinc-400 truncate">
                            {exp.title || exp.description || "Expense"}
                          </span>
                          <span className="text-zinc-300 ml-2">
                            ₹{exp.amount.toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 mt-2">No expenses yet</p>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

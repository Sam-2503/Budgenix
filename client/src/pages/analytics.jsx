import React, { useState, useMemo } from "react";
import { Sidebar } from "../components/sidebar";
import { Chart } from "../components/categoryCard";
import { useExpense } from "../context/ExpenseContext";
import { useAuth } from "../context/AuthContext";

export function Analytics() {
  const { expenses } = useExpense();
  const { user } = useAuth();
  const [selectedTimeRange, setSelectedTimeRange] = useState("30days");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const timeRanges = [
    { value: "7days", label: "Last 7 days" },
    { value: "30days", label: "Last 30 days" },
    { value: "3months", label: "Last 3 months" },
    { value: "6months", label: "Last 6 months" },
    { value: "year", label: "This year" },
  ];

  // Get categories from user profile
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

  // Filter expenses by time range
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
      default:
        filterDate.setDate(now.getDate() - 30);
    }

    let filtered = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= filterDate && expense.type === "expense";
    });

    // Apply category filter if not "all"
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (expense) => expense.category?.toLowerCase() === selectedCategory
      );
    }

    return filtered;
  }, [expenses, selectedTimeRange, selectedCategory]);

  return (
    <div className="min-h-screen w-full bg-black flex">
      <Sidebar />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">
            Financial Analytics
          </h1>
          <p className="text-zinc-400">
            Comprehensive insights into your spending patterns and financial
            trends
          </p>
        </div>

        {/* Filters */}
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Time Range Filter */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Time Range
              </label>
              <select
                className="w-full px-3 py-2 bg-black border border-zinc-600 rounded-lg text-white text-sm focus:outline-none focus:border-zinc-500"
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
              >
                {timeRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Focus Category
              </label>
              <select
                className="w-full px-3 py-2 bg-black border border-zinc-600 rounded-lg text-white text-sm focus:outline-none focus:border-zinc-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="space-y-8">
          {/* Overall Spending Overview - Full Width */}
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h3 className="text-lg font-semibold text-white mb-6">
              Overall Spending by Category
            </h3>
            <Chart categories={user?.categories} expenses={filteredExpenses} />
          </div>

          {/* Category Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user?.categories?.map((category) => {
              const categoryExpenses = filteredExpenses.filter(
                (exp) => exp.category?.toLowerCase() === category.toLowerCase()
              );
              const categoryTotal = categoryExpenses.reduce(
                (sum, exp) => sum + exp.amount,
                0
              );
              const categoryCount = categoryExpenses.length;

              return (
                <div
                  key={category}
                  className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white">
                      {category}
                    </h4>
                    <div className="text-right">
                      <p className="text-sm text-zinc-400">
                        {categoryCount}{" "}
                        {categoryCount === 1 ? "expense" : "expenses"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-white">
                      ₹{categoryTotal.toLocaleString("en-IN")}
                    </p>
                    {categoryExpenses.length > 0 ? (
                      <div className="pt-3 border-t border-zinc-800">
                        <p className="text-xs text-zinc-500 mb-2">
                          Recent expenses:
                        </p>
                        <div className="space-y-1">
                          {categoryExpenses.slice(0, 3).map((exp, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between text-xs"
                            >
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
                      <p className="text-sm text-zinc-500">No expenses yet</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

// Icon Components
function TrendingUpIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  );
}

function LineChartIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}

function BarChartIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}

function CompareIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
      />
    </svg>
  );
}

function TargetIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

function CalendarIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

function GrowthIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  );
}

function GoalIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
      />
    </svg>
  );
}

function PiggyBankIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}

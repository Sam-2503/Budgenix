import React, { useState, useEffect } from "react";
import { Sidebar } from "../components/sidebar";
import { useExpense } from "../context/ExpenseContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export function Transactions() {
  const { expenses, deleteExpense, isLoadingExpenses } = useExpense();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState("30days");
  const [sortBy, setSortBy] = useState("date");

  const [hoveredId, setHoveredId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // RESPONSIVE SIDEBAR

  const handleDelete = async (expenseId, expenseName) => {
    if (deletingId) return;
    setDeletingId(expenseId);

    const result = await deleteExpense(expenseId);
    if (result.success) {
      toast.success(`Deleted ${expenseName}`, { position: "top-center" });
    } else {
      toast.error(result.error || "Failed to delete", {
        position: "top-center",
      });
    }
    setDeletingId(null);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Food: "🍽️",
      Utilities: "💡",
      Entertainment: "🎬",
      Transportation: "🚌",
      Healthcare: "🏥",
      Shopping: "🛍️",
      Housing: "🏠",
      Work: "💼",
      Education: "📚",
      Other: "📌",
    };
    return icons[category] || "📌";
  };

  const getCategoryColors = (category) => {
    const colors = {
      Food: { bg: "bg-teal-900/20", icon: "text-teal-400" },
      Utilities: { bg: "bg-blue-900/20", icon: "text-blue-400" },
      Entertainment: { bg: "bg-purple-900/20", icon: "text-purple-400" },
      Transportation: { bg: "bg-cyan-900/20", icon: "text-cyan-400" },
      Healthcare: { bg: "bg-red-900/20", icon: "text-red-400" },
      Shopping: { bg: "bg-pink-900/20", icon: "text-pink-400" },
      Housing: { bg: "bg-orange-900/20", icon: "text-orange-400" },
      Work: { bg: "bg-green-900/20", icon: "text-green-400" },
      Education: { bg: "bg-indigo-900/20", icon: "text-indigo-400" },
      Other: { bg: "bg-zinc-800/20", icon: "text-zinc-400" },
    };
    return colors[category] || colors.Other;
  };

  // Transform expenses to UI model
  const allTransactions = expenses.map((expense) => {
    const colors = getCategoryColors(expense.category);
    const date = new Date(expense.date);

    return {
      id: expense._id,
      name: expense.title || expense.description || expense.category,
      date: expense.date,
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      amount: expense.type === "expense" ? -expense.amount : expense.amount,
      type: expense.type,
      category: expense.category?.toLowerCase() || "other",
      icon: getCategoryIcon(expense.category),
      bgColor: colors.bg,
      iconColor: colors.icon,
      description: expense.description || expense.title,
      location: "N/A",
      paymentMethod: "N/A",
    };
  });

  const userCategories = user?.categories || [];
  const categories = [
    { value: "all", label: "All Categories" },
    ...userCategories.map((c) => ({
      value: c.toLowerCase(),
      label: c,
    })),
  ];

  const timeRanges = [
    { value: "7days", label: "Last 7 days" },
    { value: "30days", label: "Last 30 days" },
    { value: "3months", label: "Last 3 months" },
    { value: "year", label: "This year" },
  ];

  // Filtering
  const filteredTransactions = allTransactions.filter((t) => {
    const searchMatch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const categoryMatch =
      selectedCategory === "all" || t.category === selectedCategory;

    return searchMatch && categoryMatch;
  });

  // Sorting
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.date) - new Date(a.date);
      case "amount":
        return Math.abs(b.amount) - Math.abs(a.amount);
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const formatAmount = (amount) => {
    const formatted = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Math.abs(amount));
    return amount >= 0 ? `+${formatted}` : `-${formatted}`;
  };

  const getAmountColor = (amount) =>
    amount >= 0 ? "text-green-400" : "text-red-400";

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const totalIncome = user?.income || 0;

  const totalExpenses = filteredTransactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="min-h-screen w-full bg-black flex">
      {/* RESPONSIVE SIDEBAR */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* MAIN */}
      <main className="flex-1 p-4 md:p-8">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-start gap-4 md:items-center md:gap-4 md:justify-start">
            {/* HAMBURGER */}
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

            <div className="pt-1">
              <h1 className="text-2xl md:text-3xl font-semibold text-white">
                All Transactions
              </h1>
              <p className="text-zinc-400 mt-1">
                Manage and track all your financial activity
              </p>
            </div>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
            <h3 className="text-sm text-gray-400 mb-2">Total Income</h3>
            <p className="text-2xl font-semibold text-green-400">
              {formatAmount(totalIncome)}
            </p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
            <h3 className="text-sm text-gray-400 mb-2">Total Expenses</h3>
            <p className="text-2xl font-semibold text-red-400">
              {formatAmount(-totalExpenses)}
            </p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
            <h3 className="text-sm text-gray-400 mb-2">Net Balance</h3>
            <p
              className={`text-2xl font-semibold ${getAmountColor(
                totalIncome - totalExpenses
              )}`}
            >
              {formatAmount(totalIncome - totalExpenses)}
            </p>
          </div>
        </div>

        {/* FILTER PANEL */}
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* SEARCH */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Search</label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by name or description..."
                  className="w-full pl-10 pr-4 py-2 bg-black border border-gray-700 rounded-lg text-white text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* CATEGORY */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white text-sm"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* TIME RANGE */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">
                Time Range
              </label>
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white text-sm"
              >
                {timeRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* SORT */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white text-sm"
              >
                <option value="date">Date (Newest)</option>
                <option value="amount">Amount (Highest)</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* TRANSACTION LIST */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-800">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-white font-semibold text-lg">
              Transactions ({sortedTransactions.length})
            </h2>
          </div>

          {isLoadingExpenses ? (
            <div className="p-12 text-center">
              <div className="w-14 h-14 border-4 border-zinc-700 border-t-white rounded-full animate-spin mx-auto"></div>
              <p className="text-zinc-400 mt-4">Loading transactions...</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {sortedTransactions.length > 0 ? (
                sortedTransactions.map((t) => (
                  <div
                    key={t.id}
                    className="p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between hover:bg-zinc-800/40 transition"
                    onMouseEnter={() => setHoveredId(t.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* LEFT: ICON + DETAILS */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-lg ${t.bgColor} flex items-center justify-center text-xl ${t.iconColor}`}
                      >
                        {t.icon}
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-white font-medium truncate">
                          {t.name}
                        </h3>
                        <p className="text-gray-400 text-sm truncate">
                          {t.description}
                        </p>
                        <div className="flex text-xs text-gray-500 gap-3 mt-1 flex-wrap">
                          <span>
                            {formatDate(t.date)} • {t.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT: AMOUNT + DELETE */}
                    <div className="flex items-center justify-between md:justify-end gap-4">
                      <div
                        className={`font-semibold text-lg ${getAmountColor(
                          t.amount
                        )}`}
                      >
                        {formatAmount(t.amount)}
                      </div>

                      {/* Delete button always shown on mobile */}
                      {(hoveredId === t.id || window.innerWidth < 768) && (
                        <button
                          onClick={() => handleDelete(t.id, t.name)}
                          disabled={deletingId === t.id}
                          className="p-2 rounded-md bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 disabled:opacity-50 transition"
                        >
                          {deletingId === t.id ? (
                            <svg
                              className="w-5 h-5 animate-spin text-red-400"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                className="opacity-25"
                              />
                              <path
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.3 0 0 5.3 0 12h4z"
                                className="opacity-75"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5 text-red-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7L18 19a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m5 4v6m4-6v6M4 7h16M9 4h6a1 1 0 011 1v2H8V5a1 1 0 011-1z"
                              />
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-zinc-400">
                  No transactions found.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function SearchIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      stroke="currentColor"
      fill="none"
    >
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

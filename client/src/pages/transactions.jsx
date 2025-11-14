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

  const handleDelete = async (expenseId, expenseName) => {
    if (deletingId) return;

    setDeletingId(expenseId);
    const result = await deleteExpense(expenseId);

    if (result.success) {
      toast.success(`Deleted ${expenseName}`, {
        duration: 2000,
        position: "top-center",
      });
    } else {
      toast.error(result.error || "Failed to delete expense", {
        duration: 3000,
        position: "top-center",
      });
    }
    setDeletingId(null);
  };

  // Category icon mapping
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

  // Category color mapping
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

  // Transform expenses to transaction format
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
      description: expense.description || expense.title || expense.category,
      location: "N/A",
      paymentMethod: "N/A",
    };
  });

  // Extended dummy transactions data for fallback
  const dummyTransactions = [
    {
      id: 1,
      name: "The Corner Cafe",
      date: "2023-11-14",
      time: "08:30 AM",
      amount: 540.0,
      type: "income",
      category: "food",
      icon: "🍽️",
      bgColor: "bg-teal-900/20",
      iconColor: "text-teal-400",
      description: "Coffee and breakfast",
      location: "Downtown",
      paymentMethod: "Credit Card",
    },
    {
      id: 2,
      name: "Urban Outfitters",
      date: "2023-11-13",
      time: "02:15 PM",
      amount: -2850.0,
      type: "expense",
      category: "shopping",
      icon: "🛍️",
      bgColor: "bg-purple-900/20",
      iconColor: "text-purple-400",
      description: "Clothing and accessories",
      location: "Mall Plaza",
      paymentMethod: "Debit Card",
    },
    {
      id: 3,
      name: "Metro Transit",
      date: "2023-11-13",
      time: "07:45 AM",
      amount: -120.0,
      type: "expense",
      category: "transport",
      icon: "🚌",
      bgColor: "bg-blue-900/20",
      iconColor: "text-blue-400",
      description: "Monthly bus pass",
      location: "Transit Center",
      paymentMethod: "Transit Card",
    },
    {
      id: 4,
      name: "Freelance Payment",
      date: "2023-11-12",
      time: "11:20 AM",
      amount: 10000.0,
      type: "income",
      category: "work",
      icon: "💼",
      bgColor: "bg-green-900/20",
      iconColor: "text-green-400",
      description: "Web development project",
      location: "Online",
      paymentMethod: "Bank Transfer",
    },
    {
      id: 5,
      name: "Rent Payment",
      date: "2023-11-01",
      time: "09:00 AM",
      amount: -8000.0,
      type: "expense",
      category: "housing",
      icon: "🏠",
      bgColor: "bg-orange-900/20",
      iconColor: "text-orange-400",
      description: "Monthly rent",
      location: "Apartment Complex",
      paymentMethod: "Bank Transfer",
    },
    {
      id: 6,
      name: "Netflix Subscription",
      date: "2023-11-10",
      time: "12:00 PM",
      amount: -599.0,
      type: "expense",
      category: "entertainment",
      icon: "🎬",
      bgColor: "bg-red-900/20",
      iconColor: "text-red-400",
      description: "Monthly streaming",
      location: "Online",
      paymentMethod: "Credit Card",
    },
    {
      id: 7,
      name: "Grocery Store",
      date: "2023-11-09",
      time: "06:30 PM",
      amount: -1250.0,
      type: "expense",
      category: "food",
      icon: "🛒",
      bgColor: "bg-teal-900/20",
      iconColor: "text-teal-400",
      description: "Weekly groceries",
      location: "Supermarket",
      paymentMethod: "Debit Card",
    },
    {
      id: 8,
      name: "Salary Deposit",
      date: "2023-11-01",
      time: "12:01 AM",
      amount: 45000.0,
      type: "income",
      category: "work",
      icon: "💰",
      bgColor: "bg-green-900/20",
      iconColor: "text-green-400",
      description: "Monthly salary",
      location: "Bank Deposit",
      paymentMethod: "Direct Deposit",
    },
  ];

  // Get unique categories from user data
  const userCategories = user?.categories || [];
  const categories = [
    { value: "all", label: "All Categories" },
    ...userCategories.map((cat) => ({
      value: cat.toLowerCase(),
      label: cat,
    })),
  ];

  const timeRanges = [
    { value: "7days", label: "Last 7 days" },
    { value: "30days", label: "Last 30 days" },
    { value: "3months", label: "Last 3 months" },
    { value: "year", label: "This year" },
  ];

  // Filter transactions based on search and filters
  const filteredTransactions = allTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || transaction.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort transactions
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
      minimumFractionDigits: 2,
    }).format(Math.abs(amount));

    return amount >= 0 ? `+${formatted}` : `-${formatted}`;
  };

  const getAmountColor = (amount) => {
    return amount >= 0 ? "text-green-400" : "text-red-400";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate totals - use user's income from context
  const totalIncome = user?.income || 0;

  const totalExpenses = filteredTransactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="min-h-screen w-full bg-black flex">
      <Sidebar />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">
            All Transactions
          </h1>
          <p className="text-zinc-400">
            Manage and track all your financial transactions
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h3 className="text-sm font-medium text-gray-400 mb-2">
              Total Income
            </h3>
            <p className="text-2xl font-semibold text-green-400">
              {formatAmount(totalIncome)}
            </p>
          </div>
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h3 className="text-sm font-medium text-gray-400 mb-2">
              Total Expenses
            </h3>
            <p className="text-2xl font-semibold text-red-400">
              {formatAmount(-totalExpenses)}
            </p>
          </div>
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h3 className="text-sm font-medium text-gray-400 mb-2">
              Net Balance
            </h3>
            <p
              className={`text-2xl font-semibold ${getAmountColor(
                totalIncome - totalExpenses
              )}`}
            >
              {formatAmount(totalIncome - totalExpenses)}
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search Transactions
              </label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or description..."
                  className="w-full pl-10 pr-4 py-2 bg-black border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                className="w-full px-3 py-2 bg-black border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-gray-500"
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

            {/* Time Range */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Time Range
              </label>
              <select
                className="w-full px-3 py-2 bg-black border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-gray-500"
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

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sort By
              </label>
              <select
                className="w-full px-3 py-2 bg-black border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-gray-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Date (Newest)</option>
                <option value="amount">Amount (Highest)</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-800">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-lg font-semibold text-white">
              Transactions ({sortedTransactions.length})
            </h2>
          </div>

          {isLoadingExpenses ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 border-4 border-zinc-800 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-zinc-400">Loading transactions...</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {sortedTransactions.length > 0 ? (
                sortedTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-6 hover:bg-zinc-800/50 transition-colors group relative"
                    onMouseEnter={() => setHoveredId(transaction.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Icon */}
                        <div
                          className={`w-12 h-12 rounded-lg ${transaction.bgColor} flex items-center justify-center`}
                        >
                          <span className={`text-xl ${transaction.iconColor}`}>
                            {transaction.icon}
                          </span>
                        </div>

                        {/* Transaction Details */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-medium text-gray-200 text-base">
                              {transaction.name}
                            </h3>
                            <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full capitalize">
                              {transaction.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mb-1">
                            {transaction.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>
                              {formatDate(transaction.date)} at{" "}
                              {transaction.time}
                            </span>
                            <span>{transaction.location}</span>
                            <span>{transaction.paymentMethod}</span>
                          </div>
                        </div>
                      </div>

                      {/* Amount and Delete Button */}
                      <div className="flex items-center gap-4">
                        <div
                          className={`font-semibold text-lg ${getAmountColor(
                            transaction.amount
                          )}`}
                        >
                          {formatAmount(transaction.amount)}
                        </div>

                        {/* Delete Button (shown on hover) */}
                        {hoveredId === transaction.id && (
                          <button
                            onClick={() =>
                              handleDelete(transaction.id, transaction.name)
                            }
                            disabled={deletingId === transaction.id}
                            className="p-2 rounded-md bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete expense"
                          >
                            {deletingId === transaction.id ? (
                              <svg
                                className="w-5 h-5 text-red-400 animate-spin"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-gray-400">
                  <p className="text-lg mb-2">No transactions found</p>
                  <p className="text-sm">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Search Icon Component
function SearchIcon({ className }) {
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
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

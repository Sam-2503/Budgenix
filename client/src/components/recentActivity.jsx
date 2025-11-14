import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useExpense } from "../context/ExpenseContext";
import toast from "react-hot-toast";

const RecentActivity = ({ expenses = [] }) => {
  const { deleteExpense } = useExpense();
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

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Sort expenses by date (most recent first) and take top 5
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Transform expenses to transaction format
  const transactions = recentExpenses.map((expense) => {
    const colors = getCategoryColors(expense.category);
    return {
      id: expense._id,
      name: expense.description || expense.category,
      date: formatDate(expense.date),
      amount: expense.type === "expense" ? -expense.amount : expense.amount,
      type: expense.type,
      category: expense.category,
      icon: getCategoryIcon(expense.category),
      bgColor: colors.bg,
      iconColor: colors.icon,
    };
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

  return (
    <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      {/* Header */}
      <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>

      {/* Transaction List */}
      <div className="space-y-4">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between group relative hover:bg-zinc-800/50 p-2 -m-2 rounded-lg transition-all cursor-pointer"
              onMouseEnter={() => setHoveredId(transaction.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Left side - Icon and Details */}
              <div className="flex items-center space-x-3">
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-lg ${transaction.bgColor} flex items-center justify-center`}
                >
                  <span className={`text-lg ${transaction.iconColor}`}>
                    {transaction.icon}
                  </span>
                </div>

                {/* Transaction Details */}
                <div>
                  <p className="font-medium text-gray-200 text-sm">
                    {transaction.name}
                  </p>
                  <p className="text-xs text-gray-400">{transaction.date}</p>
                </div>
              </div>

              {/* Right side - Amount and Delete Button */}
              <div className="flex items-center gap-3">
                <div
                  className={`font-semibold text-sm ${getAmountColor(
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
                    className="p-1.5 rounded-md bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete expense"
                  >
                    {deletingId === transaction.id ? (
                      <svg
                        className="w-4 h-4 text-red-400 animate-spin"
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
                        className="w-4 h-4 text-red-400"
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
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-zinc-400 mb-1">No recent activity</p>
            <p className="text-xs text-zinc-500">
              Your recent transactions will appear here
            </p>
          </div>
        )}
      </div>

      {/* View All Link */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <Link
          to="/transactions"
          className="text-teal-400 text-sm font-medium hover:text-teal-300 transition-colors inline-block"
        >
          View all transactions
        </Link>
      </div>
    </div>
  );
};

export default RecentActivity;

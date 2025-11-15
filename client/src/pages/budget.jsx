import React, { useState } from "react";
import { Sidebar } from "../components/sidebar";

export function Budget() {
  const [editingBudget, setEditingBudget] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // MOBILE SIDEBAR
  const [budgetData, setBudgetData] = useState({
    totalBudget: 40000,
    categories: {
      food: { allocated: 8000, spent: 3290 },
      shopping: { allocated: 5000, spent: 2850 },
      transport: { allocated: 3000, spent: 1120 },
      housing: { allocated: 15000, spent: 8000 },
      entertainment: { allocated: 4000, spent: 599 },
      utilities: { allocated: 3000, spent: 1250 },
      healthcare: { allocated: 2000, spent: 0 },
    },
  });

  const [tempBudget, setTempBudget] = useState(budgetData);

  const totalAllocated = Object.values(budgetData.categories).reduce(
    (s, c) => s + c.allocated,
    0
  );

  const totalSpent = Object.values(budgetData.categories).reduce(
    (s, c) => s + c.spent,
    0
  );

  const remainingBudget = budgetData.totalBudget - totalSpent;
  const unallocatedBudget = budgetData.totalBudget - totalAllocated;

  const categoryIcons = {
    food: { icon: "🍽️", name: "Food & Dining" },
    shopping: { icon: "🛍️", name: "Shopping" },
    transport: { icon: "🚌", name: "Transportation" },
    housing: { icon: "🏠", name: "Housing" },
    entertainment: { icon: "🎬", name: "Entertainment" },
    utilities: { icon: "⚡", name: "Utilities" },
    healthcare: { icon: "🏥", name: "Healthcare" },
  };

  const formatAmount = (amt) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt);

  const getProgressPercentage = (spent, allocated) =>
    allocated > 0 ? Math.min((spent / allocated) * 100, 100) : 0;

  const getProgressColor = (p) =>
    p >= 90 ? "bg-red-500" : p >= 75 ? "bg-yellow-500" : "bg-green-500";

  const handleSaveBudget = () => {
    setBudgetData(tempBudget);
    setEditingBudget(false);
  };

  const handleCancelEdit = () => {
    setTempBudget(budgetData);
    setEditingBudget(false);
  };

  const updateCategoryBudget = (category, val) => {
    setTempBudget((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: {
          ...prev.categories[category],
          allocated: Math.max(0, parseInt(val) || 0),
        },
      },
    }));
  };

  const updateTotalBudget = (val) => {
    setTempBudget((prev) => ({
      ...prev,
      totalBudget: Math.max(0, parseInt(val) || 0),
    }));
  };

  return (
    <div className="min-h-screen w-full bg-black flex">
      {/* RESPONSIVE SIDEBAR */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* MAIN */}
      <main className="flex-1 p-4 md:p-8">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-start gap-4 md:items-center md:justify-start">
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
                Budget Management
              </h1>
              <p className="text-zinc-400">
                Track your monthly budget and spending across categories
              </p>
            </div>
          </div>

          {/* MOBILE BUTTONS */}
          <div className="md:hidden mt-4 flex gap-3">
            {!editingBudget ? (
              <button
                onClick={() => setEditingBudget(true)}
                className="flex-1 px-4 py-3 bg-white text-black font-medium rounded-lg"
              >
                Edit Budget
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 px-4 py-3 bg-zinc-700 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBudget}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg"
                >
                  Save
                </button>
              </>
            )}
          </div>

          {/* DESKTOP BUTTONS */}
          {!editingBudget ? (
            <button
              onClick={() => setEditingBudget(true)}
              className="hidden md:flex ml-auto px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-zinc-100 mt-4"
            >
              Edit Budget
            </button>
          ) : (
            <div className="hidden md:flex gap-3 mt-4 ml-auto">
              <button
                onClick={handleCancelEdit}
                className="px-6 py-3 bg-zinc-700 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBudget}
                className="px-6 py-3 bg-green-600 text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
            <h3 className="text-sm text-zinc-400 mb-2">Monthly Budget</h3>
            {editingBudget ? (
              <input
                type="number"
                value={tempBudget.totalBudget}
                onChange={(e) => updateTotalBudget(e.target.value)}
                className="w-full text-2xl font-semibold bg-transparent text-white border-b border-zinc-600 focus:border-white"
              />
            ) : (
              <p className="text-2xl font-semibold text-white">
                {formatAmount(budgetData.totalBudget)}
              </p>
            )}
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
            <h3 className="text-sm text-zinc-400 mb-2">Total Spent</h3>
            <p className="text-2xl font-semibold text-red-400">
              {formatAmount(totalSpent)}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              {((totalSpent / budgetData.totalBudget) * 100).toFixed(1)}% of
              budget
            </p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
            <h3 className="text-sm text-zinc-400 mb-2">Remaining</h3>
            <p
              className={`text-2xl font-semibold ${
                remainingBudget >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {formatAmount(remainingBudget)}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              {remainingBudget >= 0 ? "Under budget" : "Over budget"}
            </p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
            <h3 className="text-sm text-zinc-400 mb-2">Unallocated</h3>
            <p
              className={`text-2xl font-semibold ${
                unallocatedBudget >= 0 ? "text-yellow-400" : "text-red-400"
              }`}
            >
              {formatAmount(unallocatedBudget)}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              {unallocatedBudget >= 0
                ? "Available to allocate"
                : "Over-allocated"}
            </p>
          </div>
        </div>

        {/* OVERALL PROGRESS */}
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">
            Overall Budget Progress
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Total Usage</span>
              <span className="text-white">
                {formatAmount(totalSpent)} /{" "}
                {formatAmount(budgetData.totalBudget)}
              </span>
            </div>

            <div className="w-full bg-zinc-800 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${getProgressColor(
                  (totalSpent / budgetData.totalBudget) * 100
                )}`}
                style={{
                  width: `${Math.min(
                    (totalSpent / budgetData.totalBudget) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* CATEGORY DETAILS */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-800">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-xl font-semibold text-white">
              Category Budgets
            </h2>
          </div>

          <div className="divide-y divide-zinc-800">
            {Object.entries(
              editingBudget ? tempBudget.categories : budgetData.categories
            ).map(([key, cat]) => {
              const info = categoryIcons[key];
              const perc = getProgressPercentage(cat.spent, cat.allocated);
              const remaining = cat.allocated - cat.spent;

              return (
                <div key={key} className="p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-xl">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{info.name}</h3>
                        <p className="text-sm text-zinc-400">
                          {formatAmount(cat.spent)} spent of{" "}
                          {formatAmount(cat.allocated)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      {editingBudget ? (
                        <div className="flex gap-2 items-center">
                          <span className="text-zinc-400 text-sm">₹</span>
                          <input
                            type="number"
                            value={cat.allocated}
                            onChange={(e) =>
                              updateCategoryBudget(key, e.target.value)
                            }
                            className="w-24 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                          />
                        </div>
                      ) : (
                        <>
                          <p
                            className={`text-lg font-semibold ${
                              remaining >= 0 ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {formatAmount(remaining)}
                          </p>
                          <p className="text-sm text-zinc-400">
                            {remaining >= 0 ? "remaining" : "over budget"}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {!editingBudget && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Progress</span>
                        <span className="text-white">{perc.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-2 rounded-full">
                        <div
                          className={`h-2 rounded-full ${getProgressColor(
                            perc
                          )}`}
                          style={{ width: `${perc}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* TIPS */}
        {unallocatedBudget !== 0 && (
          <div className="mt-8 bg-zinc-900 p-6 rounded-lg border border-zinc-800">
            {unallocatedBudget > 0 ? (
              <div className="p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg flex gap-3">
                <span className="text-yellow-400 text-xl">💡</span>
                <div>
                  <p className="text-yellow-300 font-medium">
                    Unallocated Budget
                  </p>
                  <p className="text-yellow-400 text-sm">
                    You still have {formatAmount(unallocatedBudget)} unassigned.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg flex gap-3">
                <span className="text-red-400 text-xl">⚠️</span>
                <div>
                  <p className="text-red-300 font-medium">
                    Over-allocated Budget
                  </p>
                  <p className="text-red-400 text-sm">
                    You have exceeded your budget by{" "}
                    {formatAmount(Math.abs(unallocatedBudget))}.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

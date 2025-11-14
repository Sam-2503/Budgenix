import { useEffect, useState } from "react";
import RecentActivity from "../components/recentActivity";
import { Sidebar } from "../components/sidebar";
import { StatCard } from "../components/card";
import { Chart } from "../components/categoryCard";
import { useAuth } from "../context/AuthContext";

export const Dashboard = () => {
  const { user, isFetchingUserData } = useAuth();
  const [totalSpent, setTotalSpent] = useState(0);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    if (user) {
      console.log("User data:", user);

      // TODO: Fetch real expenses from API
      // For now using mock data
      fetchExpenses();
    }
  }, [user]);

  const fetchExpenses = async () => {
    // TODO: Replace with actual API call
    // const response = await axios.get('/api/expenses', {
    //   headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    // });
    // setExpenses(response.data.expenses);

    // Mock expenses for now
    const mockExpenses = [
      { id: 1, category: "Food", amount: 150 },
      { id: 2, category: "Transport", amount: 50 },
      { id: 3, category: "Utilities", amount: 100 },
    ];
    setExpenses(mockExpenses);

    // Calculate total spent
    const total = mockExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    setTotalSpent(total);
  };

  // Calculate metrics
  const income = user?.income || 0;
  const budgetRemaining = income - totalSpent;
  const spendPercentage =
    income > 0 ? ((totalSpent / income) * 100).toFixed(1) : 0;
  const remainingPercentage =
    income > 0 ? ((budgetRemaining / income) * 100).toFixed(0) : 0;

  // Show loading state
  if (isFetchingUserData || !user) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-zinc-800 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-white">
            Welcome back, {user.username}
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Here's your financial overview for this month
          </p>
        </header>
        <section className="space-y-6">
          {/* Budget Overview Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard
              title="Monthly Income"
              value={income}
              trend="neutral"
              trendText={`${user.categories?.length || 0} budget categories`}
            />
            <StatCard
              title="Total Spent this Month"
              value={totalSpent}
              trend={totalSpent > 0 ? "down" : "neutral"}
              trendText={
                totalSpent > 0
                  ? `${spendPercentage}% of income`
                  : "No expenses yet"
              }
            />
            <StatCard
              title="Budget Remaining"
              value={budgetRemaining}
              trend={budgetRemaining > 0 ? "up" : "down"}
              trendText={`${remainingPercentage}% remaining`}
            />
          </div>
          {/* Categories Overview */}
          {user.categories && user.categories.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Your Budget Categories
              </h2>
              <div className="flex flex-wrap gap-2">
                {user.categories.map((category, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg text-sm font-medium hover:bg-zinc-700 transition"
                  >
                    {category}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Chart categories={user.categories} />
            <RecentActivity />
          </div>
        </section>
      </main>
    </div>
  );
};

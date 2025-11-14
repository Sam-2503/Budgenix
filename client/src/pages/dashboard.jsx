import Sidebar from "../components/sidebar";
import StatCard from "../components/card";

export default function Dashboard() {
  return (
    <div className="min-h-screen w-full bg-base-200 flex overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-semibold">Welcome back, Alex!</h1>
          <p className="mt-2 text-base-content/70">
            Here’s your financial overview for this month.
          </p>
        </header>
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <StatCard
            title="Total Spend this Month"
            value={15820}
            trend="down"
            trendText="-2.5% vs last month"
          />
          <StatCard
            title="Monthly Budget Remaining"
            value={24180}
            trend="up"
            trendText="58% left to spend"
          />
        </section>
      </main>
    </div>
  );
}

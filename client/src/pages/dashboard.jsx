import { useState } from "react";
import RecentActivity from "../components/recentActivity";
import { Sidebar } from "../components/sidebar";
import { StatCard } from "../components/card";
import { Chart } from "../components/categoryCard";
export function Dashboard() {
  return (
    <div className="min-h-screen w-full bg-black flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-white">
            Welcome back, Alex
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Here's your financial overview for this month
          </p>
        </header>
        <section className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Chart />
            <RecentActivity />
          </div>
        </section>
      </main>
    </div>
  );
}

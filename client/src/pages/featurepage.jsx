import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "../components/navbar";

export default function FeaturesPage() {
  const navigate = useNavigate();
  const { isUserLoggedIn, isLoading } = useAuth();

  const handleStartJourney = () => {
    // If already logged in, redirect to dashboard
    if (isUserLoggedIn) {
      navigate("/dashboard");
      return;
    }

    // If not logged in, redirect to signup page
    if (!isLoading) {
      navigate("/signup");
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-zinc-800 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-black text-white">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center">
        <div className="flex w-full max-w-6xl flex-col items-center gap-20 px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          {/* Hero Section */}
          <section className="w-full text-center">
            <div className="flex flex-col items-center gap-6 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-300 text-sm font-medium">
                  Powered by Agora AI
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
                Your Personal Financial{" "}
                <span className="text-white">Mentor</span>
              </h1>
              <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl">
                A cutting-edge conversational budget manager that empowers you
                to achieve financial literacy through natural, human-like
                conversations.
              </p>
            </div>
          </section>

          {/* Core Innovation Section */}
          <section className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col gap-6">
                <div className="inline-flex w-fit px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800">
                  <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">
                    Core Innovation
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-semibold leading-tight">
                  Agora AI Integration
                </h2>
                <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
                  Our integration with Agora AI delivers ultra-low latency and
                  exceptional accuracy, enabling truly natural conversations.
                  Complex financial concepts become easily understandable
                  through human-like interactions that feel less like using an
                  app and more like chatting with a trusted financial advisor.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex flex-col gap-2">
                    <div className="text-3xl font-bold text-green-400">
                      &lt;100ms
                    </div>
                    <div className="text-sm text-zinc-400">Response Time</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-3xl font-bold text-green-400">98%</div>
                    <div className="text-sm text-zinc-400">Accuracy Rate</div>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-700 shrink-0 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">You</span>
                    </div>
                    <div className="flex-1 bg-zinc-800 rounded-lg p-3">
                      <p className="text-sm text-zinc-300">
                        How much did I spend on food this week?
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-white shrink-0 flex items-center justify-center">
                      <span className="text-black text-xs font-bold">AI</span>
                    </div>
                    <div className="flex-1 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <p className="text-sm text-zinc-300">
                        You spent ₹142 on food this week. That's 18% over your
                        weekly budget. Would you like some tips to reduce dining
                        out expenses?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Key Features Grid */}
          <section className="w-full">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
                Powerful Features
              </h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                Everything you need to master your finances and build a secure
                future
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: "💬",
                  title: "Real-Time Conversations",
                  description:
                    "Chat naturally with your financial mentor anytime. Ask questions, get instant answers, and receive guidance in plain language.",
                  highlight: "24/7 Availability",
                },
                {
                  icon: "📊",
                  title: "Smart Transaction Tracking",
                  description:
                    "Automatically categorize and track every transaction. Get instant updates on monthly expenses without manual entry.",
                  highlight: "Auto-Categorization",
                },
                {
                  icon: "🔔",
                  title: "Proactive Notifications",
                  description:
                    "Receive timely alerts when you're approaching budget limits or exhibiting unusual spending patterns.",
                  highlight: "Smart Alerts",
                },
                {
                  icon: "🎯",
                  title: "Expenditure Analysis",
                  description:
                    "Deep insights into your spending patterns. Identify areas of overspending and get data-driven recommendations.",
                  highlight: "Pattern Recognition",
                },
                {
                  icon: "💡",
                  title: "Personalized Advice",
                  description:
                    "Get actionable strategies tailored to your unique financial situation. Learn better money management through conversation.",
                  highlight: "Custom Strategies",
                },
                {
                  icon: "💰",
                  title: "Savings Builder",
                  description:
                    "Automatically identify saving opportunities and build your future fund. Start growing your wealth from day one.",
                  highlight: "Auto-Savings",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="relative group bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-all duration-300"
                >
                  <div className="absolute top-4 right-4 px-2 py-1 rounded bg-zinc-800 border border-zinc-700">
                    <span className="text-zinc-300 text-xs font-medium">
                      {feature.highlight}
                    </span>
                  </div>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Target Audience Section */}
          <section className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-8 sm:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
                Built for Everyone
              </h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                Especially designed for students and young professionals
                starting their financial journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Students",
                  description:
                    "Master budgeting while juggling tuition, living expenses, and social life. Build financial literacy early.",
                  stats: ["Track allowances", "Manage loans", "Save smartly"],
                },
                {
                  title: "First-Time Earners",
                  description:
                    "Navigate your first salary with confidence. Learn to balance expenses, savings, and lifestyle.",
                  stats: [
                    "Budget salary",
                    "Build emergency fund",
                    "Start investing",
                  ],
                },
                {
                  title: "Financial Beginners",
                  description:
                    "No prior knowledge needed. Learn money management through simple, engaging conversations.",
                  stats: ["Learn basics", "Track spending", "Form habits"],
                },
              ].map((audience, idx) => (
                <div key={idx} className="flex flex-col gap-4">
                  <h3 className="text-xl font-semibold text-white">
                    {audience.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {audience.description}
                  </p>
                  <div className="flex flex-col gap-2 pt-2">
                    {audience.stats.map((stat, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-500"></div>
                        <span className="text-sm text-zinc-300">{stat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Problem Solution Section */}
          <section className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-md bg-red-500/20 flex items-center justify-center">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <h3 className="text-xl font-semibold">The Problem</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Lack of money awareness",
                    "Complex budgeting tools",
                    "No real-time guidance",
                    "Intimidating financial jargon",
                    "Poor spending habits",
                  ].map((problem, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">✕</span>
                      <span className="text-zinc-400 text-sm">{problem}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-md bg-green-500/20 flex items-center justify-center">
                    <span className="text-2xl">✓</span>
                  </div>
                  <h3 className="text-xl font-semibold">Our Solution</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Real-time financial awareness",
                    "Simple conversational interface",
                    "Instant AI-powered mentoring",
                    "Plain language explanations",
                    "Habit-building suggestions",
                  ].map((solution, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span className="text-zinc-400 text-sm">{solution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="w-full">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
                How It Works
              </h2>
              <p className="text-zinc-400 text-lg">
                Transform budgeting into an engaging conversation
              </p>
            </div>

            <div className="relative">
              {/* Connection line */}
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-800 -translate-y-1/2"></div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                {[
                  {
                    step: "1",
                    title: "Connect",
                    description: "Link your accounts securely in seconds",
                  },
                  {
                    step: "2",
                    title: "Chat",
                    description: "Start conversing with your AI mentor",
                  },
                  {
                    step: "3",
                    title: "Track",
                    description: "Get real-time insights on spending",
                  },
                  {
                    step: "4",
                    title: "Grow",
                    description: "Build savings and better habits",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center text-center gap-4 relative"
                  >
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-black text-2xl font-bold z-10">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="text-zinc-400 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-10 text-center">
            <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
              Ready to Master Your Finances?
            </h2>
            <p className="text-zinc-400 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands who've transformed their financial future through
              simple conversations
            </p>
            <button
              onClick={handleStartJourney}
              className="flex w-fit mx-auto cursor-pointer items-center justify-center rounded-md h-12 px-8 bg-green-500 text-white text-base font-medium hover:bg-green-600 transition-all"
            >
              <span className="truncate">Start Your Journey Free</span>
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}

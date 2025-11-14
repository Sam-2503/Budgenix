import { useState } from "react";

export default function Welcomepage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 flex justify-center border-b border-zinc-800 bg-black/80 backdrop-blur-sm">
        <div className="flex w-full max-w-6xl items-center justify-between whitespace-nowrap px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
              <span className="text-black font-bold text-sm">F</span>
            </div>
            <h2 className="text-xl font-semibold">Finance</h2>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-8">
              <a className="text-sm font-medium text-zinc-400 hover:text-white transition-colors" href="#">
                Features
              </a>
              <a className="text-sm font-medium text-zinc-400 hover:text-white transition-colors" href="#">
                Pricing
              </a>
              <a className="text-sm font-medium text-zinc-400 hover:text-white transition-colors" href="#">
                Blog
              </a>
            </div>
            <button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-md h-10 px-4 bg-white text-black text-sm font-medium hover:bg-zinc-100 transition-all">
              <span className="truncate">Sign Up</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-zinc-900 border-b border-zinc-800 p-4">
            <div className="flex flex-col gap-4">
              <a className="text-sm font-medium text-zinc-400 hover:text-white transition-colors" href="#">
                Features
              </a>
              <a className="text-sm font-medium text-zinc-400 hover:text-white transition-colors" href="#">
                Pricing
              </a>
              <a className="text-sm font-medium text-zinc-400 hover:text-white transition-colors" href="#">
                Blog
              </a>
              <button className="flex cursor-pointer items-center justify-center rounded-md h-10 px-4 bg-white text-black text-sm font-medium hover:bg-zinc-100 transition-all">
                Sign Up
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center">
        <div className="flex w-full max-w-6xl flex-col items-center gap-16 px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          {/* Hero Section */}
          <section className="w-full">
            <div className="flex flex-col-reverse items-center gap-12 lg:flex-row lg:gap-8">
              <div className="flex w-full max-w-xl flex-col items-center gap-6 text-center lg:w-1/2 lg:items-start lg:text-left">
                <div className="flex flex-col gap-4">
                  <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                    Take control of your finances
                  </h1>
                  <p className="text-zinc-400 text-base sm:text-lg">
                    Your personal finance expert, available 24/7. Chat your way to a better budget.
                  </p>
                </div>
                <button className="flex w-fit cursor-pointer items-center justify-center rounded-md h-12 px-6 bg-white text-black text-base font-medium hover:bg-zinc-100 transition-all">
                  <span className="truncate">Try for free</span>
                </button>
              </div>
              <div className="w-full lg:w-1/2 flex justify-center">
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg max-w-md w-full p-8">
                  <div className="space-y-4">
                    <div className="bg-zinc-800 rounded-lg p-4">
                      <p className="text-sm text-zinc-400">Your spending this month</p>
                      <p className="text-2xl font-semibold mt-2">$2,847</p>
                    </div>
                    <div className="bg-zinc-800 rounded-lg p-4">
                      <p className="text-sm text-zinc-400">Budget remaining</p>
                      <p className="text-2xl font-semibold mt-2">$1,153</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="flex w-full flex-col items-center gap-8 py-12 text-center">
            <h2 className="text-zinc-400 text-sm font-medium uppercase tracking-wider">
              How It Works
            </h2>
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  number: "1",
                  title: "Connect Accounts",
                  description: "Securely link your bank accounts for automated expense tracking.",
                },
                {
                  number: "2",
                  title: "Chat with AI",
                  description: "Ask our AI for spending patterns, budget tips, and financial advice.",
                },
                {
                  number: "3",
                  title: "Get Insights",
                  description: "Receive personalized reports and actionable insights to improve your finances.",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-4 rounded-lg border border-zinc-800 bg-zinc-900 p-6 items-center">
                  <div className="flex size-12 items-center justify-center rounded-md bg-white text-black text-lg font-semibold">
                    {item.number}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-zinc-400 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="flex w-full flex-col items-center gap-8 py-12 text-center">
            <h2 className="text-zinc-400 text-sm font-medium uppercase tracking-wider">
              Loved by Students & Grads
            </h2>
            <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  quote: "Finance helped me finally get a handle on my student loans and monthly spending. The AI chat is like having a financial advisor in my pocket!",
                  name: "Alex Johnson",
                  role: "University Student",
                },
                {
                  quote: "As a recent grad in my first job, this app is a lifesaver. It automatically categorizes my spending so I know exactly where my money is going.",
                  name: "Samantha Lee",
                  role: "Junior Developer",
                },
                {
                  quote: "I used to be so stressed about money. The weekly insights are amazing for building better habits without feeling overwhelmed. Highly recommend!",
                  name: "David Chen",
                  role: "Marketing Intern",
                },
              ].map((testimonial, idx) => (
                <div key={idx} className="flex flex-col gap-4 rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-left">
                  <p className="text-zinc-300 text-sm">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3 pt-2 border-t border-zinc-800">
                    <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{testimonial.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{testimonial.name}</p>
                      <p className="text-xs text-zinc-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="w-full rounded-lg bg-zinc-900 border border-zinc-800 p-10 my-12 text-center flex flex-col items-center gap-6">
            <h2 className="text-3xl font-semibold">Ready to simplify your finances?</h2>
            <p className="max-w-xl text-zinc-400">
              Join thousands of students and young professionals who are taking control of their financial future.
            </p>
            <button className="flex w-fit cursor-pointer items-center justify-center rounded-md h-12 px-6 bg-white text-black text-base font-medium hover:bg-zinc-100 transition-all">
              <span className="truncate">Get Started Now</span>
            </button>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-8 sm:px-6 lg:px-8 md:flex-row">
          <p className="text-sm text-zinc-400">© 2024 Finance. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a className="text-sm text-zinc-400 hover:text-white transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="text-sm text-zinc-400 hover:text-white transition-colors" href="#">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
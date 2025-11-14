import { useState } from "react";
import { Link } from "react-router-dom";
export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 flex justify-center border-b border-zinc-800 bg-black/80 backdrop-blur-sm">
      <div className="flex w-full max-w-6xl items-center justify-between whitespace-nowrap px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
            <span className="text-black font-bold text-sm">F</span>
          </div>
          <Link to="/">
            <h2 className="text-xl font-semibold">FinBuddy</h2>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-8">
            <Link
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              to="/features"
            >
              Features
            </Link>
            <Link
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              to="/contact"
            >
              Contact Us
            </Link>
            <Link
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              to="/login"
            >
              Log In
            </Link>
          </div>
          <Link
            to="/signup"
            className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-md h-10 px-4 bg-white text-black text-sm font-medium hover:bg-zinc-100 transition-all"
          >
            <span className="truncate">Sign Up</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-zinc-900 border-b border-zinc-800 p-4">
          <div className="flex flex-col gap-4">
            <Link
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              to="/features"
            >
              Features
            </Link>
            <Link
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              to="/pricing"
            >
              Pricing
            </Link>
            <Link
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              to="/blog"
            >
              Blog
            </Link>
            <Link
              to="/signup"
              className="flex  cursor-pointer items-center justify-center rounded-md h-10 px-4 bg-white text-black text-sm font-medium hover:bg-zinc-100 transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

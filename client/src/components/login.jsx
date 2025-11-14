import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const { login, isUserLoggedIn, setIsUserLoggedIn, fetchUserData, error } =
    useAuth();

  useEffect(() => {
    if (isUserLoggedIn) {
      window.location.href = "/dashboard";
    } else {
      fetchUserData();
    }
  }, [isUserLoggedIn, setIsUserLoggedIn]);

  function handleSubmit(e) {
    e.preventDefault();
    login({ email, password });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-white mb-1">Login</h1>
            <p className="text-sm text-zinc-400">
              Enter your credentials to continue
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-2.5 bg-black border border-zinc-800 rounded-md text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  type={show ? "text" : "password"}
                  className="w-full pl-10 pr-16 py-2.5 bg-black border border-zinc-800 rounded-md text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-medium text-zinc-400 hover:text-white transition cursor-pointer"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-sm text-zinc-400 hover:text-white transition cursor-pointer"
                onClick={() => onForgot?.(email)}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-white hover:bg-zinc-100 text-black font-medium py-2.5 px-4 rounded-md transition text-sm cursor-pointer"
            >
              Sign in
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
            <p className="text-sm text-zinc-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-white hover:underline cursor-pointer"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MailIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M3.75 5.5h16.5A1.75 1.75 0 0 1 22 7.25v9.5A1.75 1.75 0 0 1 20.25 18.5H3.75A1.75 1.75 0 0 1 2 16.75v-9.5A1.75 1.75 0 0 1 3.75 5.5zm.8 2.25 6.96 4.41a1.75 1.75 0 0 0 1.98 0l6.96-4.41a.25.25 0 0 0-.14-.45H4.69a.25.25 0 0 0-.14.45z" />
    </svg>
  );
}

function LockIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2.5a4.5 4.5 0 0 1 4.5 4.5v2h.75A1.75 1.75 0 0 1 19 10.75v7.5A1.75 1.75 0 0 1 17.25 20H6.75A1.75 1.75 0 0 1 5 18.25v-7.5A1.75 1.75 0 0 1 6.75 9h.75V7A4.5 4.5 0 0 1 12 2.5zm0 1.5A3 3 0 0 0 9 7v2h6V7a3 3 0 0 0-3-3z" />
    </svg>
  );
}

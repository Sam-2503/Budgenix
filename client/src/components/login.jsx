import { useState } from "react";

export default function Login({ onSubmit, onForgot }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit?.({ email, password });
  }

  return (
    <div className="min-h-screen grid place-items-center bg-base-200 p-4">
      <div className="w-full max-w-md">
        <div className="card bg-base-100 shadow-xl border">
          <div className="card-body">
            <h2 className="card-title">Sign in</h2>
            <form className="mt-4" onSubmit={handleSubmit}>
              <label className="input input-bordered flex items-center gap-2">
                <MailIcon className="size-4 opacity-70" />
                <input
                  type="email"
                  className="grow"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </label>

              <label className="input input-bordered mt-4 flex items-center gap-2">
                <LockIcon className="size-4 opacity-70" />
                <input
                  type={show ? "text" : "password"}
                  className="grow"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="btn btn-link btn-xs"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? "Hide" : "Show"}
                </button>
              </label>

              <div className="mt-2 text-right">
                <a
                  type="button"
                  className="link link-primary text-sm"
                  onClick={() => onForgot?.(email)}
                >
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="btn btn-primary mt-4 w-full">
                Sign in
              </button>
            </form>
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

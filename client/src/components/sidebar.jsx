// Sidebar component resembling the provided dashboard mock
// Uses Tailwind CSS v4 + DaisyUI menu styles; no extra deps

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: DashIcon },
  { key: "transactions", label: "Transactions", icon: CardIcon },
  { key: "goals", label: "Goals", icon: GoalIcon },
  { key: "settings", label: "Settings", icon: GearIcon },
];

export default function Sidebar({ active = "dashboard", onNavigate }) {
  return (
    <aside className="h-screen shrink-0 border-r bg-base-100">
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="avatar placeholder">
          <div className="w-8 rounded-full bg-primary text-primary-content grid place-items-center">
            <span className="text-sm font-semibold">B</span>
          </div>
        </div>
        <span className="text-lg font-semibold">BudgetAI</span>
      </div>

      <ul className="menu px-2">
        {navItems.map(({ key, label, icon: Icon }) => (
          <li key={key}>
            <button
              type="button"
              className={`gap-3 ${active === key ? "active" : ""}`}
              onClick={() => onNavigate && onNavigate(key)}
            >
              <Icon className="size-5" />
              {label}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-auto px-2 absolute bottom-3 left-0 right-0">
        <ul className="menu">
          <li>
            <button type="button" className="gap-3 text-error">
              <LogoutIcon className="size-5" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}

function DashIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M3 5.25A2.25 2.25 0 0 1 5.25 3h4.5A2.25 2.25 0 0 1 12 5.25v4.5A2.25 2.25 0 0 1 9.75 12h-4.5A2.25 2.25 0 0 1 3 9.75v-4.5zM13.5 5.25A2.25 2.25 0 0 1 15.75 3h3A2.25 2.25 0 0 1 21 5.25v1.5A2.25 2.25 0 0 1 18.75 9h-3A2.25 2.25 0 0 1 13.5 6.75v-1.5zM3 14.25A2.25 2.25 0 0 1 5.25 12h3A2.25 2.25 0 0 1 10.5 14.25v3A2.25 2.25 0 0 1 8.25 19.5h-3A2.25 2.25 0 0 1 3 17.25v-3zM13.5 13.5A2.25 2.25 0 0 1 15.75 11.25h4.5A2.25 2.25 0 0 1 22.5 13.5v4.5A2.25 2.25 0 0 1 20.25 20.25h-4.5A2.25 2.25 0 0 1 13.5 18.75v-5.25z" />
    </svg>
  );
}

function CardIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M3 6.75A2.75 2.75 0 0 1 5.75 4h12.5A2.75 2.75 0 0 1 21 6.75V9H3V6.75zM3 10.5h18v6.75A2.75 2.75 0 0 1 18.25 20H5.75A2.75 2.75 0 0 1 3 17.25V10.5zm3 4.125a.875.875 0 0 0 0 1.75h4.5a.875.875 0 0 0 0-1.75H6z" />
    </svg>
  );
}

function GoalIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2.25a9.75 9.75 0 1 0 9.75 9.75A9.76 9.76 0 0 0 12 2.25zm0 3a6.75 6.75 0 1 1-6.75 6.75A6.76 6.76 0 0 1 12 5.25zm0 2.5a4.25 4.25 0 1 0 4.25 4.25A4.25 4.25 0 0 0 12 7.75z" />
    </svg>
  );
}

function GearIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M10.325 2.75a1.25 1.25 0 0 1 2.35 0l.32 1.02a7.73 7.73 0 0 1 1.72.71l.98-.57a1.25 1.25 0 0 1 1.7.46l1.25 2.16a1.25 1.25 0 0 1-.45 1.7l-.93.54c.13.56.2 1.14.2 1.72s-.07 1.16-.2 1.72l.93.54a1.25 1.25 0 0 1 .45 1.7l-1.25 2.16a1.25 1.25 0 0 1-1.7.46l-.98-.57a7.73 7.73 0 0 1-1.72.71l-.32 1.02a1.25 1.25 0 0 1-2.35 0l-.32-1.02a7.73 7.73 0 0 1-1.72-.71l-.98.57a1.25 1.25 0 0 1-1.7-.46L3.875 15.7a1.25 1.25 0 0 1 .45-1.7l.93-.54A7.94 7.94 0 0 1 5.05 12c0-.58.07-1.16.2-1.72l-.93-.54a1.25 1.25 0 0 1-.45-1.7l1.25-2.16a1.25 1.25 0 0 1 1.7-.46l.98.57c.56-.3 1.12-.54 1.72-.71l.32-1.02zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    </svg>
  );
}

function LogoutIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M13 4.5a1 1 0 0 0-1-1H6.75A2.75 2.75 0 0 0 4 6.25v11.5A2.75 2.75 0 0 0 6.75 20.5H12a1 1 0 1 0 0-2H6.75c-.414 0-.75-.336-.75-.75V6.25c0-.414.336-.75.75-.75H12a1 1 0 0 0 1-1z" />
      <path d="M15.53 8.47a.75.75 0 0 0-1.06 1.06l1.72 1.72H9a.75.75 0 0 0 0 1.5h7.19l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3.25-3.25a.75.75 0 0 0 0-1.06l-3.25-3.25z" />
    </svg>
  );
}

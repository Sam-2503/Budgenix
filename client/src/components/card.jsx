// Card - a small summary card matching the mock
// Props:
// - title: string
// - value: number | string
// - currency?: string (default '₹') - applied if value is a number
// - trendText?: string (e.g., '+2.5% vs last month' or '58% left to spend')
// - trend?: 'up' | 'down' | 'neutral' (controls color + icon)
// - icon?: ReactNode (optional top-right icon)
// - className?: string

function formatCurrency(v, currency = "₹") {
  if (typeof v !== "number") return v;
  try {
    // Format in Indian numbering if available, else fallback
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    })
      .format(v)
      .replace("₹", currency);
  } catch {
    return `${currency}${v.toLocaleString("en-IN")}`;
  }
}

export default function Card({
  title,
  value,
  currency = "₹",
  trendText,
  trend = "neutral",
  icon,
  className = "",
}) {
  const color =
    trend === "up"
      ? "text-emerald-600"
      : trend === "down"
      ? "text-rose-500"
      : "text-base-content/70";

  return (
    <article className={`rounded-box border bg-base-100 p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-base-content/70">{title}</p>
          <p className="mt-3 text-3xl font-bold">
            {formatCurrency(value, currency)}
          </p>
          {trendText ? (
            <div
              className={`mt-2 flex items-center gap-1 text-xs font-medium ${color}`}
            >
              {trend === "up" && <ArrowUpIcon className="size-4" />}
              {trend === "down" && <ArrowDownIcon className="size-4" />}
              {trend === "neutral" && <DotIcon className="size-4" />}
              <span>{trendText}</span>
            </div>
          ) : null}
        </div>
        {icon ? (
          <div className="rounded-full bg-base-200 p-2 text-base-content/70">
            {icon}
          </div>
        ) : null}
      </div>
    </article>
  );
}

function ArrowUpIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 3.75a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0v-12a.75.75 0 0 1 .75-.75z" />
      <path d="M7.72 8.03a.75.75 0 0 1 1.06 0L12 11.25l3.22-3.22a.75.75 0 0 1 1.06 1.06l-3.75 3.75a1.5 1.5 0 0 1-2.12 0L7.72 9.09a.75.75 0 0 1 0-1.06z" />
    </svg>
  );
}

function ArrowDownIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 20.25a.75.75 0 0 1-.75-.75v-12a.75.75 0 0 1 1.5 0v12a.75.75 0 0 1-.75.75z" />
      <path d="M16.28 15.97a.75.75 0 0 1-1.06 0L12 12.75l-3.22 3.22a.75.75 0 0 1-1.06-1.06l3.75-3.75a1.5 1.5 0 0 1 2.12 0l3.75 3.75a.75.75 0 0 1 0 1.06z" />
    </svg>
  );
}

function DotIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

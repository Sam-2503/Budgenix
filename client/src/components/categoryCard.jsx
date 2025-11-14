import { useState } from "react";

export function Chart({ categories = [], expenses = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Calculate spending by category from actual expenses
  const calculateCategoryData = () => {
    if (!expenses || expenses.length === 0) return [];

    // Group expenses by category and sum amounts
    const categoryTotals = {};
    
    expenses.forEach((expense) => {
      // Only count expense type, not income
      if (expense.type !== 'expense') return;
      
      const category = expense.category;
      const amount = parseFloat(expense.amount) || 0;
      
      if (categoryTotals[category]) {
        categoryTotals[category] += amount;
      } else {
        categoryTotals[category] = amount;
      }
    });

    // Convert to array format and sort by value (highest first)
    const categorySpending = Object.entries(categoryTotals)
      .map(([name, value]) => ({
        name,
        value
      }))
      .sort((a, b) => b.value - a.value);

    return categorySpending.filter((cat) => cat.value > 0);
  };

  const chartData = calculateCategoryData();
  const totalSpent = chartData.reduce((sum, item) => sum + item.value, 0);

  // Modern color palette
  const colors = [
    "#3b82f6", "#06b6d4", "#f59e0b", "#8b5cf6", 
    "#ec4899", "#10b981", "#f43f5e", "#f97316"
  ];

  // Calculate donut segments
  const createDonutSegments = () => {
    const size = 200;
    const center = size / 2;
    const radius = 70;
    const thickness = 30;

    let currentAngle = -90;
    
    return chartData.map((item, index) => {
      const percentage = (item.value / totalSpent) * 100;
      const angle = (percentage / 100) * 360;
      
      const startAngle = currentAngle * (Math.PI / 180);
      const endAngle = (currentAngle + angle) * (Math.PI / 180);
      
      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);
      
      const largeArc = angle > 180 ? 1 : 0;
      
      const path = `
        M ${center} ${center}
        L ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
        Z
      `;
      
      currentAngle += angle;
      
      return {
        path,
        color: colors[index % colors.length],
        percentage,
        ...item
      };
    });
  };

  const segments = createDonutSegments();

  return (
    <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold text-white mb-6">
        Spending Overview
      </h3>

      {chartData.length > 0 ? (
        <div className="space-y-6">
          <div className="flex justify-center relative">
            <svg width="200" height="200" className="transform -rotate-90">
              {segments.map((segment, index) => (
                <path
                  key={index}
                  d={segment.path}
                  fill={segment.color}
                  opacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.3}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    filter: hoveredIndex === index ? 'brightness(1.2)' : 'none',
                    transform: hoveredIndex === index ? 'scale(1.02)' : 'scale(1)',
                    transformOrigin: '100px 100px'
                  }}
                />
              ))}
              <circle cx="100" cy="100" r="55" fill="#18181b" />
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <p className="text-xs text-zinc-400">Total Spent</p>
              <p className="text-2xl font-bold text-white">
                ${totalSpent.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {segments.map((segment, index) => (
              <div
                key={index}
                className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-zinc-800 transition-colors"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: segment.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{segment.name}</p>
                  <p className="text-xs text-zinc-400">
                    ${segment.value.toLocaleString()} ({segment.percentage.toFixed(1)}%)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-zinc-400 mb-2">No expenses yet</p>
          <p className="text-xs text-zinc-500">
            Start adding expenses to see your spending breakdown
          </p>
        </div>
      )}
    </div>
  );
}
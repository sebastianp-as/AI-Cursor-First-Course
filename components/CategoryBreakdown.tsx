"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import useSWR from "swr";

ChartJS.register(ArcElement, Tooltip, Legend);

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function CategoryBreakdown() {
  const { data } = useSWR("/api/transactions?scope=categories", fetcher);
  const labels: string[] = data?.labels ?? ["Housing", "Food", "Transport", "Shopping"];
  const values: number[] = data?.values ?? [800, 350, 120, 200];

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#a78bfa"],
        borderWidth: 0
      }
    ]
  };

  return (
    <div className="h-64">
      <Doughnut
        data={chartData}
        options={{
          animation: { animateRotate: true, duration: 750, easing: "easeOutQuart" },
          plugins: { legend: { display: true, position: "bottom" } }
        }}
      />
    </div>
  );
}


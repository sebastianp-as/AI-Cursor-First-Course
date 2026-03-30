"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";
import useSWR from "swr";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ExpenseChart() {
  const { data } = useSWR("/api/transactions?scope=monthly", fetcher);

  const labels: string[] = data?.labels ?? ["Week 1", "Week 2", "Week 3", "Week 4"];
  const expenses: number[] = data?.expenses ?? [120, 310, 220, 180];
  const income: number[] = data?.income ?? [800, 0, 0, 0];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Expenses",
        data: expenses,
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        tension: 0.3
      },
      {
        label: "Income",
        data: income,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        tension: 0.3
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true }
    },
    scales: {
      y: { beginAtZero: true }
    },
    animation: {
      duration: 700,
      easing: "easeOutQuart"
    },
    elements: {
      point: { radius: 3, hoverRadius: 5 },
      line: { borderWidth: 2, fill: true }
    }
  } as const;

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
}


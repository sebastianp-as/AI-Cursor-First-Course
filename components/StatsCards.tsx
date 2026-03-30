"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function StatsCards() {
  const { data } = useSWR<{ income: number; expenses: number; balance: number }>(
    "/api/transactions?scope=summary",
    fetcher
  );
  const income = data?.income ?? 0;
  const expenses = data?.expenses ?? 0;
  const balance = data?.balance ?? income - expenses;

  const Item = ({
    label,
    value,
    color
  }: {
    label: string;
    value: number;
    color: "green" | "red" | "indigo";
  }) => (
    <div className="glass glass-hover p-4">
      <div className="muted text-sm">{label}</div>
      <div
        className={`mt-1 text-2xl font-semibold ${
          color === "green" ? "text-green-500" : color === "red" ? "text-red-500" : "text-indigo-500"
        }`}
      >
        ${value.toFixed(2)}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Item label="Total Income (This Month)" value={income} color="green" />
      <Item label="Total Expenses (This Month)" value={expenses} color="red" />
      <Item label="Balance" value={balance} color="indigo" />
    </div>
  );
}


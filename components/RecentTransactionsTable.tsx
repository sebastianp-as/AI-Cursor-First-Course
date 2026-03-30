"use client";

import useSWR from "swr";

type Transaction = {
  id: number;
  type: "INCOME" | "EXPENSE";
  amount: number;
  description: string | null;
  date: string;
  category?: { name: string } | null;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function RecentTransactionsTable() {
  const { data } = useSWR<{ transactions: Transaction[] }>("/api/transactions?limit=5", fetcher);

  const txns =
    data?.transactions ??
    [
      { id: 1, type: "EXPENSE", amount: 24.5, description: "Coffee", date: new Date().toISOString(), category: { name: "Food" } },
      { id: 2, type: "EXPENSE", amount: 120.0, description: "Groceries", date: new Date().toISOString(), category: { name: "Food" } },
      { id: 3, type: "INCOME", amount: 2500.0, description: "Salary", date: new Date().toISOString(), category: null }
    ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="text-left">
          <tr className="border-b border-border dark:border-border-dark">
            <th className="py-2 pr-4">Date</th>
            <th className="py-2 pr-4">Description</th>
            <th className="py-2 pr-4">Category</th>
            <th className="py-2 pr-4 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {txns.map((t) => (
            <tr key={t.id} className="border-b border-border/50 dark:border-border-dark/50">
              <td className="py-2 pr-4">{new Date(t.date).toLocaleDateString()}</td>
              <td className="py-2 pr-4">{t.description ?? "-"}</td>
              <td className="py-2 pr-4">{t.category?.name ?? "-"}</td>
              <td className="py-2 pr-0 text-right">
                <span className={t.type === "EXPENSE" ? "text-red-500" : "text-green-500"}>
                  {t.type === "EXPENSE" ? "-" : "+"}${t.amount.toFixed(2)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


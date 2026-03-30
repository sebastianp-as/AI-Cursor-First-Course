"use client";

import { useState } from "react";
import useSWR from "swr";

type Category = { id: number; name: string };

export default function AddTransactionForm() {
  const [submitting, setSubmitting] = useState(false);
  const { data: categories } = useSWR<{ categories: Category[] }>(
    "/api/categories",
    (u) => fetch(u).then((r) => r.json())
  );

  async function onSubmit(formData: FormData) {
    setSubmitting(true);
    const payload = {
      type: formData.get("type"),
      amount: Number(formData.get("amount")),
      description: String(formData.get("description") || ""),
      date: String(formData.get("date")),
      categoryId: formData.get("categoryId")
        ? Number(formData.get("categoryId"))
        : null
    };
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setSubmitting(false);
    if (res.ok) {
      (document.getElementById("txn-form") as HTMLFormElement)?.reset();
    } else {
      alert("Failed to add transaction");
    }
  }

  return (
    <form id="txn-form" action={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm">Type</label>
        <select name="type" className="glass px-3 py-2 border" required defaultValue="EXPENSE">
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm">Amount</label>
        <input name="amount" type="number" min="0" step="0.01" className="glass px-3 py-2 border" required />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm">Date</label>
        <input name="date" type="date" className="glass px-3 py-2 border" required />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm">Category</label>
        <select name="categoryId" className="glass px-3 py-2 border">
          <option value="">— None —</option>
          {(categories?.categories ?? []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2 flex flex-col gap-1">
        <label className="text-sm">Description</label>
        <input name="description" type="text" className="glass px-3 py-2 border" placeholder="Optional details" />
      </div>
      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Add Transaction"}
        </button>
      </div>
    </form>
  );
}


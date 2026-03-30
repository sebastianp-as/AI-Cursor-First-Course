"use client";

import { Sparkles } from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AIInsightsCard() {
  const { data, isLoading } = useSWR("/api/insights", fetcher);

  const insights: string[] =
    data?.insights ??
    [
      "Your dining expenses increased 18% vs last month. Consider a weekly budget.",
      "You spent on 4 different subscriptions. Audit recurring charges to save 10–15%.",
      "Transport costs spike on Fridays. Carpool or off-peak options could reduce by ~12%."
    ];

  return (
    <div className="glass p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="heading-2">AI Insights</h2>
        <Sparkles className="h-5 w-5 text-indigo-500" />
      </div>
      {isLoading ? (
        <div className="muted text-sm">Generating insights…</div>
      ) : (
        <ul className="list-disc pl-5 space-y-2">
          {insights.map((i, idx) => (
            <li key={idx} className="text-sm leading-relaxed">
              {i}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


import ExpenseChart from "@/components/ExpenseChart";
import CategoryBreakdown from "@/components/CategoryBreakdown";

export default function AnalyticsPage() {
  return (
    <div className="container-page space-y-6">
      <h1 className="heading-1">Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-4">
          <h2 className="heading-2 mb-2">Monthly Spend</h2>
          <ExpenseChart />
        </div>
        <div className="glass p-4">
          <h2 className="heading-2 mb-2">Category Breakdown</h2>
          <CategoryBreakdown />
        </div>
      </div>
    </div>
  );
}


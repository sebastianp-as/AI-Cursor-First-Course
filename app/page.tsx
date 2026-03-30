import ExpenseChart from "@/components/ExpenseChart";
import CategoryBreakdown from "@/components/CategoryBreakdown";
import RecentTransactionsTable from "@/components/RecentTransactionsTable";
import AIInsightsCard from "@/components/AIInsightsCard";
import StatsCards from "@/components/StatsCards";

export default function DashboardPage() {
  return (
    <div className="container-page space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="heading-1">Dashboard</h1>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="glass glass-hover p-4 lg:col-span-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="heading-2">Monthly Spend</h2>
          </div>
          <ExpenseChart />
        </div>
        <div className="glass glass-hover p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="heading-2">By Category</h2>
          </div>
          <CategoryBreakdown />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass glass-hover p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="heading-2">Recent Transactions</h2>
          </div>
          <RecentTransactionsTable />
        </div>
        <AIInsightsCard />
      </div>
    </div>
  );
}


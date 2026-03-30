import { PrismaClient } from "@prisma/client";

type InsightOptions = {
  userId: number;
};

export async function generateInsights(prisma: PrismaClient, opts: InsightOptions): Promise<string[]> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);

  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);

  const [thisAgg, lastAgg, thisCat, prevThreeCat] = await Promise.all([
    prisma.transaction.groupBy({
      by: ["type"],
      where: { userId: opts.userId, date: { gte: monthStart, lt: nextMonthStart } },
      _sum: { amount: true }
    }),
    prisma.transaction.groupBy({
      by: ["type"],
      where: { userId: opts.userId, date: { gte: lastMonthStart, lt: lastMonthEnd } },
      _sum: { amount: true }
    }),
    prisma.transaction.groupBy({
      by: ["categoryId"],
      where: { userId: opts.userId, type: "EXPENSE", date: { gte: monthStart, lt: nextMonthStart } },
      _sum: { amount: true }
    }),
    prisma.transaction.groupBy({
      by: ["categoryId"],
      where: { userId: opts.userId, type: "EXPENSE", date: { gte: threeMonthsAgo, lt: monthStart } },
      _sum: { amount: true }
    })
  ]);

  const incomeThis = Number(thisAgg.find((g) => g.type === "INCOME")?._sum.amount ?? 0);
  const spendThis = Number(thisAgg.find((g) => g.type === "EXPENSE")?._sum.amount ?? 0);
  const incomeLast = Number(lastAgg.find((g) => g.type === "INCOME")?._sum.amount ?? 0);
  const spendLast = Number(lastAgg.find((g) => g.type === "EXPENSE")?._sum.amount ?? 0);

  const categories = await prisma.category.findMany({ where: { userId: opts.userId } });
  const catName = (id: number | null) => categories.find((c) => c.id === id)?.name ?? "Uncategorized";

  const byCatThis = thisCat
    .map((g) => ({ name: catName(g.categoryId), amount: Number(g._sum.amount ?? 0) }))
    .sort((a, b) => b.amount - a.amount);

  const byCatPrevTotals: Record<string, { sum: number; count: number }> = {};
  for (const g of prevThreeCat) {
    const name = catName(g.categoryId);
    const amt = Number(g._sum.amount ?? 0);
    if (!byCatPrevTotals[name]) byCatPrevTotals[name] = { sum: 0, count: 0 };
    byCatPrevTotals[name].sum += amt;
    byCatPrevTotals[name].count += 1;
  }

  const insights: string[] = [];

  // 1) Percent of income on Food
  if (incomeThis > 0) {
    const foodAmt = byCatThis.find((x) => x.name.toLowerCase() === "food")?.amount ?? 0;
    const pct = Math.round((foodAmt / incomeThis) * 100);
    if (pct > 0) insights.push(`You spend ${pct}% of your income on food`);
  }

  // 2) Month-over-month spending delta
  if (spendLast > 0) {
    const deltaPct = Math.round(((spendThis - spendLast) / spendLast) * 100);
    if (deltaPct > 0) insights.push(`Your spending increased ${deltaPct}% compared to last month`);
    if (deltaPct < 0) insights.push(`Your spending decreased ${Math.abs(deltaPct)}% compared to last month`);
  }

  // 3) Outlier detection for "Entertainment"
  const entertainmentAmt = byCatThis.find((x) => x.name.toLowerCase() === "entertainment")?.amount ?? 0;
  const prev = byCatPrevTotals["Entertainment"];
  if (prev && prev.count > 0) {
    const avg = prev.sum / prev.count;
    if (entertainmentAmt > avg * 1.5 && entertainmentAmt > 0) {
      insights.push("Entertainment spending is unusually high");
    }
  } else if (incomeThis > 0) {
    const share = Math.round((entertainmentAmt / incomeThis) * 100);
    if (share >= 15) insights.push("Entertainment spending is unusually high");
  }

  // 4) Top category this month
  if (byCatThis.length) {
    const top = byCatThis[0];
    insights.push(`${top.name} is your top category this month at $${top.amount.toFixed(0)}`);
  }

  // 5) Income vs Expense share
  if (incomeThis > 0 && spendThis > 0) {
    const rate = Math.round((spendThis / incomeThis) * 100);
    insights.push(`You spent ~${rate}% of income this month`);
  }

  if (insights.length === 0) insights.push("Add transactions to see insights.");
  return insights;
}


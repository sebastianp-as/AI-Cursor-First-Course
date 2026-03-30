import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") ?? "10");
  const scope = searchParams.get("scope");

  if (scope === "summary") {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const grouped = await prisma.transaction.groupBy({
      by: ["type"],
      where: { date: { gte: start, lt: end } },
      _sum: { amount: true }
    });
    const income = grouped.find((g) => g.type === "INCOME")?._sum.amount ?? 0;
    const expenses = grouped.find((g) => g.type === "EXPENSE")?._sum.amount ?? 0;
    const balance = income - expenses;
    return NextResponse.json({ income, expenses, balance });
  }

  if (scope === "monthly") {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const transactions = await prisma.transaction.findMany({
      where: { date: { gte: start, lt: end } }
    });

    const weeks = [0, 0, 0, 0];
    const income = [0, 0, 0, 0];
    for (const t of transactions) {
      const day = new Date(t.date).getDate();
      const idx = Math.min(3, Math.floor((day - 1) / 7));
      if (t.type === "EXPENSE") weeks[idx] += t.amount;
      else income[idx] += t.amount;
    }
    return NextResponse.json({
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      expenses: weeks,
      income
    });
  }

  if (scope === "categories") {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const grouped = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: { type: "EXPENSE", date: { gte: start, lt: end } },
      _sum: { amount: true }
    });
    const categories = await prisma.category.findMany();
    const labels: string[] = [];
    const values: number[] = [];
    for (const g of grouped) {
      const cat = categories.find((c) => c.id === g.categoryId);
      labels.push(cat?.name ?? "Uncategorized");
      values.push(g._sum.amount ?? 0);
    }
    return NextResponse.json({ labels, values });
  }

  const transactions = await prisma.transaction.findMany({
    orderBy: { date: "desc" },
    take: limit,
    include: { category: true }
  });
  return NextResponse.json({ transactions });
}

const TxnSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.number().nonnegative(),
  description: z.string().optional(),
  date: z.string().transform((s) => new Date(s)),
  categoryId: z.number().nullable().optional()
});

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = TxnSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  // Temporary: associate with demo user. Replace with auth-based userId.
  const user =
    (await prisma.user.findFirst({ where: { email: "demo@finance.ai" } })) ||
    (await prisma.user.create({ data: { email: "demo@finance.ai", name: "Demo User" } }));

  const created = await prisma.transaction.create({
    data: {
      userId: user.id,
      type: data.type,
      amount: data.amount,
      description: data.description,
      date: data.date,
      categoryId: data.categoryId ?? undefined
    }
  });
  return NextResponse.json({ transaction: created }, { status: 201 });
}


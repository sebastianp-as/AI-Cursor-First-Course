import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateInsights } from "@/lib/insights";

export async function GET() {
  // Temporary demo user association to scope insights
  const user =
    (await prisma.user.findFirst({ where: { email: "demo@finance.ai" } })) ||
    (await prisma.user.create({ data: { email: "demo@finance.ai", name: "Demo User" } }));

  const insights = await generateInsights(prisma, { userId: user.id });
  return NextResponse.json({ insights });
}


const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {

  const user = await prisma.user.upsert({
    where: { email: "demo@finance.ai" },
    update: {},
    create: {
      email: "demo@finance.ai",
      name: "Demo User"
    }
  });

  const categoryData = [
    { name: "Housing", color: "#3b82f6" },
    { name: "Food", color: "#22c55e" },
    { name: "Transport", color: "#f59e0b" },
    { name: "Shopping", color: "#ef4444" },
    { name: "Health", color: "#14b8a6" },
    { name: "Entertainment", color: "#8b5cf6" },
    { name: "Utilities", color: "#64748b" }
  ];

  const categories = [];

  for (const c of categoryData) {
    const cat = await prisma.category.upsert({
      where: {
        userId_name: {
          userId: user.id,
          name: c.name
        }
      },
      update: { color: c.color },
      create: {
        name: c.name,
        color: c.color,
        userId: user.id
      }
    });

    categories.push(cat);
  }

  const food = categories.find(c => c.name === "Food");
  const housing = categories.find(c => c.name === "Housing");
  const transport = categories.find(c => c.name === "Transport");

  const today = new Date();
  const earlier = new Date();
  earlier.setDate(today.getDate() - 10);

  const mid = new Date();
  mid.setDate(today.getDate() - 5);

  await prisma.transaction.createMany({
    data: [
      {
        userId: user.id,
        type: "INCOME",
        amount: 3000,
        description: "Monthly Salary",
        date: new Date(today.getFullYear(), today.getMonth(), 1)
      },
      {
        userId: user.id,
        type: "EXPENSE",
        amount: 45.75,
        description: "Groceries",
        date: mid,
        categoryId: food?.id
      },
      {
        userId: user.id,
        type: "EXPENSE",
        amount: 1200,
        description: "Rent",
        date: new Date(today.getFullYear(), today.getMonth(), 2),
        categoryId: housing?.id
      },
      {
        userId: user.id,
        type: "EXPENSE",
        amount: 18.2,
        description: "Gas",
        date: earlier,
        categoryId: transport?.id
      }
    ]
  });

  console.log("🌱 Seed completed successfully");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  
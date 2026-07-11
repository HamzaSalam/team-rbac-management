import "dotenv/config";
import { hashPassword } from "@/app/lib/auth";
import { Role } from "@/app/types";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const teams = await Promise.all([
    prisma.team.upsert({
      where: { code: "ENG-2024" },
      update: {},
      create: {
        name: "Engineering",
        description: "Engineering team responsible for product development",
        code: "ENG-2024",
      },
    }),
    prisma.team.upsert({
      where: { code: "DES-2024" },
      update: {},
      create: {
        name: "Design",
        description: "Design team responsible for UI/UX",
        code: "DES-2024",
      },
    }),
    prisma.team.upsert({
      where: { code: "OPS-2024" },
      update: {},
      create: {
        name: "Operation",
        description: "Business Operation team",
        code: "OPS-2024",
      },
    }),
  ]);

  const sampleUsers = [
    {
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      team: teams[0],
      role: Role.MANAGER,
    },
    {
      name: "Bob Smith",
      email: "bob.smith@example.com",
      team: teams[0],
      role: Role.USER,
    },
    {
      name: "Charlie Brown",
      email: "charlie.brown@example.com",
      team: teams[1],
      role: Role.MANAGER,
    },
    {
      name: "Diana Prince",
      email: "diana.prince@example.com",
      team: teams[1],
      role: Role.USER,
    },
  ];

  for (const userData of sampleUsers) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        name: userData.name,
        teamId: userData.team.id,
        role: userData.role,
      },
      create: {
        name: userData.name,
        email: userData.email,
        password: await hashPassword("password123"),
        teamId: userData.team.id,
        role: userData.role,
      },
    });
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seeding failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

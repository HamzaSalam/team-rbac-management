import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("Connected to the database successfully.");
    return true;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    return false;
  }
}

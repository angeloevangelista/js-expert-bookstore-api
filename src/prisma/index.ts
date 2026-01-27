import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

function getPrismaClient() {
  const prismaAdapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });

  const prisma = new PrismaClient({
    adapter: prismaAdapter,
  });

  return prisma;
}

export default getPrismaClient;

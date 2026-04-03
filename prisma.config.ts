import path from "node:path";
import { defineConfig } from "prisma/config";

// Prisma 7 moves connection URLs from schema.prisma to this file.
// The CLI (migrations, studio, etc.) reads `datasource.url` from here.
// The runtime PrismaClient uses a driver adapter — see lib/prisma.ts.
// https://pris.ly/d/config-datasource
export default defineConfig({
  schema: path.join(__dirname, "prisma/schema.prisma"),
  datasource: {
    // DIRECT_URL is the non-pooled connection used for migrations.
    // Falls back to DATABASE_URL if DIRECT_URL is not set.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});

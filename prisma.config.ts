import "dotenv/config";
import { defineConfig } from "prisma/config";

const directUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!directUrl) {
  throw new Error(
    "Missing DIRECT_URL. Copy the Direct connection string from Neon into .env.local (see .env.example)."
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // Neon: direct (non-pooler) URL for migrate / db push / studio
  datasource: {
    url: directUrl,
  },
});

import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const { PORT } = process.env;

export const PROJECT_IDS = process.env.PROJECT_IDS
  ? process.env.PROJECT_IDS.split(",").map((id) => id.trim()) // array of trimmed strings ["id1", "id2", ...]
  : [];

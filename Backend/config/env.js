import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const { PORT } = process.env;

export const PROJECT_IDS = process.env.PROJECT_IDS
  ? process.env.PROJECT_IDS.split(",").map((id) => id.trim()) // array of trimmed strings ["id1", "id2", ...]
  : [];
export const FTE_HOURS_PER_YEAR =
  Number(process.env.FTE_HOURS_PER_YEAR) || 1960; // 40-hour week with 3 weeks of vacation

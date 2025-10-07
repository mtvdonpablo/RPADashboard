import { Router } from "express";
import db from "../db.js"; // default import from a CJS module
const { pool, poolConnect } = db;
import { PROJECT_IDS } from "../config/env.js";
const projectsRouter = Router();
const projectIDString = PROJECT_IDS.join(",");

// Get all unique project ids
projectsRouter.get("/count", async (req, res) => {
  try {
    const result = PROJECT_IDS.length;
    res.json({ count: result });
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Database query failed");
  }
});

projectsRouter.get("/runs", async (req, res) => {
  try {
    await poolConnect; // ensures that the pool has been created
    const result = await pool.request().query(`
    SELECT
      ProjectName,
      COUNT(DISTINCT TransactionDate) AS [Count]
    FROM [DS_ADHOC_BOPs].[rpa].[Master_Impact_Report]
    WHERE Status = 'Pass'
      AND  [ProjectID] IN (${projectIDString})
    GROUP BY ProjectName
    ORDER BY ProjectName;
                `);
    res.json(result.recordset);
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Database query failed");
  }
});

// Get all transactions for a specific project id
//Get number of times a specific project has ran

export default projectsRouter;

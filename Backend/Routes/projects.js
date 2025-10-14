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

projectsRouter.get("/transactions", async (req, res) => {
  try {
    await poolConnect; // ensures that the pool has been created
    const result = await pool.request().query(`
-- Map your known project IDs
DECLARE @pid_ZOR int = 15;   -- ZOR Phase 2
DECLARE @pid_PGI int = 29;   -- PGI (ZOR)

;WITH src AS (
    SELECT
        ProjectID,
        ProjectName,
        -- TransactionDate stored as yyyymmdd -> convert to DATE
        dt = TRY_CONVERT(date, CONVERT(varchar(8), TransactionDate), 112),
        Status
    FROM [DS_ADHOC_BOPs].[rpa].[Master_Impact_Report]
    WHERE TransactionDate IS NOT NULL AND Status = 'Pass'
      -- If you only want successful transactions, uncomment next line:
      -- AND Status = 'Pass'
),
agg AS (
    SELECT
        [year]  = YEAR(dt),
        MonthNo = MONTH(dt),
        [month] = DATENAME(MONTH, dt),

        [ZOR Phase 2] = SUM(CASE WHEN ProjectID = @pid_ZOR THEN 1 ELSE 0 END),
        [PGI (ZOR)]   = SUM(CASE WHEN ProjectID = @pid_PGI THEN 1 ELSE 0 END),
        [Hardware Renewal Phase 1] =
            SUM(CASE WHEN ProjectName = 'Hardware Renewal Phase 1' THEN 1 ELSE 0 END)
    FROM src
    GROUP BY YEAR(dt), MONTH(dt), DATENAME(MONTH, dt)
)
-- Tabular result (good for debugging)
SELECT
    [ZOR Phase 2],
    [PGI (ZOR)],
    [Hardware Renewal Phase 1],
    [month],
    [year] = CAST([year] AS varchar(4))
FROM agg
ORDER BY [year], MonthNo;
      `);
    const response = {
      data: result.recordset,
      series: [
        { name: "ZOR Phase 2", color: "teal.solid" },
        { name: "PGI (ZOR)", color: "purple.solid" },
        { name: "Hardware Renewal Phase 1", color: "blue.solid" },
      ],
    };
    res.json(response);
    console.log(response);
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Database query failed");
  }
});

// Get all transactions for a specific project id
//Get number of times a specific project has ran

export default projectsRouter;

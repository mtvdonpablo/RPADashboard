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



projectsRouter.get("/transactions-by-month", async (req, res) => {
  try {
    await poolConnect;

    const year = req.query.year ? parseInt(req.query.year, 10) : new Date().getFullYear();

    const sqlQuery = `
      WITH Txn AS (
        SELECT
            ProjectID,
            ProjectName,
            TRY_CONVERT(date, CONVERT(varchar(8), TransactionDate), 112) AS TxnDate
        FROM [DS_ADHOC_BOPs].[rpa].[Master_Impact_Report]
        WHERE
            TransactionDate IS NOT NULL
            AND Status = 'Pass'
            AND ProjectID IN (${projectIDString})
      )
      SELECT
          YEAR(TxnDate)            AS [Year],
          MONTH(TxnDate)           AS [MonthNumber],
          DATENAME(MONTH, TxnDate) AS [MonthName],
          ProjectName,
          COUNT(*)                 AS TransactionCount
      FROM Txn
      WHERE YEAR(TxnDate) = ${year}
      GROUP BY
          YEAR(TxnDate),
          MONTH(TxnDate),
          DATENAME(MONTH, TxnDate),
          ProjectName
      ORDER BY
          [Year],
          [MonthNumber],
          ProjectName;
    `;

    const result = await pool.request().query(sqlQuery);
    const rows = result.recordset;

    // -------------------------
    // Build Chakra "data" array
    // -------------------------
    const monthMap = new Map();

    rows.forEach((row) => {
      const key = `${row.Year}-${row.MonthNumber}`;

      if (!monthMap.has(key)) {
        monthMap.set(key, {
          month: row.MonthName,
          monthNumber: row.MonthNumber,
        });
      }

      const entry = monthMap.get(key);
      entry[row.ProjectName] = row.TransactionCount;
    });

    const data = Array.from(monthMap.values())
      .sort((a, b) => a.monthNumber - b.monthNumber)
      // eslint-disable-next-line no-unused-vars
      .map(({ monthNumber, ...rest }) => rest);

    // -------------------------
    // Build Chakra "series" array dynamically
    // -------------------------
    const projectNames = [...new Set(rows.map((r) => r.ProjectName))];

    const palette = ["teal.solid", "purple.solid", "blue.solid", "orange.solid"];

    const series = projectNames.map((name, index) => ({
      name,
      color: palette[index % palette.length],
    }));

    // Final response
    res.json({ data, series });
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Database query failed");
  }
});

projectsRouter.get("/transactions-years", async (req, res) => {
  try {
    await poolConnect;

    const sqlQuery = `
      SELECT DISTINCT YEAR(TRY_CONVERT(date, CONVERT(varchar(8), TransactionDate), 112)) AS [Year]
      FROM [DS_ADHOC_BOPs].[rpa].[Master_Impact_Report]
      WHERE
          TransactionDate IS NOT NULL
          AND Status = 'Pass'
          AND ProjectID IN (${projectIDString})
      ORDER BY [Year] DESC;
    `;

    const result = await pool.request().query(sqlQuery);
    const years = result.recordset.map((r) => r.Year);

    res.json({ years });
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Database query failed");
  }
});





projectsRouter.get("/names", async (req, res) => {
  try {
    await poolConnect; // ensures that the pool has been created
    const result = await pool.request().query(`
    SELECT DISTINCT ProjectName
    FROM [DS_ADHOC_BOPs].[rpa].[Master_Impact_Report]
    WHERE ProjectID IN (${projectIDString})
`);

    res.json(result.recordset);
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Database query failed");
  }
});


projectsRouter.get("/successrates", async (req, res) => {
  try {
    await poolConnect; // ensures that the pool has been created
    const result = await pool.request().query(`
SELECT
    ProjectName,
    SUM(CASE WHEN Status = 'Pass' THEN 1 ELSE 0 END) AS successCount,
    SUM(CASE WHEN Status = 'Fail' THEN 1 ELSE 0 END) AS failCount,
    ROUND(
        (CAST(SUM(CASE WHEN Status = 'Pass' THEN 1 ELSE 0 END) AS FLOAT) /
        NULLIF(SUM(CASE WHEN Status IN ('Pass', 'Fail') THEN 1 ELSE 0 END), 0)) * 100,
        1
    ) AS successRate
FROM [DS_ADHOC_BOPs].[rpa].[Master_Impact_Report]
WHERE Status IN ('Pass', 'Fail')
    AND ProjectID IN (${projectIDString})
    AND (ErrorMessage IS NULL OR (
        ErrorMessage NOT LIKE 'BE -%'
        AND ErrorMessage != '0x80040465'
        AND ErrorMessage != 'PGI text not found'
        AND ErrorMessage != 'Post Goods Issue button greyed out or not working'
    ))
GROUP BY ProjectName
ORDER BY successRate DESC;

`);

    res.json(result.recordset);
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Database query failed");
  }
});
// get all project names
// Get all transactions for a specific project id
//Get number of times a specific project has ran

export default projectsRouter;

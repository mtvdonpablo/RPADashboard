import { Router } from "express";
import db from "../db.js"; // default import from a CJS module
const { pool, poolConnect } = db;
import { PROJECT_IDS } from "../config/env.js";
import { getDateFilter } from "../utils/dateFilter.js";
const projectsRouter = Router();
const projectIDString = PROJECT_IDS.join(",");
const businessExceptionCondition = "ErrorMessage LIKE 'BE%'";
const systemExceptionCondition = `(
  ErrorMessage LIKE 'SE%'
  OR ErrorMessage LIKE '%Could not find the UI element%'
  OR ErrorMessage LIKE '%The operation has timed out%'
  OR ErrorMessage LIKE '%The UI element is invalid%'
  OR ErrorMessage LIKE '%Cannot bring the target application%'
  OR ErrorMessage LIKE '%The target application%'
  OR ErrorMessage LIKE '%Upload of the file failed%'
  OR ErrorMessage LIKE '%Print preview did not open%'
  OR ErrorMessage LIKE '%Post Goods Issue button greyed out or not working%'
  OR ErrorMessage LIKE '%Invalid input stream%'
  OR ErrorMessage LIKE '%Failed to reenter order after PGI. Please investigate%'
  OR ErrorMessage LIKE '%Could not find the user-interface (UI) element for this action%'
  OR ErrorMessage LIKE '%More than 1 service tag. This case has not been handled in the service tag logic. Please inform developer before manually processed%'
  OR ErrorMessage LIKE '%Quote failed to open%'
  OR ErrorMessage LIKE '%Quote number not in ref. description%'
  OR ErrorMessage LIKE '%Service tag not in ref. description%'
  OR ErrorMessage LIKE '%The target element is disabled. Operation canceled.%'
)`;
const recognizedExceptionCondition = `(
  ${businessExceptionCondition} OR ${systemExceptionCondition}
)`;
const getProjectFilter = (projectId) => {
  if (!projectId || projectId === "all") return "";
  return PROJECT_IDS.includes(projectId)
    ? `AND ProjectID = ${Number(projectId)}`
    : null;
};

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

projectsRouter.get("/transaction-summary", async (req, res) => {
  try {
    await poolConnect;
    const range = req.query.range || "all";
    const dateFilter = getDateFilter(range);
    const result = await pool.request().query(`
      SELECT
        SUM(CASE WHEN Status = 'Pass' THEN 1 ELSE 0 END) AS Successful,
        SUM(CASE
          WHEN Status = 'Fail'
            AND ${recognizedExceptionCondition}
          THEN 1 ELSE 0
        END) AS Exceptions,
        SUM(CASE
          WHEN Status = 'Fail' AND ${systemExceptionCondition}
          THEN 1 ELSE 0
        END) AS SystemExceptions
      FROM [DS_ADHOC_BOPs].[rpa].[Master_Impact_Report]
      WHERE ProjectID IN (${projectIDString})
        AND (
          Status = 'Pass'
          OR (
            Status = 'Fail'
            AND ${recognizedExceptionCondition}
          )
        )
        ${dateFilter};
    `);

    const successful = Number(result.recordset[0]?.Successful) || 0;
    const exceptions = Number(result.recordset[0]?.Exceptions) || 0;
    const systemExceptions =
      Number(result.recordset[0]?.SystemExceptions) || 0;
    const transactionsProcessed = successful + exceptions;
    const successRateTransactions = successful + systemExceptions;
    const successRate = successRateTransactions
      ? Number(((successful / successRateTransactions) * 100).toFixed(1))
      : 0;

    res.json({ transactionsProcessed, successful, exceptions, successRate });
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Database query failed");
  }
});



projectsRouter.get("/transactions-by-month", async (req, res) => {
  try {
    await poolConnect;

    const year = req.query.year ? parseInt(req.query.year, 10) : new Date().getFullYear();
    const projectFilter = getProjectFilter(req.query.projectId);
    if (projectFilter === null) return res.status(400).send("Invalid project ID");

    const sqlQuery = `
      WITH Txn AS (
        SELECT
            TRY_CONVERT(date, CONVERT(varchar(8), TransactionDate), 112) AS TxnDate
        FROM [DS_ADHOC_BOPs].[rpa].[Master_Impact_Report]
        WHERE
            TransactionDate IS NOT NULL
            AND Status = 'Pass'
            AND ProjectID IN (${projectIDString})
            ${projectFilter}
      )
      SELECT
          YEAR(TxnDate)            AS [Year],
          MONTH(TxnDate)           AS [MonthNumber],
          DATENAME(MONTH, TxnDate) AS [MonthName],
          COUNT(*)                 AS TransactionCount
      FROM Txn
      WHERE YEAR(TxnDate) = ${year}
      GROUP BY
          YEAR(TxnDate),
          MONTH(TxnDate),
          DATENAME(MONTH, TxnDate)
      ORDER BY
          [Year],
          [MonthNumber];
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
      entry["Successful Transactions"] = row.TransactionCount;
    });

    const data = Array.from(monthMap.values())
      .sort((a, b) => a.monthNumber - b.monthNumber)
      // eslint-disable-next-line no-unused-vars
      .map(({ monthNumber, ...rest }) => rest);

    // -------------------------
    // Build Chakra "series" array dynamically
    // -------------------------
    const series = [{ name: "Successful Transactions", color: "green.solid" }];

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

projectsRouter.get("/failed-transactions-by-month", async (req, res) => {
  try {
    await poolConnect;

    const year = req.query.year ? parseInt(req.query.year, 10) : new Date().getFullYear();
    const projectFilter = getProjectFilter(req.query.projectId);
    if (projectFilter === null) return res.status(400).send("Invalid project ID");

    const sqlQuery = `
      WITH Txn AS (
        SELECT
            TRY_CONVERT(date, CONVERT(varchar(8), TransactionDate), 112) AS TxnDate,
            CASE
              WHEN ${systemExceptionCondition} THEN 'System Exception'
              WHEN ${businessExceptionCondition} THEN 'Business Exception'
            END AS ExceptionType
        FROM [DS_ADHOC_BOPs].[rpa].[Master_Impact_Report]
        WHERE
            TransactionDate IS NOT NULL
            AND Status = 'Fail'
            AND ProjectID IN (${projectIDString})
            ${projectFilter}
            AND ${recognizedExceptionCondition}
      )
      SELECT
          YEAR(TxnDate)            AS [Year],
          MONTH(TxnDate)           AS [MonthNumber],
          DATENAME(MONTH, TxnDate) AS [MonthName],
          ExceptionType,
          COUNT(*)                 AS TransactionCount
      FROM Txn
      WHERE YEAR(TxnDate) = ${year}
      GROUP BY
          YEAR(TxnDate),
          MONTH(TxnDate),
          DATENAME(MONTH, TxnDate),
          ExceptionType
      ORDER BY
          [Year],
          [MonthNumber],
          ExceptionType;
    `;

    const result = await pool.request().query(sqlQuery);
    const rows = result.recordset;

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
      entry[row.ExceptionType] = row.TransactionCount;
    });

    const data = Array.from(monthMap.values())
      .sort((a, b) => a.monthNumber - b.monthNumber)
      // eslint-disable-next-line no-unused-vars
      .map(({ monthNumber, ...rest }) => rest);

    const series = [
      { name: "Business Exception", color: "orange.solid" },
      { name: "System Exception", color: "red.solid" },
    ];

    res.json({ data, series });
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Database query failed");
  }
});

projectsRouter.get("/failed-transactions-years", async (req, res) => {
  try {
    await poolConnect;

    const sqlQuery = `
      SELECT DISTINCT YEAR(TRY_CONVERT(date, CONVERT(varchar(8), TransactionDate), 112)) AS [Year]
      FROM [DS_ADHOC_BOPs].[rpa].[Master_Impact_Report]
      WHERE
          TransactionDate IS NOT NULL
          AND Status = 'Fail'
          AND ProjectID IN (${projectIDString})
          AND ${recognizedExceptionCondition}
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

projectsRouter.get("/errors-by-project", async (req, res) => {
  try {
    await poolConnect;
    const range = req.query.range || "all";
    const dateFilter = getDateFilter(range);
    const result = await pool.request().query(`
      SELECT
        ProjectID,
        ProjectName,
        ErrorMessage,
        CASE
          WHEN ${systemExceptionCondition} THEN 'SE'
          WHEN ${businessExceptionCondition} THEN 'BE'
        END AS ExceptionType,
        COUNT(*) AS OccurrenceCount
      FROM [DS_ADHOC_BOPs].[rpa].[Master_Impact_Report]
      WHERE
        Status = 'Fail'
        AND ProjectID IN (${projectIDString})
        AND ${recognizedExceptionCondition}
        ${dateFilter}
      GROUP BY
        ProjectID,
        ProjectName,
        ErrorMessage,
        CASE
          WHEN ${systemExceptionCondition} THEN 'SE'
          WHEN ${businessExceptionCondition} THEN 'BE'
        END
      ORDER BY ProjectName, COUNT(*) DESC;
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Database query failed");
  }
});

projectsRouter.get("/names", async (req, res) => {
  try {
    await poolConnect; // ensures that the pool has been created
    const result = await pool.request().query(`
    SELECT DISTINCT ProjectID, ProjectName
    FROM [DS_ADHOC_BOPs].[rpa].[Master_Impact_Report]
    WHERE ProjectID IN (${projectIDString})
    ORDER BY ProjectName
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
    const range = req.query.range || "all";
    const dateFilter = getDateFilter(range);
    const projectFilter = getProjectFilter(req.query.projectId);
    if (projectFilter === null) return res.status(400).send("Invalid project ID");
    const result = await pool.request().query(`
SELECT
    ProjectName,
    SUM(CASE WHEN Status = 'Pass' THEN 1 ELSE 0 END) AS successCount,
    SUM(CASE WHEN Status = 'Fail' AND ${systemExceptionCondition} THEN 1 ELSE 0 END) AS failCount,
    SUM(CASE
      WHEN Status = 'Fail'
        AND ${businessExceptionCondition}
        AND NOT ${systemExceptionCondition}
      THEN 1 ELSE 0
    END) AS businessExceptionCount,
    ROUND(
        (CAST(SUM(CASE WHEN Status = 'Pass' THEN 1 ELSE 0 END) AS FLOAT) /
        NULLIF(
          SUM(CASE WHEN Status = 'Pass' THEN 1 ELSE 0 END)
          + SUM(CASE WHEN Status = 'Fail' AND ${systemExceptionCondition} THEN 1 ELSE 0 END),
          0
        )) * 100,
        1
    ) AS successRate
FROM [DS_ADHOC_BOPs].[rpa].[Master_Impact_Report]
WHERE ProjectID IN (${projectIDString})
    ${projectFilter}
    AND (
      Status = 'Pass'
      OR (Status = 'Fail' AND ${recognizedExceptionCondition})
    )
    ${dateFilter}
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


// Add avg run time for each project

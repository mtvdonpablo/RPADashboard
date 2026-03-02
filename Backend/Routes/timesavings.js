import { Router } from "express";
import db from "../db.js";
const { pool, poolConnect } = db;
import { PROJECT_IDS, FTE_HOURS_PER_YEAR } from "../config/env.js";
import {getDateFilter} from "../utils/dateFilter.js";
const timesavingsRouter = Router();

const projectIDString = PROJECT_IDS.join(",");

// Map that stores the time savings for each transaction for every proccess  [project id, time saved in minutes]
const projectTimeSavings = new Map([
  ["15", 5], // ZOR Phase 2
  ["29", 3], // PGI (Zor)
  ["16", 15], // APA 2 SAP
]);

const calculateTotalTimeSaved = (records) => {
  const totalMinutes = records.reduce((sum, record) => {
    const timePerTransaction =
      projectTimeSavings.get(record.ProjectID.toString()) || 0;
    return sum + timePerTransaction;
  }, 0);

  return totalMinutes / 60;
};

// Total time savings across all projects
timesavingsRouter.get("/total", async (req, res) => {
  try {
    await poolConnect; // ensures that the pool has been created
    const range = req.query.range || "all";
    const dateFilter = getDateFilter(range);
    const result = await pool.request().query(`
            SELECT ProjectID 
            FROM [DS_ADHOC_BOPs].[rpa].[Master_Impact_Report]
            WHERE [ProjectID] IN (${projectIDString}) AND [Status] ='Pass'
            ${dateFilter}
            `);
    let timeSavedInHours = 0;
    timeSavedInHours = calculateTotalTimeSaved(result.recordset);
    console.log("Total time saved in hours:", timeSavedInHours);
    // Calculate FTEs saved
    // Formula: Total hours saved using bot / total working hours in a year (assumed 1960 hours)
    // 40 hour work week, with 3 weeks of vacation
    const fteSaved = timeSavedInHours / FTE_HOURS_PER_YEAR;
    console.log("FTEs saved:", fteSaved);
    res.json({
      timeSaved: timeSavedInHours,
      fteSaved: Number(fteSaved.toFixed(2)),
    });
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Database query failed");
  }
});

// Get breakdown of time savings by project
timesavingsRouter.get("/breakdown", async (req, res) => {
  try {
    await poolConnect;
    const range = req.query.range || "all";
    const dateFilter = getDateFilter(range);
    const result = await pool.request().query(`
  SELECT 
      ProjectID,
      ProjectName,
      COUNT(*) AS TotalRows
  FROM [DS_ADHOC_BOPs].[rpa].[Master_Impact_Report]
  WHERE ProjectID IN (${projectIDString}) 
    AND Status = 'Pass' ${dateFilter}
  GROUP BY ProjectID, ProjectName;
`);

    // Map SQL results → hours
    const formatted = result.recordset.map((record) => {
      const timeSavedPerTransaction =
        projectTimeSavings.get(record.ProjectID.toString()) || 0; // minutes per run

      const totalTimeSavedInHours =
        (record.TotalRows * timeSavedPerTransaction) / 60;

      return {
        ProjectName: record.ProjectName, // keep consistent with your chart naming
        hours: Number(totalTimeSavedInHours.toFixed(2)), // optional: cleaner output
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Database connection failed");
  }
});

export default timesavingsRouter;

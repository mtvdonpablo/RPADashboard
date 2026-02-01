import { Router } from "express";
import db from "../db.js";
const { pool, poolConnect } = db;
import { PROJECT_IDS } from "../config/env.js";
const costsavingsRouter = Router();
import { getDateFilter } from "../utils/dateFilter.js";

// assuming 40 hour work weeks
const avgWagePerMinuteInCents = new Map([
  ["15", 51], // $64K/yr  on glassdoor billing coordinator ZOR Phase 2
  ["29", 50], // $63K/yr Median on glassdoor fullfillment specialist (PGI-ZOR)
  ["24", 47], // In Hardware documentation
  ["16", 51], // $64K/yr  on glassdoor for APA 2 SAP billing coordinator
]);
// Map that stores the time savings for each transaction for every proccess  [project id, time saved in minutes]
const projectTimeSavings = new Map([
  ["15", 5], // ZOR Phase 2
  ["29", 3],
  ["16", 15], // APA 2 SAP
]);
const projectIDString = PROJECT_IDS.join(",");

costsavingsRouter.get("/total", async (req, res) => {
  try {
    await poolConnect; // ensures that the pool has been created
    const range = req.query.range || "all";
    const dateFilter = getDateFilter(range);
    const result = await pool.request().query(`
                SELECT *
                FROM [DS_ADHOC_BOPs].[rpa].[Master_Impact_Report]
                WHERE [ProjectID] IN (${projectIDString}) AND [Status] ='Pass'
                ${dateFilter}
                `);
    let costSavedInCents = 0;
    let costSavedInDollars = 0;
    result.recordset.forEach((record) => {
      costSavedInCents +=
        projectTimeSavings.get(record.ProjectID) *
          avgWagePerMinuteInCents.get(record.ProjectID) || 0;
    });

    console.log("Total cost saved in cents:", costSavedInCents);
    costSavedInDollars = costSavedInCents / 100;
    console.log("Total cost saved in dollars:", costSavedInDollars);
    res.json({ costSaved: costSavedInDollars });
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Database query failed");
  }
});

// Get breakdown of cost savings by project
costsavingsRouter.get("/breakdown", async (req, res) => {
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

      const timeSavedInMinutes = record.TotalRows * timeSavedPerTransaction;
      const avgWagePerMinute =
        avgWagePerMinuteInCents.get(record.ProjectID.toString()) || 0;
      const totalCostSavedInCents = timeSavedInMinutes * avgWagePerMinute;
      const totalCostSavedInDollars = (totalCostSavedInCents / 100).toFixed(2);
      return {
        ProjectName: record.ProjectName, // keep consistent with your chart naming
        costSavings: totalCostSavedInDollars, // optional: cleaner output
      };
    });
    console.log(formatted);
    res.json(formatted);
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Database connection failed");
  }
});

export default costsavingsRouter;

import { Router } from "express";
import db from "../db.js";
const { pool, poolConnect } = db;
import { PROJECT_IDS } from "../config/env.js";
import { getProjectMetrics } from "../config/projectMetrics.js";
const costsavingsRouter = Router();
import { getDateFilter } from "../utils/dateFilter.js";
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
      const { timeSavedMinutes, avgWagePerMinuteInCents } =
        getProjectMetrics(record.ProjectID);
      costSavedInCents +=
        timeSavedMinutes * avgWagePerMinuteInCents;
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
      const { timeSavedMinutes, avgWagePerMinuteInCents } =
        getProjectMetrics(record.ProjectID);
      const totalCostSavedInCents =
        record.TotalRows * timeSavedMinutes * avgWagePerMinuteInCents;
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

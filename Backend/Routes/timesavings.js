import { Router } from "express";
import db from "../db.js";
const { pool, poolConnect } = db;
import { PROJECT_IDS } from "../config/env.js";
const timesavingsRouter = Router();

const projectIDString = PROJECT_IDS.join(",");

// Map that stores the time savings for each transaction for every proccess  [project id, time saved in minutes]
const projectTimeSavings = new Map([
  ["15", 5], // ZOR Phase 2
  ["29", 3], // PGI (Zor)
]);

timesavingsRouter.get("/total", async (req, res) => {
  try {
    await poolConnect; // ensures that the pool has been created
    const result = await pool.request().query(`
            SELECT *
            FROM [DS_ADHOC_BOPs].[rpa].[Master_Impact_Report]
            WHERE [ProjectID] IN (${projectIDString}) AND [Status] ='Pass'
            `);
    let timeSavedInMinutes = 0;
    let timeSavedInHours = 0;
    result.recordset.forEach((record) => {
      timeSavedInMinutes +=
        projectTimeSavings.get(record.ProjectID.toString()) || 0;
    });
    console.log("Total time saved in minutes:", timeSavedInMinutes);
    timeSavedInHours = (timeSavedInMinutes / 60);
    console.log("Total time saved in hours:", timeSavedInHours);
    res.json({ timeSaved: timeSavedInHours });
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Database query failed");
  }
});

export default timesavingsRouter;

import {Router} from 'express';
import db from '../db.js';
const {pool,poolConnect} = db;
import { PROJECT_IDS } from "../config/env.js";
const costsavingsRouter = Router();

// assuming 40 hour work weeks
const avgWagePerMinuteInCents = new Map([
    ["15",38], // $49K/yr Median on glassdoor
    ["29",50], // $63K/yr Median on glassdoor
    ["100",47] // In Hardware documentation

]);
// Map that stores the time savings for each transaction for every proccess  [project id, time saved in minutes]
const projectTimeSavings = new Map([
  ["15", 5], // ZOR Phase 2
  ["29", 3], // PGI (Zor)
]);
const projectIDString = PROJECT_IDS.join(",");

costsavingsRouter.get('/total', async (req, res) => {
    try{
        await poolConnect; // ensures that the pool has been created
        const result = await pool.request().query(`
                SELECT *
                FROM [DS_ADHOC_BOPs].[rpa].[Master_Impact_Report]
                WHERE [ProjectID] IN (${projectIDString}) AND [Status] ='Pass'
                `);
        let costSavedInCents = 0;
        let costSavedInDollars = 0;
        result.recordset.forEach((record) => {
        costSavedInCents += (projectTimeSavings.get(record.ProjectID) * avgWagePerMinuteInCents.get(record.ProjectID)) || 0;
        });

        console.log("Total cost saved in cents:", costSavedInCents);
        costSavedInDollars = (costSavedInCents / 100);
        console.log("Total cost saved in dollars:", costSavedInDollars);
        res.json({ costSaved: costSavedInDollars });

    } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Database query failed");
  }
});



export default costsavingsRouter;
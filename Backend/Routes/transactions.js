const express = require("express");
const router = express.Router();
const { pool, sql, poolConnect } = require("../db");

router.get("/", async (req, res) => {
  try {
    await poolConnect; // make sure pool is ready

    const result = await pool.request().query(`
      SELECT * 
      FROM [DS_ADHOC_BOPs].[rpa].[Master_Impact_Report] 
      WHERE [ProjectID] IN ('15','29');
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Database query failed");
  }
});

module.exports = router;

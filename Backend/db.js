// db.js
require('dotenv').config();
const sql = require('mssql/msnodesqlv8');

const port = process.env.SQL_SERVER_PORT || 1433;
const connStr =
  `Driver={ODBC Driver 18 for SQL Server};` +               // make sure this driver is installed
  `Server=${process.env.SQL_SERVER},${port};` +             // e.g. bidm.opentext.com,1433
  `Database=${process.env.SQL_DATABASE};` +                 // e.g. DS_ADHOC_BOPs
  `Trusted_Connection=Yes;` +                               // Windows Auth
  `Encrypt=Yes;TrustServerCertificate=Yes;`;                // common requirement for remote servers

const config = { connectionString: connStr, driver: 'msnodesqlv8' };
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect()
  .then(() => console.log("✅ Connected to SQL Server"))
  .catch(err => {
    console.error("❌ Database connection failed:", err?.message, err?.originalError || err);
    process.exit(1);
  });

module.exports = { sql, pool, poolConnect };

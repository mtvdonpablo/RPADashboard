// db.js
require("dotenv").config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });
const sql = require('mssql/msnodesqlv8');
const port = process.env.SQL_SERVER_PORT || 1433;
const connStr =
  `Driver={ODBC Driver 18 for SQL Server};` +              
  `Server=${process.env.SQL_SERVER},${port};` +             
  `Database=${process.env.SQL_DATABASE};` +                 
  `Trusted_Connection=Yes;` +                               
  `Encrypt=Yes;TrustServerCertificate=Yes;`;                

const config = { connectionString: connStr, driver: 'msnodesqlv8' };
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect()
  .then(() => console.log("✅ Connected to SQL Server"))
  .catch(err => {
    console.error("❌ Database connection failed:", err?.message, err?.originalError || err);
    process.exit(1);
  });

module.exports = { sql, pool, poolConnect };

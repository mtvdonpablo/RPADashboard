// Helper: returns a SQL snippet based on the range
export const getDateFilter = (range) => {
  // Check if range is a year (4 digits)
  if (/^\d{4}$/.test(range)) {
    return `
      AND YEAR(CAST(TransactionDate AS date)) = ${range}
    `;
  }

  switch (range) {
    case "30d":
      return `
        AND CAST(TransactionDate AS date) >= DATEADD(DAY, -30, CAST(GETDATE() AS date))
      `;

    case "90d":
      return `
        AND CAST(TransactionDate AS date) >= DATEADD(DAY, -90, CAST(GETDATE() AS date))
      `;

    case "ytd":
      return `
        AND CAST(TransactionDate AS date) >= DATEFROMPARTS(YEAR(GETDATE()), 1, 1)
      `;

    case "all":
    default:
      return ""; // no extra filter
  }
};


// Helper: returns a SQL snippet based on the range
export const getDateFilter = (range) => {
  const transactionDate =
    "TRY_CONVERT(date, CONVERT(varchar(8), TransactionDate), 112)";

  // Check if range is a year (4 digits)
  if (/^\d{4}$/.test(range)) {
    return `
      AND YEAR(${transactionDate}) = ${range}
    `;
  }

  switch (range) {
    case "this_month":
      return `
        AND YEAR(${transactionDate}) = YEAR(GETDATE())
        AND MONTH(${transactionDate}) = MONTH(GETDATE())
      `;

    case "last_month":
      return `
        AND YEAR(${transactionDate}) = YEAR(DATEADD(MONTH, -1, GETDATE()))
        AND MONTH(${transactionDate}) = MONTH(DATEADD(MONTH, -1, GETDATE()))
      `;

    case "ytd":
      return `
        AND ${transactionDate} >= DATEFROMPARTS(YEAR(GETDATE()), 1, 1)
      `;

    case "all":
    default:
      return ""; // no extra filter
  }
};


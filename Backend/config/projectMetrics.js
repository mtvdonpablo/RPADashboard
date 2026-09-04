// Business assumptions used to calculate savings.
// Add or update a project here so time and cost calculations stay in sync.
export const projectMetrics = new Map([
  ["15", { timeSavedMinutes: 5, avgWagePerMinuteInCents: 51 }], // ZOR Phase 2
  ["29", { timeSavedMinutes: 3, avgWagePerMinuteInCents: 50 }], // PGI (ZOR)
  ["24", { timeSavedMinutes: 0, avgWagePerMinuteInCents: 47 }], // Hardware documentation
  ["16", { timeSavedMinutes: 15, avgWagePerMinuteInCents: 51 }], // APA 2 SAP
  ["32", { timeSavedMinutes: 10, avgWagePerMinuteInCents: 0 }], // Mass upload; wage not configured
  ["34", { timeSavedMinutes: 15, avgWagePerMinuteInCents: 51 }], // OPC
  ["46", { timeSavedMinutes: 5, avgWagePerMinuteInCents: 51 }], // OPC phase 2
  ["18", { timeSavedMinutes: 15, avgWagePerMinuteInCents: 51 }], // Debit memo phase 1
]);

export const getProjectMetrics = (projectID) =>
  projectMetrics.get(projectID.toString()) ?? {
    timeSavedMinutes: 0,
    avgWagePerMinuteInCents: 0,
  };

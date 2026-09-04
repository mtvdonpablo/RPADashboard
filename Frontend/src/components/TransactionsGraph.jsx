import { Chart, useChart } from "@chakra-ui/charts";
import { Card, HStack, NativeSelect } from "@chakra-ui/react";
import axios from "axios";

import { useState, useEffect } from "react";
import { Bar, BarChart, XAxis, LabelList } from "recharts";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const TransactionsGraph = ({
  selectedYear,
  projectId,
  projects,
  years,
  onProjectChange,
  onYearChange,
}) => {
  const [monthlyTransactions, setMonthlyTransactions] = useState({
    data: [],
    series: [],
  });

  useEffect(() => {
    if (!selectedYear) return;
    const getMonthlyTransactions = async () => {
      const response = await axios.get("/api/projects/transactions-by-month", {
        params: { year: selectedYear, projectId },
      });
      const byMonth = new Map(response.data.data.map((row) => [row.month, row]));
      setMonthlyTransactions({
        series: response.data.series,
        data: MONTHS.map((month) => byMonth.get(month) ?? { month, "Successful Transactions": 0 }),
      });
    };
    getMonthlyTransactions();
  }, [selectedYear, projectId]);

  // const chart = useChart({
  //   data: [
  //     { "ZOR Phase 2": 186, "PGI (ZOR)": 80, "Hardware Renewal Phase 1": 120, month: "January", year: "2025" },
  //     { "ZOR Phase 2": 165, "PGI (ZOR)": 95, "Hardware Renewal Phase 1": 110, month: "February", year: "2025" },
  //     { "ZOR Phase 2": 190, "PGI (ZOR)": 87, "Hardware Renewal Phase 1": 125, month: "March", year: "2025" },
  //     { "ZOR Phase 2": 195, "PGI (ZOR)": 88, "Hardware Renewal Phase 1": 130, month: "May", year: "2025" },
  //     { "ZOR Phase 2": 182, "PGI (ZOR)": 98, "Hardware Renewal Phase 1": 122, month: "June", year: "2025" },
  //     { "ZOR Phase 2": 175, "PGI (ZOR)": 90, "Hardware Renewal Phase 1": 115, month: "August", year: "2025" },
  //     { "ZOR Phase 2": 180, "PGI (ZOR)": 86, "Hardware Renewal Phase 1": 124, month: "October", year: "2025" },
  //     { "ZOR Phase 2": 185, "PGI (ZOR)": 91, "Hardware Renewal Phase 1": 126, month: "November", year: "2025" },
  //   ],
  //   series: [
  //     { name: "ZOR Phase 2", color: "teal.solid" },
  //     { name: "PGI (ZOR)", color: "purple.solid" },
  //     { name: "Hardware Renewal Phase 1", color: "blue.solid" },
  //   ],
  // });
  const chart = useChart({
    data: monthlyTransactions.data,
    series: monthlyTransactions.series,
  });

  // const totals = chart.data.reduce(
  //   (acc, item) => ({
  //     "ZOR Phase 2": acc["ZOR Phase 2"] + item["ZOR Phase 2"],
  //     "PGI (ZOR)": acc["PGI (ZOR)"] + item["PGI (ZOR)"],
  //     "Hardware Renewal Phase 1": acc["Hardware Renewal Phase 1"] + item["Hardware Renewal Phase 1"],
  //   }),
  //   { "ZOR Phase 2": 0, "PGI (ZOR)": 0, "Hardware Renewal Phase 1": 0 }
  // );
  const totals = chart.data.reduce((acc, item) => {
    Object.keys(item).forEach((key) => {
      if (key === "month") return; // ignore month
      acc[key] = (acc[key] || 0) + item[key];
    });
    return acc;
  }, {});

  const series = chart.getSeries({ name: "Successful Transactions" });

  const formatNumber = chart.formatNumber({
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <Card.Root maxW="full">
      <Card.Header alignItems="flex-start">
        <Card.Title>Monthly Successful Transactions ({formatNumber(totals["Successful Transactions"] || 0)})</Card.Title>
        <HStack gap={3} mt={3} flexWrap="wrap">
          <NativeSelect.Root size="sm" width="260px">
            <NativeSelect.Field
              aria-label="Select project"
              value={projectId}
              bg="white"
              color="gray.900"
              css={{ "& option": { background: "white", color: "#111827" } }}
              onChange={(event) => onProjectChange(event.target.value)}
            >
              <option value="all">All projects</option>
              {projects.map((project) => (
                <option key={project.ProjectID} value={project.ProjectID}>
                  {project.ProjectName}
                </option>
              ))}
            </NativeSelect.Field>
          </NativeSelect.Root>
          <NativeSelect.Root size="sm" width="120px">
            <NativeSelect.Field
              aria-label="Select year"
              value={selectedYear}
              bg="white"
              color="gray.900"
              css={{ "& option": { background: "white", color: "#111827" } }}
              onChange={(event) => onYearChange(event.target.value)}
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </NativeSelect.Field>
          </NativeSelect.Root>
        </HStack>
      </Card.Header>
      <Card.Body>
        <Chart.Root height="10rem" chart={chart}>
          <BarChart data={chart.data} barSize={40}>
            <XAxis
              axisLine={false}
              tickLine={false}
              dataKey={chart.key("month")}
              tickFormatter={(value) => value.slice(0, 3)}
            />

            <Bar
              dataKey={chart.key("Successful Transactions")}
              fill={chart.color(series?.color)}
            >
              <LabelList
                dataKey={chart.key("Successful Transactions")}
                position="top"
                style={{ fontWeight: "600", fill: chart.color("fg") }}
              />
            </Bar>
          </BarChart>
        </Chart.Root>
      </Card.Body>
    </Card.Root>
  );
};

export default TransactionsGraph;

import { Chart, useChart } from "@chakra-ui/charts";
import { Card, HStack, Box, Text } from "@chakra-ui/react";
import axios from "axios";

import { useState, useEffect } from "react";
import { Bar, BarChart, XAxis, LabelList } from "recharts";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const FailedTransactionsGraph = ({ selectedYear, projectId }) => {
  const [monthlyTransactions, setMonthlyTransactions] = useState({
    data: [],
    series: [],
  });

  useEffect(() => {
    if (!selectedYear) return;
    const getMonthlyTransactions = async () => {
      const response = await axios.get("/api/projects/failed-transactions-by-month", {
        params: { year: selectedYear, projectId },
      });
      const byMonth = new Map(response.data.data.map((row) => [row.month, row]));
      setMonthlyTransactions({
        series: response.data.series,
        data: MONTHS.map((month) => ({
          month,
          "Business Exception": 0,
          "System Exception": 0,
          ...(byMonth.get(month) ?? {}),
        })),
      });
    };
    getMonthlyTransactions();
  }, [selectedYear, projectId]);

  const chart = useChart({
    data: monthlyTransactions.data,
    series: monthlyTransactions.series,
  });

  const totals = chart.data.reduce((acc, item) => {
    Object.keys(item).forEach((key) => {
      if (key === "month") return;
      acc[key] = (acc[key] || 0) + item[key];
    });
    return acc;
  }, {});

  const formatNumber = chart.formatNumber({
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <Card.Root maxW="full">
      <Card.Header alignItems="flex-start">
        <Card.Title display="flex" justifyContent="space-between" alignItems="center" width="100%">
          Monthly Exceptions
        </Card.Title>
        <HStack gap={4} mt={2}>
          {chart.series.map((s) => (
            <HStack key={s.name} gap={1}>
              <Box w={3} h={3} borderRadius="sm" bg={chart.color(s.color)} />
              <Text fontSize="xs">
                {s.name} ({formatNumber(totals[s.name] || 0)})
              </Text>
            </HStack>
          ))}
        </HStack>
      </Card.Header>
      <Card.Body>
        <Chart.Root height="10rem" chart={chart}>
          <BarChart data={chart.data} barSize={20}>
            <XAxis
              axisLine={false}
              tickLine={false}
              dataKey={chart.key("month")}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            {chart.series.map((s) => (
              <Bar
                key={s.name}
                dataKey={chart.key(s.name)}
                fill={chart.color(s.color)}
              >
                <LabelList
                  dataKey={chart.key(s.name)}
                  position="top"
                  style={{ fontWeight: "600", fill: chart.color("fg") }}
                />
              </Bar>
            ))}
          </BarChart>
        </Chart.Root>
      </Card.Body>
    </Card.Root>
  );
};

export default FailedTransactionsGraph;

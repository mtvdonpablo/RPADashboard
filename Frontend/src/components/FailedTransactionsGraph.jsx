import { Chart, useChart } from "@chakra-ui/charts";
import { Card, NativeSelect, HStack, Box, Text } from "@chakra-ui/react";
import axios from "axios";

import { useState, useEffect } from "react";
import { Bar, BarChart, XAxis, Legend } from "recharts";

const FailedTransactionsGraph = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [monthlyTransactions, setMonthlyTransactions] = useState({
    data: [],
    series: [],
  });

  useEffect(() => {
    const getAvailableYears = async () => {
      const response = await axios.get("/api/projects/failed-transactions-years");
      setAvailableYears(response.data.years);
    };
    getAvailableYears();
  }, []);

  useEffect(() => {
    const getMonthlyTransactions = async () => {
      const response = await axios.get(`/api/projects/failed-transactions-by-month?year=${selectedYear}`);
      setMonthlyTransactions(response.data);
    };
    getMonthlyTransactions();
  }, [selectedYear]);

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
          Monthly Failed Transactions
          <NativeSelect.Root size="sm" width="auto">
            <NativeSelect.Field
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              paddingRight={2}
              paddingLeft={2}
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </NativeSelect.Field>
          </NativeSelect.Root>
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
              />
            ))}
          </BarChart>
        </Chart.Root>
      </Card.Body>
    </Card.Root>
  );
};

export default FailedTransactionsGraph;

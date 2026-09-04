import { Box, GridItem, SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import FailedTransactionsGraph from "./FailedTransactionsGraph";
import SuccessRates from "./SuccessRates";
import TransactionsGraph from "./TransactionsGraph";

function AutomationPerformance() {
  const [projects, setProjects] = useState([]);
  const [years, setYears] = useState([]);
  const [chartProjectId, setChartProjectId] = useState("all");
  const [rateProjectId, setRateProjectId] = useState("all");
  const [selectedYear, setSelectedYear] = useState("");
  const [successRates, setSuccessRates] = useState([]);

  useEffect(() => {
    Promise.all([
      axios.get("/api/projects/names"),
      axios.get("/api/projects/transactions-years"),
      axios.get("/api/projects/failed-transactions-years"),
    ]).then(([projectResponse, successYears, failureYears]) => {
      setProjects(projectResponse.data);
      if (projectResponse.data.length > 0) {
        setChartProjectId(String(projectResponse.data[0].ProjectID));
      }
      const availableYears = [...new Set([
        ...successYears.data.years,
        ...failureYears.data.years,
      ])].filter(Boolean).sort((a, b) => b - a);
      setYears(availableYears);
      setSelectedYear(String(availableYears[0] ?? new Date().getFullYear()));
    }).catch((error) => console.error("Performance filters fetch error:", error));
  }, []);

  useEffect(() => {
    axios.get("/api/projects/successrates", {
      params: { range: "all", projectId: rateProjectId },
    }).then((response) => setSuccessRates(response.data))
      .catch((error) => console.error("Technical success rates fetch error:", error));
  }, [rateProjectId]);

  return (
    <Box w="full">
      <Text fontSize="2xl" fontWeight="bold" color="white" textAlign="center">
        Automation Performance
      </Text>
      <Text color="whiteAlpha.800" fontSize="sm" textAlign="center" mb={4}>
        Technical success rate excludes business exceptions.
      </Text>
      <SimpleGrid columns={1} gap={4} mt={4}>
        <GridItem>
          <SuccessRates
            items={successRates}
            projects={projects}
            selectedProjectId={rateProjectId}
            onProjectChange={setRateProjectId}
          />
        </GridItem>
        <GridItem>
          <TransactionsGraph
            selectedYear={selectedYear}
            projectId={chartProjectId}
            projects={projects}
            years={years}
            onProjectChange={setChartProjectId}
            onYearChange={setSelectedYear}
          />
        </GridItem>
        <GridItem><FailedTransactionsGraph selectedYear={selectedYear} projectId={chartProjectId} /></GridItem>
      </SimpleGrid>
    </Box>
  );
}

export default AutomationPerformance;

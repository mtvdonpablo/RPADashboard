import { SimpleGrid, GridItem, Box } from "@chakra-ui/react";
import KPICard from "./components/KPICard";
import ProjectErrorsTable from "./components/ProjectErrorsTable";
import TimeSavingsDetails from "./components/TimeSavingsDetails";
import ProcessesAutomatedDetails from "./components/ProcessesAutomatedDetails";
import AutomationPerformance from "./components/AutomationPerformance";
import TimeSavingsLeaderboard from "./components/TimeSavingsLeaderboard";
import ScheduleModal from "./components/ScheduleModal";
import {
  ChartBarIcon,
  CheckCircleIcon,
  GaugeIcon,
  TreeStructureIcon,
  HourglassIcon,
  UserIcon,
} from "@phosphor-icons/react";
import axios from "axios";
// import data from './data/db.json';
import { useEffect, useState } from "react";

//Display the dashboard with KPI cards
function Dashboard({ dateRange }) {
  const [numProcesses, setNumProcesses] = useState(0);
  const [transactionSummary, setTransactionSummary] = useState({
    transactionsProcessed: 0,
    successful: 0,
    successRate: 0,
  });
  const [timeSavedInHours, setTimeSavedInHours] = useState(0);
  const [costSavedInDollars, setCostSavedInDollars] = useState(0);
  const [timeSavingByProject, setTimeSavingsByProject] = useState([]);
  const [projectNames, setProjectNames] = useState([]);
  const [fteSaved, setFTESaved] = useState(0);

  useEffect(() => {
    // use effect cant be async. useEffect returns either nothing or a cleanup function. Axios.get returns a promise
    const getNumProcessesAutomated = async () => {
      const response = await axios.get("/api/projects/count");
      setNumProcesses(response.data.count);
    };
    const getTimeSaved = async () => {
      const response = await axios.get("/api/timesavings/total", {
        params: { range: dateRange },
      });
      setTimeSavedInHours(response.data.timeSaved);
      setFTESaved(response.data.fteSaved);
    };
    const getCostsSaved = async () => {
      const response = await axios.get("/api/costsavings/total", {
        params: { range: dateRange },
      });
      setCostSavedInDollars(response.data.costSaved);
    };
    const getTimeSavingsByProject = async () => {
      const response = await axios.get("/api/timesavings/breakdown", {
        params: { range: dateRange },
      });
      setTimeSavingsByProject(response.data);
    };
    const getTransactionSummary = async () => {
      const response = await axios.get("/api/projects/transaction-summary", {
        params: { range: dateRange },
      });
      setTransactionSummary(response.data);
    };
    const getProjectNames = async () => {
      const response = await axios.get("/api/projects/names");
      setProjectNames(response.data);
    };
    getNumProcessesAutomated();
    getTransactionSummary();
    getTimeSaved();
    getCostsSaved();
    getTimeSavingsByProject();
    getProjectNames();
  }, [dateRange]);
  return (
    <Box w="full" maxW="1600px" mx="auto" px={{ base: 3, md: 6, xl: 8 }}>
      <Box display="flex" justifyContent="flex-end" mb={4}>
        <ScheduleModal />
      </Box>
      {/* KPI cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
        <KPICard
          title="Processes Automated"
          icon={TreeStructureIcon}
          value={numProcesses}
          action={<ProcessesAutomatedDetails items={projectNames} />}
        />
        <KPICard
          title="Transactions Processed"
          icon={ChartBarIcon}
          value={transactionSummary.transactionsProcessed}
        />
        <KPICard
          title="Successful Transactions"
          icon={CheckCircleIcon}
          value={transactionSummary.successful}
        />
        <KPICard
          title="Hours Saved"
          icon={HourglassIcon}
          value={timeSavedInHours}
          units="hours"
          action={
            <TimeSavingsDetails
              items={timeSavingByProject}
              estimatedCostSavings={costSavedInDollars}
            />
          }
        />
        <KPICard
          title="FTE Capacity"
          icon={UserIcon}
          value={fteSaved}
        />
        <KPICard
          title="Success Rate"
          icon={GaugeIcon}
          value={transactionSummary.successRate}
          units="percent"
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4} mt={4}>
        <GridItem colSpan={{ base: 1, md: 2, lg: 4 }}>
          <TimeSavingsLeaderboard dateRange={dateRange} />
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 2, lg: 4 }}>
          <AutomationPerformance />
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 2, lg: 4 }}>
          <ProjectErrorsTable dateRange={dateRange} />
        </GridItem>
      </SimpleGrid>
    </Box>
  );
}
export default Dashboard;

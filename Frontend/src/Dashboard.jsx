import { SimpleGrid, GridItem } from "@chakra-ui/react";
import KPICard from "./components/KPICard";
import TransactionsGraph from "./components/TransactionsGraph";
import TimeSavingsDetails from "./components/TimeSavingsDetails";
import ProcessesAutomatedDetails from "./components/ProcessesAutomatedDetails";
import CostSavingsDetails from "./components/CostSavingsDetails";
import SuccessRates from "./components/SuccessRates";
import {
  TreeStructureIcon,
  HourglassIcon,
  CoinsIcon,
  UserIcon,
} from "@phosphor-icons/react";
import axios from "axios";
// import data from './data/db.json';
import { useEffect, useState } from "react";

//Display the dashboard with KPI cards
function Dashboard({ dateRange }) {
  const [numProcesses, setnumProcesses] = useState(0);
  const [timeSavedInHours, setTimeSavedInHours] = useState(0);
  const [costSavedInDollars, setCostSavedInDollars] = useState(0);
  const [timeSavingByProject, setTimeSavingsByProject] = useState([]);
  const [projectNames, setProjectNames] = useState([]);
  const [costSavingsByProject, setCostSavingsByProject] = useState([]);
  const [successRates, setSuccessRates] = useState([]);
  const [fteSaved, setFTESaved] = useState(0);

  useEffect(() => {
    // use effect cant be async. useEffect returns either nothing or a cleanup function. Axios.get returns a promise
    const getNumProcessAutomated = async () => {
      const response = await axios.get("/api/projects/count");
      setnumProcesses(response.data.count);
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
    const getProjectNames = async () => {
      const response = await axios.get("/api/projects/names");
      setProjectNames(response.data);
    };
    const getCostSavingsByProject = async () => {
      const response = await axios.get("/api/costsavings/breakdown", {
        params: { range: dateRange },
      });
      setCostSavingsByProject(response.data);
    };
    const getSuccessRates = async () => {
      const response = await axios.get("/api/projects/successrates", {
        params: { range: dateRange },
      });
      setSuccessRates(response.data);
    };
    getNumProcessAutomated();
    getTimeSaved();
    getCostsSaved();
    getTimeSavingsByProject();
    getProjectNames();
    getCostSavingsByProject();
    getSuccessRates();
  }, [dateRange]);
  return (
    <>
      {/* KPI cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
        <KPICard
          title="Processes Automated"
          icon={TreeStructureIcon}
          value={numProcesses}
          action={<ProcessesAutomatedDetails items={projectNames} />}
        />
        <KPICard
          title="Hours Saved"
          icon={HourglassIcon}
          value={timeSavedInHours}
          units="hours"
          action={<TimeSavingsDetails items={timeSavingByProject} />}
        />
        <KPICard
          title="Cost Savings"
          icon={CoinsIcon}
          value={costSavedInDollars}
          units="dollars"
          action={<CostSavingsDetails items={costSavingsByProject} />}
        />
        <KPICard title="FTE Saved" icon={UserIcon} value={fteSaved} />
        <GridItem colSpan={{ base: 1, md: 2, lg: 2 }}>
          <TransactionsGraph />
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 2, lg: 4 }}>
          <SuccessRates items={successRates} />
        </GridItem>
      </SimpleGrid>
    </>
  );
}
export default Dashboard;

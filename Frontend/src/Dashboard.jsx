import { SimpleGrid } from "@chakra-ui/react";
import KPICard from "./components/KPICard";
import {
  TreeStructureIcon,
  HourglassIcon,
  CoinsIcon,
} from "@phosphor-icons/react";
import axios from "axios";
// import data from './data/db.json';
import { useEffect, useState } from "react";

//Display the dashboard with KPI cards
function Dashboard() {
  const [numProcesses, setnumProcesses] = useState(0);
  const [timeSavedInHours, setTimeSavedInHours] = useState(0);
  const [costSavedInDollars, setCostSavedInDollars] = useState(0);
  useEffect(() => {
    const getNumProcessAutomated = async () => {
      const response = await axios.get("/api/projects/count");
      setnumProcesses(response.data.count);
    };
    const getTimeSaved = async () => {
      const response = await axios.get("/api/timesavings/total");
      console.log(response.data);
      setTimeSavedInHours(response.data.timeSaved);
    };
    const getCostsSaved = async () => {
      const response = await axios.get("/api/costsavings/total");
      console.log(response.data);
      setCostSavedInDollars(response.data.costSaved);
    };
    getNumProcessAutomated();
    getTimeSaved();
    getCostsSaved();
  }, []);
  return (
    <>
      {/* KPI cards */}
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3 }}
        gap={4}
      >
        <KPICard
          title="Processes Automated"
          icon={TreeStructureIcon}
          value={numProcesses}
        />
        <KPICard
          title="Hours Saved"
          icon={HourglassIcon}
          value={timeSavedInHours}
          units="hours"
        />
        <KPICard
          title="Cost Savings"
          icon={CoinsIcon}
          value={costSavedInDollars}
          units="dollars"
        />
      </SimpleGrid>
    </>
  );
}
export default Dashboard;

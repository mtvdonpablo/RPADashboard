
import {SimpleGrid } from "@chakra-ui/react";
import KPICard from "./components/KPICard";
import { TreeStructureIcon,HourglassIcon,CoinsIcon  } from "@phosphor-icons/react";
import data from './data/db.json';

// Object that stores the time savings for each transaction for every proccess as a key value pair. <project id, time saved in minutes>
const minutesSaved = {
    15:5,
    29:3
}
function getTotalTimeSaved(){
    const arrayOfMinutes =  data.map((transaction)=> minutesSaved[transaction.ProjectID]); 
    let sumMinutes = 0
    arrayOfMinutes.forEach((item) => {sumMinutes += item});
    let sumHours = sumMinutes / 60;
    return sumHours;

}

// 8 items
// 3 PGI transactions
// 5 Phase 2
// 2 process automated 
// Total times savings 34 min = 0.57 hours

//Display the dashboard with KPI cards
function Dashboard(){
    const numProcess =new Set(data.map(transaction => transaction.ProjectID)).size; // Number of unique project Ids in data tells us number of processes automated
    const hoursSaved = getTotalTimeSaved();
    return (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
            <KPICard 
                title='Processes Automated'
                icon={TreeStructureIcon}
                value={numProcess}
            />
            <KPICard 
                title='Hours Saved'
                icon={HourglassIcon}
                value={hoursSaved}
                units='hours'
            />
            <KPICard 
                title='Cost Savings'
                icon={CoinsIcon}
                value={4000}
                units='dollars'
            />
                
        </SimpleGrid>
    );
}
export default Dashboard
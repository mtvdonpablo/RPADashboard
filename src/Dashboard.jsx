
import {SimpleGrid } from "@chakra-ui/react";
import KPICard from "./components/KPICard";
import { TreeStructureIcon,HourglassIcon,CoinsIcon  } from "@phosphor-icons/react";
import data from './data/db.json';




//Display the dashboard with KPI cards
function Dashboard(){
    const numProcess =new Set(data.map(item => item.ProjectID)).size; // Number of unique project Ids in data tells us number of processes automated
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
                value={360}
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

import {SimpleGrid } from "@chakra-ui/react";
import KPICard from "./components/KPICard";
import { TreeStructureIcon,HourglassIcon,CoinsIcon  } from "@phosphor-icons/react";
// import data from './data/db.json';
import {useEffect,useState } from "react";

// Map that stores the time savings for each transaction for every proccess  [project id, time saved in minutes]
const projectTimeSavings = new Map([
    ["15",5], // ZOR Phase 2
    ["29",3] // PGI (Zor)
]);
// assuming 40 hour work weeks
const avgHourlyWageInCents = new Map([
    ["15",2300], // $49K/yr Median on glassdoor
    ["29",3000], // $63K/yr Median on glassdoor
    ["100",2800] // In Hardware documentation
]);








// 8 items
// 3 PGI transactions
// 6 Phase 2
// 2 process automated 
// Total times savings 34 min = 0.65 hours
// ID 15 6 transaction 5 min each 30min $11.50
// ID 29 3 transactions 3 min each 9 min $4.5
// Total cost savings $16.00

//Display the dashboard with KPI cards
function Dashboard(){
    const [transactionData, setTransactionData] = useState([]);

    const getData = async() =>{
        try{
            const response = await fetch("http://localhost:3001/");
            const jsonData = await response.json();
            setTransactionData(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    }
    useEffect(()=> {
        getData();
    }, []);
    let costSavings = 0;
    let hoursSaved = 0;

    // calculate savings by passing through the data only once for efficency
    function calcSavings(){
        let minutesSaved = 0;
        let centsSaved = 0;
        transactionData.forEach((transaction)=>{  
            if(transaction.Status ==='Pass'){
                minutesSaved += projectTimeSavings.get(transaction.ProjectID);
                centsSaved +=  (projectTimeSavings.get(transaction.ProjectID) * (avgHourlyWageInCents.get(transaction.ProjectID) / 60 ));
            } 

        })
        costSavings = centsSaved / 100;
        hoursSaved = minutesSaved / 60;
    }




    const numProcess =new Set(transactionData.map(transaction => transaction.ProjectID)).size; // Number of unique project Ids in data tells us number of processes automated

    calcSavings();
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
                value={costSavings}
                units='dollars'
            />
                
        </SimpleGrid>
    );
}
export default Dashboard
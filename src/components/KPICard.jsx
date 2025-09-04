import { Card,Heading,Icon,Stack } from "@chakra-ui/react"


function fomratValue(value,units){
    const cad = new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
        maximumFractionDigits: 0,
    });
    let display='';
    if(units ==='dollars'){
        display = cad.format(Number(value))
    } else if (units ==='hours'){
        display = value.toFixed(2);
    } else {
        display = value;
    }
    return display;
}

function KPICard({title,icon:IconComp,value,units}){
    return(
        <Card.Root bg='gray.800' border='none' w='250px' h='130px'>
            <Card.Header >
                <Stack direction="row" justify='center'>
                    <Heading size='md' color='white'>{title}</Heading>
                    <Icon as={IconComp} aria-hidden  boxSize={6} color="white"/>
                </Stack>
                
            </Card.Header>
            <Card.Body p={0} alignItems='center'>
                <Heading size='5xl' color='white'>{fomratValue(value,units)}</Heading>
                
            </Card.Body>
            <Card.Footer />
        </Card.Root>
    );
}

export default KPICard
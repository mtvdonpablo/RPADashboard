import { Card,Heading,Icon,Stack } from "@chakra-ui/react"

function KPICard({title,icon:IconComp,value,units}){
    const cad = new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
        maximumFractionDigits: 0,
    });
    return(
        <Card.Root bg='gray.800' border='none' w='250px' h='130px'>
            <Card.Header >
                <Stack direction="row" justify='center'>
                    <Heading size='md' color='white'>{title}</Heading>
                    <Icon as={IconComp} aria-hidden  boxSize={6} color="white"/>
                </Stack>
                
            </Card.Header>
            <Card.Body p={0} alignItems='center'>
                <Heading size='5xl' color='white'>{ units==='dollars' ? cad.format(Number(value)): value}</Heading>
                
            </Card.Body>
            <Card.Footer />
        </Card.Root>
    );
}

export default KPICard
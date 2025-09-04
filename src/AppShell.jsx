import { Grid,GridItem } from "@chakra-ui/react";


//app’s persistent layout frame

function AppShell({children}){
    return(
        <Grid 
        bg="gray.700"
        templateRows="auto 1fr auto"
        minH="100dvh"  // fills the full dynamic viewport height
        w="100%"
        
        >
            <GridItem bg='red.700'>
                <p>Title</p>
            </GridItem>
            <GridItem bg='rgb(23,0,135)'>
                {children}
            </GridItem>
            <GridItem
                
                bg='orange.500'
            >
                <p>Footer</p>
            </GridItem>
        </Grid>

    );

}

export default AppShell
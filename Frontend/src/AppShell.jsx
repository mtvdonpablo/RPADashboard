import { Grid,GridItem, Heading,Stack,Icon,Link,HStack } from "@chakra-ui/react";
//app’s persistent layout frame
import {GithubLogoIcon, LinkedinLogoIcon  } from "@phosphor-icons/react";

function AppShell({children}){
    const socialLinks = [
    { href: 'https://github.com/mtvdonpablo', icon: <GithubLogoIcon  /> },
    { href: 'https://www.linkedin.com/in/don-joseph-0423b01b8/', icon: <LinkedinLogoIcon /> },
    ]
    return(
        <Grid 
        bg='rgb(23,0,135)'
        templateRows="auto 1fr auto"
        minH="100dvh"  // fills the full dynamic viewport height
        w="100%"
        
        >
            <GridItem my={5}>
                <Heading size="5xl" textAlign="center">RPA Dashboard</Heading>
            </GridItem>
            <GridItem 
                bg='rgb(23,0,135)'
                display="grid"
                placeItems="start center"
                my={50}
            >
                {children}
            </GridItem>
            <GridItem>
                <Stack align="center">
                    <Heading size="md">Website designed and developed by Don Joseph</Heading>
                    <HStack gap="2" px={3}>
                    {socialLinks.map(({ href, icon }, index) => (
                        <Link key={index} href={href} color='#FFFFFF'>
                            <Icon size="xl">{icon}</Icon>
                        </Link>
                    ))}
                    </HStack>
                </Stack>

            </GridItem>
        </Grid>

    );

}

export default AppShell
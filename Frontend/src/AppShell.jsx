import {
  Grid,
  GridItem,
  Heading,
  Stack,
  Icon,
  Link,
  HStack,
  Select,
  createListCollection,
  Box,
} from "@chakra-ui/react";
//app’s persistent layout frame
import { GithubLogoIcon, LinkedinLogoIcon } from "@phosphor-icons/react";
import Ticker from "./components/Ticker";

function AppShell({ children, dateRange, setDateRange }) {
  const socialLinks = [
    { href: "https://github.com/mtvdonpablo", icon: <GithubLogoIcon /> },
    {
      href: "https://www.linkedin.com/in/don-joseph-0423b01b8/",
      icon: <LinkedinLogoIcon />,
    },
  ];
  const ranges = createListCollection({
    items: [
      { label: "All Time", value: "all" },
      { label: "YTD", value: "ytd" },
      { label: "Last 90 Days", value: "90d" },
      { label: "Last 30 Days", value: "30d" },
    ],
  });

  return (
    <Grid
      bg="rgb(23,0,135)"
      templateRows="auto 1fr auto"
      minH="100dvh" // fills the full dynamic viewport height
      w="100%"
    >
      <GridItem my={5}>
        <Box
          display="grid"
          gridTemplateColumns="1fr auto 1fr"
          alignItems="center"
        >
          <Box alignItems="center" bg="gray"></Box>
          <Box>
            <Heading size="5xl" textAlign="center">
              RPA Dashboard
            </Heading>
          </Box>
          <Box display="flex" justifyContent="flex-end" mr="15px">
            <Select.Root
              collection={ranges}
              size="sm"
              minW="90px"
              maxW="120px"
              value={dateRange ? [dateRange] : []}
              onValueChange={(details) => {
                const next = details.value[0]; // "all" | "ytd" | "90d" | "30d"
                setDateRange(next);
              }}
            >
              <Select.Label />
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Date Range" color="white" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Select.Positioner>
                <Select.Content bg="gray">
                  {ranges.items.map((range) => (
                    <Select.Item item={range} key={range.value}>
                      {range.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
          </Box>
        </Box>
      </GridItem>

      <GridItem
        bg="rgb(23,0,135)"
        display="grid"
        placeItems="start center"
        mb={3}
      >
        {children}
      </GridItem>
      <GridItem>
        <Stack align="center">
          <Ticker />
          <Heading size="md">
            Website designed and developed by Don Joseph
          </Heading>
          <HStack gap="2" px={3}>
            {socialLinks.map(({ href, icon }, index) => (
              <Link key={index} href={href} color="#FFFFFF">
                <Icon size="xl">{icon}</Icon>
              </Link>
            ))}
          </HStack>
        </Stack>
      </GridItem>
    </Grid>
  );
}

export default AppShell;

import {
  Text,
  HStack,
  Box,
  Badge,
  AbsoluteCenter,
  ProgressCircle,
  SimpleGrid,
  NativeSelect,
} from "@chakra-ui/react";

function SuccessRates({
  items = [],
  projects = [],
  selectedProjectId = "all",
  onProjectChange,
}) {
  const getColor = (rate) => {
    if (rate >= 97) return "green";
    if (rate >= 90) return "yellow";
    return "red";
  };

  return (
    <>
      <Box w="full" py={4}>
        <NativeSelect.Root size="sm" width="260px" mx="auto" mb={4}>
          <NativeSelect.Field
            aria-label="Filter all-time success rate by project"
            value={selectedProjectId}
            bg="white"
            color="gray.900"
            css={{ "& option": { background: "white", color: "#111827" } }}
            onChange={(event) => onProjectChange(event.target.value)}
          >
            <option value="all">All projects</option>
            {projects.map((project) => (
              <option key={project.ProjectID} value={project.ProjectID}>
                {project.ProjectName}
              </option>
            ))}
          </NativeSelect.Field>
        </NativeSelect.Root>
        <SimpleGrid
          columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}
          gap={4}
          w="full"
          maxW="1200px"
          mx="auto"
        >
          {items.map(({ ProjectName, successRate, successCount, failCount, businessExceptionCount }) => (
            <Box
              key={ProjectName}
              bg="gray.800"
              borderRadius="xl"
              borderWidth="1px"
              borderColor="whiteAlpha.200"
              p={4}
              minH="240px"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="space-between"
            >
              <Text
                color="white"
                fontWeight="semibold"
                textAlign="center"
                minH="48px"
              >
                {ProjectName}
              </Text>
              <ProgressCircle.Root
                size="xl"
                value={Number(successRate)}
                colorPalette={getColor(successRate)}
                aria-label={`${ProjectName} technical success rate`}
              >
                <ProgressCircle.Circle>
                  <ProgressCircle.Track />
                  <ProgressCircle.Range strokeLinecap="round" />
                </ProgressCircle.Circle>
                <AbsoluteCenter>
                  <Text
                    color="white"
                    fontWeight="bold"
                    fontSize="sm"
                    lineHeight="1"
                    whiteSpace="nowrap"
                  >
                    {Math.round(Number(successRate))}%
                  </Text>
                </AbsoluteCenter>
              </ProgressCircle.Root>
              <HStack mt={3} gap={2} flexWrap="wrap" justify="center">
                <Badge colorPalette="green">Successful: {Number(successCount).toLocaleString()}</Badge>
                <Badge colorPalette="red">SE: {Number(failCount).toLocaleString()}</Badge>
                <Badge colorPalette="orange">BE: {Number(businessExceptionCount).toLocaleString()}</Badge>
              </HStack>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </>
  );
}

export default SuccessRates;

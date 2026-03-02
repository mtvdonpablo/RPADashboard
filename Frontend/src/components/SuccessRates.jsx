import {
  Text,
  HStack,
  VStack,
  Box,
  ProgressCircle,
  AbsoluteCenter,
} from "@chakra-ui/react";
function SuccessRates({ items = [] }) {
  const getColor = (rate) => {
    if (rate >= 97) return "green";
    if (rate >= 90) return "yellow";
    return "red";
  };

  return (
    <>
      <Box w="full" py={4}>
        <Text
          fontSize="xl"
          fontWeight="bold"
          textAlign="center"
          mb={4}
          color="white"
        >
          Success Rate
        </Text>
        <HStack
          w="full"
          justify="center"
          align="start"
          gap={{ base: 6, md: 12 }}
          flexDir={{ base: "column", md: "row" }}
        >
          {items.map(({ ProjectName, successRate }) => (
            <VStack
              key={ProjectName}
              spacing={2}
              w={{ base: "120px", md: "140px" }}
            >
              <ProgressCircle.Root
                size="xl"
                key={ProjectName}
                value={successRate}
                colorPalette={getColor(successRate)}
              >
                <ProgressCircle.Circle>
                  <ProgressCircle.Track />
                  <ProgressCircle.Range strokeLinecap="round" />
                </ProgressCircle.Circle>

                <AbsoluteCenter>
                  <ProgressCircle.ValueText />
                </AbsoluteCenter>
              </ProgressCircle.Root>
              <Text
                fontSize="md"
                fontWeight="medium"
                textAlign="center"
                whiteSpace="normal"
                wordBreak="break-word"
                lineHeight="short"
              >
                {ProjectName}
              </Text>
            </VStack>
          ))}
        </HStack>
      </Box>
    </>
  );
}

export default SuccessRates;

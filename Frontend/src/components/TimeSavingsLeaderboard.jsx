import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

function TimeSavingsLeaderboard({ dateRange }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get("/api/timesavings/breakdown", {
        params: { range: dateRange ?? "all" },
      })
      .then((res) => {
        const sorted = [...res.data].sort((a, b) => b.hours - a.hours);
        setItems(sorted);
      })
      .catch((err) => console.error("Leaderboard fetch error:", err));
  }, [dateRange]);

  const maxHours = items[0]?.hours || 1;
  const podium = [
    { item: items[1], rank: 2, height: "145px", color: "#C0C0C0" },
    { item: items[0], rank: 1, height: "190px", color: "#FFD700" },
    { item: items[2], rank: 3, height: "120px", color: "#CD7F32" },
  ].filter(({ item }) => item);

  return (
    <Box w="full" py={4}>
      <Text
        fontSize="xl"
        fontWeight="bold"
        textAlign="center"
        mb={6}
        color="white"
      >
        Time Savings Leaderboard
      </Text>
      <HStack
        align="end"
        justify="center"
        gap={{ base: 2, md: 4 }}
        maxW="760px"
        mx="auto"
        mb={6}
      >
        {podium.map(({ item, rank, height, color }) => (
          <VStack key={item.ProjectName} gap={2} flex="1" maxW="220px">
            <Text
              color="white"
              fontWeight="semibold"
              textAlign="center"
              lineHeight="short"
              minH="40px"
            >
              {item.ProjectName}
            </Text>
            <Text color="white" fontWeight="bold">
              {item.hours.toFixed(1)} hrs
            </Text>
            <Box
              bg={color}
              color="gray.900"
              h={height}
              w="full"
              borderTopRadius="lg"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="flex-start"
              pt={4}
              boxShadow="lg"
            >
              <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight="black">
                {rank}
              </Text>
              <Text fontSize="xs" fontWeight="bold" textTransform="uppercase">
                {rank === 1 ? "First" : rank === 2 ? "Second" : "Third"}
              </Text>
            </Box>
          </VStack>
        ))}
      </HStack>

      <VStack gap={3} align="stretch" maxW="600px" mx="auto">
        {items.slice(3).map(({ ProjectName, hours }, index) => {
          const pct = Math.round((hours / maxHours) * 100);
          const rank = index + 4;

          return (
            <Box
              key={ProjectName}
              bg="gray.800"
              rounded="lg"
              px={4}
              py={3}
            >
              <HStack justify="space-between" mb={2}>
                <HStack gap={2}>
                  <Text fontSize="lg" lineHeight="1">
                    #{rank}
                  </Text>
                  <Text color="white" fontWeight="semibold">
                    {ProjectName}
                  </Text>
                </HStack>
                <Text color="white" fontWeight="bold" whiteSpace="nowrap">
                  {hours.toFixed(1)} hrs
                </Text>
              </HStack>
              <Box bg="gray.600" rounded="full" h="8px" overflow="hidden">
                <Box
                  bg="#4A90E2"
                  h="full"
                  w={`${pct}%`}
                  rounded="full"
                  transition="width 0.6s ease"
                />
              </Box>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}

export default TimeSavingsLeaderboard;

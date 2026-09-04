import { RocketLaunchIcon } from "@phosphor-icons/react";
import { Box, Text, Separator, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

function Ticker() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const getTransactionSummary = async () => {
      try {
        const response = await axios.get("/api/projects/transaction-summary");
        setSummary(response.data);
      } catch (error) {
        console.error("Transaction summary fetch error:", error);
      }
    };

    getTransactionSummary();
  }, []);

  if (!summary) return null;

  const items = [
    ["Transactions Processed", summary.transactionsProcessed.toLocaleString()],
    ["Successful", summary.successful.toLocaleString()],
    ["Exceptions", summary.exceptions.toLocaleString()],
    ["Success Rate", `${summary.successRate.toFixed(1)}%`],
  ];

  return (
    <Box
      bg="#3BAFDA"
      w="fit-content"
      maxW="calc(100vw - 2rem)"
      display="flex"
      alignItems="center"
      flexWrap="wrap"
      justifyContent="center"
      gap={3}
      borderRadius="xl"
      px={4}
      py={2}
    >
      <HStack>
        <RocketLaunchIcon color="black" size={24} />
      </HStack>

      <HStack gap={3} flexWrap="wrap" justify="center">
        {items.map(([label, value], index) => (
          <HStack key={label} gap={3}>
            <Text fontWeight="semibold" fontSize="md" color="black">
              {label}: {value}
            </Text>
            {index < items.length - 1 && (
              <Separator
                orientation="vertical"
                height="6"
                borderColor="blackAlpha.500"
                size="md"
              />
            )}
          </HStack>
        ))}
      </HStack>
    </Box>
  );
}

export default Ticker;

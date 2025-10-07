import { RocketLaunchIcon } from "@phosphor-icons/react";
import { Box, Text, Separator, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

function Ticker() {
  const [countArray, setCountArray] = useState([]);
  useEffect(() => {
    const getRunCount = async () => {
      const response = await axios.get("/api/projects/runs");
      setCountArray(response.data);
      console.log(response.data);
    };
    getRunCount();
  }, []);

  return (
    <Box bg="#3BAFDA" w="auto" display="flex" borderRadius="full" px={4} py={2}>
      <HStack mr={4}>
        <Text color="black" fontWeight="semibold">
          Runs Since Launch
        </Text>
        <RocketLaunchIcon color="black" size={24} />
      </HStack>

      <HStack spacing={4}>
        {countArray.map((p, i) => (
          <HStack key={`${p.ProjectName}-${i}`} spacing={4}>
            <Text fontWeight="semibold" fontSize="md" color="black">
              {p.ProjectName}: {p.Count}
            </Text>
            {i < countArray.length - 1 && (
              <Separator orientation="vertical" height="6" borderColor="gray.500" size="md" />
            )}
          </HStack>
        ))}
      </HStack>
    </Box>
  );
}

export default Ticker;

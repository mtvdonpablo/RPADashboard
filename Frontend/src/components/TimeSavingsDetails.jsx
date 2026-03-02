import { IconButton, Popover, Portal, VStack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { InfoIcon } from "@phosphor-icons/react";

const plural = (n) => `${n}hr${n === 1 ? "" : "s"}`;

const TimeSavingsDetails = ({ items = [] }) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Popover.Trigger asChild>
        <IconButton
          aria-label="View details"
          variant="unstyled"
          border="none"
          p={0}
          minW="auto"
          h="auto"
        >
          <InfoIcon size={32} color="#fcfcfc" weight="fill" />
        </IconButton>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content bg="gray.800" rounded="lg" shadow="xl" w="100%" >
            <Popover.Arrow
              bg="gray.800"
              css={{
                "--arrow-bg": "#1A202C",
                "--arrow-background": "#1A202C",
                "& [data-part='arrow-tip']": {
                  background: "#1A202C",
                },
              }}
            />
            <Popover.Body>
              <VStack align="start" spacing={1}>
                {items.map(({ ProjectName, hours }) => (
                  <Text color="white" key={ProjectName}>
                    {ProjectName}: {plural(Number(hours))}
                  </Text>
                ))}
              </VStack>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};

export default TimeSavingsDetails;

import { Card, Heading, Icon, Stack, Box } from "@chakra-ui/react";

function formatValue(value, units) {
  const cad = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 2,
  });
  let display = "";
  if (units === "dollars") {
    display = cad.format(Number(value));
  } else if (units === "hours") {
    display = Number(value).toFixed(2);
  } else if (units === "percent") {
    display = `${Number(value).toFixed(1)}%`;
  } else if (typeof value === "number") {
    display = value.toLocaleString();
  } else {
    display = value;
  }
  return display;
}

function KPICard({ title, icon: IconComp, value, units, action = null }) {
  return (
    <Card.Root
      bg="gray.800"
      border="none"
      w="full"
      minW={0}
      h="140px"
      position="relative"
    >
      <Card.Header >
        <Stack direction="row" justify="center">
          <Heading size="md" color="white">
            {title}
          </Heading>
          <Icon as={IconComp} aria-hidden boxSize={6} color="white" />
        </Stack>
      </Card.Header>
      <Card.Body p={0} alignItems="center">
        <Heading size="5xl" color="white">
          {formatValue(value, units)}
        </Heading>
      </Card.Body>
      {action && (
        <Box position="absolute" bottom="2" right="2">
          {action}
        </Box>
      )}
    </Card.Root>
  );
}

export default KPICard;

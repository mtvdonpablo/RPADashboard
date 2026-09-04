import {
  Button,
  Dialog,
  Portal,
  Table,
  Badge,
  HStack,
  Text,
  Box,
} from "@chakra-ui/react";
import { CalendarIcon } from "@phosphor-icons/react";
import { useState } from "react";

// Demo-only schedule data for public screenshots and documentation.
// Production schedule identifiers are intentionally not stored in this repository.
const demoSchedules = [
  {
    project: "Invoice Processing",
    frequency: "Daily",
    days: "Every weekday",
    times: ["8:00 AM", "2:00 PM"],
    color: "purple",
    sapId: "DEMO-SAP-01",
    vm: "RPA-DEMO-VM01",
    serviceId: "demo\\svc_rpa_01",
  },
  {
    project: "Account Reconciliation",
    frequency: "Monthly",
    days: "1st - 5th",
    times: ["6:00 PM"],
    color: "blue",
    sapId: "DEMO-SAP-02",
    vm: "RPA-DEMO-VM02",
    serviceId: "demo\\svc_rpa_02",
  },
  {
    project: "Employee Onboarding",
    frequency: "Daily",
    days: "Every weekday",
    times: ["9:00 AM", "3:00 PM"],
    color: "teal",
    sapId: "DEMO-SAP-03",
    vm: "RPA-DEMO-VM01",
    serviceId: "demo\\svc_rpa_01",
  },
  {
    project: "Monthly Reporting",
    frequency: "Monthly",
    days: "Last business day",
    times: ["7:00 PM"],
    color: "orange",
    sapId: "DEMO-SAP-04",
    vm: "RPA-DEMO-VM03",
    serviceId: "demo\\svc_rpa_03",
  },
  {
    project: "Order Validation",
    frequency: "Hourly",
    days: "Every day",
    times: ["Every 2 hours"],
    color: "red",
    sapId: "DEMO-SAP-05",
    vm: "RPA-DEMO-VM02",
    serviceId: "demo\\svc_rpa_02",
  },
];

// A gitignored scheduleData.local.js file overrides demo data for local use.
// Set VITE_USE_DEMO_SCHEDULES=true when taking public screenshots.
const localScheduleModules = import.meta.glob("./scheduleData.local.js", {
  eager: true,
});
const productionSchedules =
  localScheduleModules["./scheduleData.local.js"]?.default;
const schedules =
  import.meta.env.VITE_USE_DEMO_SCHEDULES === "true"
    ? demoSchedules
    : productionSchedules ?? demoSchedules;

const ScheduleModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        color="white"
        borderColor="white"
        onClick={() => setOpen(true)}
      >
        <CalendarIcon />
        View Schedules
      </Button>

      <Dialog.Root
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        size="cover"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content color="black" maxW="96vw">
              <Dialog.Header>
                <Dialog.Title>Project Schedules</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                  <Table.Root size="sm" w="full" fontSize="xs">
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader>Project</Table.ColumnHeader>
                        <Table.ColumnHeader>SAP ID</Table.ColumnHeader>
                        <Table.ColumnHeader>VM</Table.ColumnHeader>
                        <Table.ColumnHeader>Service ID</Table.ColumnHeader>
                        <Table.ColumnHeader>Frequency</Table.ColumnHeader>
                        <Table.ColumnHeader>Days</Table.ColumnHeader>
                        <Table.ColumnHeader>Time(s)</Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {schedules.map((schedule) => (
                        <Table.Row key={schedule.project}>
                        <Table.Cell whiteSpace="normal">
                          <HStack>
                            <Box
                              w={2}
                              h={2}
                              borderRadius="full"
                              bg={`${schedule.color}.500`}
                            />
                            <Text fontWeight="medium">{schedule.project}</Text>
                          </HStack>
                        </Table.Cell>
                        <Table.Cell whiteSpace="normal">
                          {schedule.sapId}
                        </Table.Cell>
                        <Table.Cell whiteSpace="normal">{schedule.vm}</Table.Cell>
                        <Table.Cell whiteSpace="normal" wordBreak="break-word">
                          {schedule.serviceId}
                        </Table.Cell>
                        <Table.Cell>
                          <Badge colorPalette={schedule.color}>
                            {schedule.frequency}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell whiteSpace="normal">{schedule.days}</Table.Cell>
                        <Table.Cell whiteSpace="normal">
                          {schedule.times.map((time, i) => (
                            <Text key={i}>{time}</Text>
                          ))}
                        </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Close
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default ScheduleModal;

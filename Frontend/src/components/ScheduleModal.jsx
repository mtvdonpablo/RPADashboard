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

const schedules = [
  {
    project: "PGI (ZOR)",
    frequency: "Monthly",
    days: "4th - 10th",
    times: ["5:00 AM", "5:00 PM"],
    color: "purple",
  },
  {
    project: "Hardware Renewal Phase 1",
    frequency: "Daily",
    days: "Every day",
    times: ["11:00 AM"],
    color: "blue",
  },
  {
    project: "ZOR Phase 2",
    frequency: "Monthly",
    days: "6th - 11th",
    times: ["6:00 PM"],
    color: "teal",
  },
  {
    project: "APA to SAP",
    frequency: "Quarterly",
    days: "25th (Feb, May, Aug, Nov)",
    times: ["5:00 PM"],
    color: "orange",
  },
];

const ScheduleModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" color="white" borderColor="white" onClick={() => setOpen(true)}>
        <CalendarIcon />
        View Schedules
      </Button>

      <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)} size="lg">
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content color="black">
              <Dialog.Header>
                <Dialog.Title>Project Schedules</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Table.Root size="sm">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>Project</Table.ColumnHeader>
                      <Table.ColumnHeader>Frequency</Table.ColumnHeader>
                      <Table.ColumnHeader>Days</Table.ColumnHeader>
                      <Table.ColumnHeader>Time(s)</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {schedules.map((schedule) => (
                      <Table.Row key={schedule.project}>
                        <Table.Cell>
                          <HStack>
                            <Box w={2} h={2} borderRadius="full" bg={`${schedule.color}.500`} />
                            <Text fontWeight="medium">{schedule.project}</Text>
                          </HStack>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge colorPalette={schedule.color}>{schedule.frequency}</Badge>
                        </Table.Cell>
                        <Table.Cell>{schedule.days}</Table.Cell>
                        <Table.Cell>
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

import {
  Badge,
  Box,
  Card,
  HStack,
  NativeSelect,
  Table,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

function ProjectErrorsTable({ dateRange }) {
  const [errors, setErrors] = useState([]);
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError("");

    axios
      .get("/api/projects/errors-by-project", {
        params: { range: dateRange ?? "all" },
      })
      .then((response) => {
        if (active) setErrors(response.data);
      })
      .catch(() => {
        if (active) setLoadError("Unable to load project errors.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [dateRange]);

  const projects = useMemo(
    () => [...new Set(errors.map((error) => error.ProjectName))].sort(),
    [errors],
  );

  const projectErrors = errors.filter(
    (error) =>
      selectedProject === "all" || error.ProjectName === selectedProject,
  );
  const visibleErrors = projectErrors.filter(
    (error) => selectedType === "all" || error.ExceptionType === selectedType,
  );
  const countByType = (type) =>
    projectErrors.reduce(
      (total, error) =>
        total +
        (error.ExceptionType === type ? Number(error.OccurrenceCount) : 0),
      0,
    );
  const beCount = countByType("BE");
  const seCount = countByType("SE");

  return (
    <Card.Root maxW="full">
      <Card.Header gap={4}>
        <Card.Title>Errors by Project</Card.Title>
        <HStack gap={3} flexWrap="wrap">
          <NativeSelect.Root size="sm" width={{ base: "full", md: "260px" }}>
            <NativeSelect.Field
              aria-label="Filter errors by project"
              value={selectedProject}
              bg="white"
              color="gray.900"
              css={{ "& option": { background: "white", color: "#111827" } }}
              onChange={(event) => setSelectedProject(event.target.value)}
            >
              <option value="all">All projects</option>
              {projects.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </NativeSelect.Field>
          </NativeSelect.Root>
          <NativeSelect.Root size="sm" width={{ base: "full", md: "180px" }}>
            <NativeSelect.Field
              aria-label="Filter errors by type"
              value={selectedType}
              bg="white"
              color="gray.900"
              css={{ "& option": { background: "white", color: "#111827" } }}
              onChange={(event) => setSelectedType(event.target.value)}
            >
              <option value="all">SE and BE</option>
              <option value="SE">SE only</option>
              <option value="BE">BE only</option>
            </NativeSelect.Field>
          </NativeSelect.Root>
        </HStack>
        <HStack gap={3} flexWrap="wrap">
          <Box
            bg="red.700"
            borderColor="red.400"
            borderWidth="1px"
            borderRadius="md"
            px={4}
            py={2}
            minW="150px"
          >
            <Text fontSize="xs" color="whiteAlpha.900">
              System Exceptions
            </Text>
            <Text fontSize="xl" fontWeight="bold" color="white">
              {seCount.toLocaleString()}
            </Text>
          </Box>
          <Box
            bg="orange.700"
            borderColor="orange.400"
            borderWidth="1px"
            borderRadius="md"
            px={4}
            py={2}
            minW="150px"
          >
            <Text fontSize="xs" color="whiteAlpha.900">
              Business Exceptions
            </Text>
            <Text fontSize="xl" fontWeight="bold" color="white">
              {beCount.toLocaleString()}
            </Text>
          </Box>
          <Box
            bg="blue.700"
            borderColor="blue.400"
            borderWidth="1px"
            borderRadius="md"
            px={4}
            py={2}
            minW="150px"
          >
            <Text fontSize="xs" color="whiteAlpha.900">
              Total Exceptions
            </Text>
            <Text fontSize="xl" fontWeight="bold" color="white">
              {(seCount + beCount).toLocaleString()}
            </Text>
          </Box>
        </HStack>
      </Card.Header>
      <Card.Body>
        {loading && <Text>Loading errors...</Text>}
        {loadError && <Text color="red.300">{loadError}</Text>}
        {!loading && !loadError && visibleErrors.length === 0 && (
          <Text>No SE or BE errors found for this selection.</Text>
        )}
        {!loading && !loadError && visibleErrors.length > 0 && (
          <Table.ScrollArea maxH="360px">
            <Table.Root size="sm" stickyHeader>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Project</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">Type</Table.ColumnHeader>
                  <Table.ColumnHeader>Error Message</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Count</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {visibleErrors.map((error) => (
                  <Table.Row
                    key={`${error.ProjectID}-${error.ExceptionType}-${error.ErrorMessage}`}
                  >
                    <Table.Cell fontWeight="medium">
                      {error.ProjectName}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Badge
                        colorPalette={
                          error.ExceptionType === "BE" ? "orange" : "red"
                        }
                      >
                        {error.ExceptionType}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell
                      maxW="520px"
                      whiteSpace="normal"
                      wordBreak="break-word"
                    >
                      {error.ErrorMessage}
                    </Table.Cell>
                    <Table.Cell textAlign="right" fontWeight="bold">
                      {Number(error.OccurrenceCount).toLocaleString()}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        )}
      </Card.Body>
    </Card.Root>
  );
}

export default ProjectErrorsTable;

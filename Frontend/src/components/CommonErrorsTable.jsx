import { Card, Table, Badge } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";

const CommonErrorsTable = () => {
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const getCommonErrors = async () => {
      const response = await axios.get("/api/projects/common-errors?limit=10");
      setErrors(response.data);
    };
    getCommonErrors();
  }, []);

  return (
    <Card.Root maxW="full">
      <Card.Header>
        <Card.Title>Most Common Errors</Card.Title>
      </Card.Header>
      <Card.Body>
        <Table.ScrollArea maxH="300px">
          <Table.Root size="sm" stickyHeader>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Error Message</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">Type</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Count</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {errors.map((error, index) => (
                <Table.Row key={index}>
                  <Table.Cell maxW="400px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" title={error.ErrorMessage}>
                    {error.ErrorMessage}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <Badge colorPalette={error.ExceptionType === "Business Exception" ? "orange" : "red"}>
                      {error.ExceptionType === "Business Exception" ? "BE" : "SE"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell textAlign="right" fontWeight="semibold">
                    {error.OccurrenceCount.toLocaleString()}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Card.Body>
    </Card.Root>
  );
};

export default CommonErrorsTable;

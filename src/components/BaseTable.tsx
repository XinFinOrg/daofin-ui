import React, {
  Component,
  ComponentType,
  FC,
  ReactElement,
  ReactNode,
  useEffect,
} from "react";
import {
  Box,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { v4 as uuid } from "uuid";
import { EmptyBoxIcon } from "../utils/assets/icons/EmptyBoxIcon";
interface BaseTableProps<T> {
  data: T[];
  columns: { label: string; tooltip?: ""; accessor: keyof T; w?: string }[];
  emptyText?: string;
}

const BaseTable = <T,>({ columns, data, emptyText }: BaseTableProps<T>) => {
  return (
    <TableContainer
      boxShadow="sm"
      borderRadius={"md"}
      bgColor={useColorModeValue("gray.50", "gray.900")}
    >
      <Table variant="simple">
        <Thead>
          <Tr key={uuid()}>
            {columns.length > 0 ? (
              columns.map(({ label, w }) => <Th w={w}>{label}</Th>)
            ) : (
              <></>
            )}
          </Tr>
        </Thead>
        <Tbody>
          {data.length > 0 ? (
            data.map((row) => (
              <Tr key={uuid()}>
                {columns.map((col, index) => (
                  <Td
                    key={uuid()}
                    w={col.w}
                    maxW={["100px", "300px"]}
                    overflow={"auto"}
                  >
                    {row[col.accessor] as ReactNode}
                  </Td>
                ))}
              </Tr>
            ))
          ) : (
            <VStack w={"100%"} alignItems="center" alignSelf={"center"} p={6}>
              <EmptyBoxIcon />
              <Text fontSize={"xs"} fontWeight={"500"} opacity={"0.5"}>
                {emptyText}
              </Text>
            </VStack>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default BaseTable;

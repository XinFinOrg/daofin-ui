import React, { Component, FC, ReactNode } from "react";
import {
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { v4 as uuid } from "uuid";
interface BaseTableProps<T> {
  data: T[];
  columns: { label: string; tooltip?: ""; accessor: keyof T; w?: string }[];
}

const BaseTable = <T,>({ columns, data }: BaseTableProps<T>) => {
  return (
    <TableContainer boxShadow="sm" borderRadius={'md'} bgColor={useColorModeValue('gray.50','gray.900')}>
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
                  <Td key={uuid()}>{row[col.accessor] as ReactNode}</Td>
                ))}
              </Tr>
            ))
          ) : (
            <></>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default BaseTable;

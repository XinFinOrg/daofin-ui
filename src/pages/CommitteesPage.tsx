import { Box, Flex, Text, Heading } from "@chakra-ui/layout";
import React from "react";
import { styled } from "styled-components";
import { v4 as uuid } from "uuid";
import BoxWrapper from "../components/BoxWrapper";
import { Link } from "react-router-dom";

const CommitteesList = [
  {
    id: uuid(),
    name: "Judiciaries",
    path: "/committees/judiciaries",
    description:
      "This committee is a group of expert people who are selected during initial deployment.",
  },
  {
    id: uuid(),
    name: "People's House",
    path: "/committees/peoples-house",
    description:
      "This committee is a group of people that has deposited into DAO Treasury.",
  },
  {
    id: uuid(),
    name: "Master Node Senate",
    path: "/committees/master-node-delegatee",
    description:
      "This committee is list of selected addresses by each Master Node from XDPOS.",
  },
];
const CommitteesPage = () => {
  return (
    <Box className="grid grid-cols-12 grid-rows-12">
      {CommitteesList.map(({ id, name, path, description }) => (
        <Link to={path} className="col-span-12 row-span-1 sm:col-span-4">
          <BoxWrapper key={id} className="m-2">
            <Heading size={"md"}>{name}</Heading>
            <Text as={"p"}>{description}</Text>
          </BoxWrapper>
        </Link>
      ))}
    </Box>
  );
};

export default CommitteesPage;

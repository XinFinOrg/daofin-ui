import { Box, Flex, Text } from "@chakra-ui/layout";
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
  },
  {
    id: uuid(),
    name: "People's House",
    path: "/committees/peoples-house",
  },
  {
    id: uuid(),
    name: "Master Node Senate",
    path: "",
  },
];
const CommitteesPage = () => {
  return (
    <Flex className="w-full justify-center">
      {CommitteesList.map(({ id, name, path }) => (
        <BoxWrapper key={id} className="m-2">
          <Link to={path}>{name}</Link>
        </BoxWrapper>
      ))}
    </Flex>
  );
};

export default CommitteesPage;

import { DaoAction } from "@xinfin/osx-client-common";
import React, { FC } from "react";
import useDaoProposals from "../hooks/useDaoProposals";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import { Proposal } from "../utils/types";
import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import { shortenAddress } from "../utils/networks";
import { styled } from "styled-components";
import { Button } from "@chakra-ui/button";
import { Link } from "react-router-dom";
const ProposalWrapper = styled.div.attrs({
  className:
    "border border-2 p-4 mt-4 rounded outline outline-offset-2 outline-2 ",
})``;
const Proposals: FC<{ proposals: Proposal[] }> = ({ proposals }) => {
  return (
    <>
      {proposals.length > 0 &&
        proposals.map(({ id, pluginProposalId, creator, metadata }) => (
          <ProposalWrapper key={id}>
            <Flex direction={"column"}>
              <Flex
                direction={"column"}
                justifyContent={"start"}
                alignItems={"start"}
              >
                <Box mr={1}>
                  <Text fontSize={"2xl"}>
                    Proposal ID: # {pluginProposalId}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="xl" textAlign={"start"}>
                    {metadata.title}
                  </Text>
                </Box>
              </Flex>
              <Flex justifyContent={"start"} alignItems={"center"}>
                <Text textAlign={"left"}>{metadata.summary}</Text>
              </Flex>
              <Flex
                justifyContent={"space-between"}
                mt={"1.5"}
                alignItems={"center"}
              >
                <Text color={"gray"}>
                  Published By{" "}
                  <Text display={"inline-block"}>
                    {" "}
                    {shortenAddress(creator)}
                  </Text>
                </Text>
                <Link to={`${pluginProposalId}/details`}>
                  <Button>View details</Button>
                </Link>
              </Flex>
            </Flex>
          </ProposalWrapper>
        ))}
    </>
  );
};

export default Proposals;

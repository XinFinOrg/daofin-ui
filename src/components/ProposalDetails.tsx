import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Proposal } from "../utils/types";
import {
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  Grid,
  GridItem,
  HStack,
  VStack,
} from "@chakra-ui/layout";
import {
  CHAIN_METADATA,
  JudiciaryCommittee,
  MasterNodeCommittee,
  PeoplesHouseCommittee,
  makeBlockScannerHashUrl,
  shortenAddress,
} from "../utils/networks";
import { styled } from "styled-components";
import { FormLabel } from "@chakra-ui/form-control";
import BoxWrapper from "./BoxWrapper";
import { formatEther } from "@ethersproject/units";
import { useNetwork } from "../contexts/network";
import useIsUserDeposited from "../hooks/useIsUserDeposited";
import { useWallet } from "../hooks/useWallet";
import { Button } from "@chakra-ui/button";

import { useDisclosure } from "@chakra-ui/hooks";
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  useSteps,
} from "@chakra-ui/react";

import { parseEther, zeroAddress } from "viem";

import ProposalTypeBadge from "./ProposalTypeBadge";
import { IoShareSocial } from "react-icons/io5";
import {
  ArrowForwardIcon,
  CheckCircleIcon,
  InfoOutlineIcon,
  TimeIcon,
} from "@chakra-ui/icons";

import { useCommitteeUtils } from "../hooks/useCommitteeUtils";

import VotingStatsBox from "./VotingStatsBox";
import { BlockIcon } from "../utils/assets/icons";
import ProposalStatusStepper from "./ProposalStatusStepper";
import { XdcIcon } from "../utils/assets/icons/XdcIcon";
import {
  WalletAddressCard,
  WalletAddressCardWithBalance,
} from "./WalletAddressCard";
import { timestampToStandardFormatString } from "../utils/date";
import useVoteStats from "../hooks/useVoteStats";
import useFetchVotersOnProposal from "../hooks/useFetchVotersOnProposal";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import { VoteOption } from "@xinfin/osx-daofin-sdk-client";
import { NoProposalIcon } from "../utils/assets/icons/NoProposalIcon";
import { Formik } from "formik";
import { useVoteContext } from "../contexts/voteContext";
import { v4 as uuid } from "uuid";
import { toEther, weiBigNumberToFormattedNumber } from "../utils/numbers";
import { DefaultBox } from "./Box";
import { useClient } from "../hooks/useClient";
import { WalletAuthorizedButton } from "./Button/AuthorizedButton";
import { useExecuteProposalContext } from "../contexts/ExecuteProposalContext";
import { ViewGrantProposalType } from "./actions";
import useFetchProposalStatus, {
  FetchProposalStatusType,
} from "../hooks/useFetchProposalStatus";

const ProposalDetails: FC<{ proposal: Proposal }> = ({ proposal }) => {
  const { actions, creator, metadata, pluginProposalId, createdAt } = proposal;

  const { description, resources, summary, title, media } = metadata;
  const { network } = useNetwork();
  const { committeesListWithIcon } = useCommitteeUtils();

  const { handleToggleFormModal: onExecuteModalOpen } =
    useExecuteProposalContext();

  const { data: allVoters } = useFetchVotersOnProposal(pluginProposalId);

  const voteOptionsList = useMemo(
    () =>
      Object.entries(VoteOption)
        .filter(([_, value]) => isNaN(Number(value)))
        .slice(1),
    []
  );
  const { handleToggleFormModal } = useVoteContext();

  const [proposalStatus, setProposalStatus] =
    useState<FetchProposalStatusType>();
  const { makeCall } = useFetchProposalStatus();
  useEffect(() => {
    makeCall(pluginProposalId).then((data) => {
      setProposalStatus(data);
    });
  }, [pluginProposalId]);

  return (
    <>
      {
        <Grid
          templateColumns="repeat(2, 1fr)"
          // templateRows={"repeat(1, 1fr)"}
          gap={6}
          // w={"full"}
        >
          <GridItem w="full" colSpan={2}>
            <DefaultBox>
              <Flex justifyContent={"space-between"}>
                <Flex flexDirection={"column"} w={"50%"}>
                  <Box>
                    <ProposalTypeBadge title="Grant" />
                  </Box>
                  <Box my={"4"}>
                    <Text as={"h1"} fontSize={"xl"} fontWeight={"bold"}>
                      {title}
                    </Text>
                  </Box>
                  <Flex fontSize={"sm"} justifyContent={"space-between"}>
                    <Text>Published By: {shortenAddress(creator)}</Text>
                    <HStack>
                      <TimeIcon />
                      <Text> {timestampToStandardFormatString(createdAt)}</Text>
                    </HStack>
                    <Text>
                      <InfoOutlineIcon mr={1} />
                      ID: {pluginProposalId}
                    </Text>
                    <HStack>
                      <IoShareSocial />
                      <Text>Share</Text>
                    </HStack>
                  </Flex>
                </Flex>

                <Flex alignItems={"center"}>
                  {proposalStatus?.canExecute ? (
                    <WalletAuthorizedButton
                      colorScheme="blue"
                      onClick={onExecuteModalOpen}
                    >
                      Execute Now
                    </WalletAuthorizedButton>
                  ) : (
                    <WalletAuthorizedButton
                      colorScheme="blue"
                      onClick={handleToggleFormModal}
                    >
                      Vote Now
                    </WalletAuthorizedButton>
                  )}
                  {/* {proposal.executed && <CheckCircleIcon />} */}
                </Flex>
              </Flex>
            </DefaultBox>
          </GridItem>
          <GridItem colSpan={1} w="full">
            <GridItem w="100%" h={"min-content"} mb={4}>
              <DefaultBox>
                <VotingStatsBox proposalId={pluginProposalId} />
              </DefaultBox>
            </GridItem>
            <GridItem colSpan={1} w="100%" h={"min-content"} mb={4}>
              <DefaultBox>
                <ProposalStatusStepper />
              </DefaultBox>
            </GridItem>
            <GridItem colSpan={1} w="100%">
              <DefaultBox>
                <Box p={5}>
                  <Text fontSize={"lg"} fontWeight={"bold"}>
                    Executing Actions
                  </Text>
                  <Text fontSize={"sm"} fontWeight={"normal"}>
                    These actions can be executed only once the governance
                    parameters are met
                  </Text>
                </Box>
                {actions.map((item) => (
                  <ViewGrantProposalType {...item} />
                ))}
              </DefaultBox>
            </GridItem>
          </GridItem>

          <GridItem colSpan={1} colStart={2} colEnd={2}>
            <GridItem h={"min-content"} mb={4}>
              <DefaultBox>
                <HStack justifyContent={"space-between"} mb={"6"} p={"6"}>
                  <Text fontSize={"lg"} fontWeight={"bold"}>
                    Voter
                  </Text>
                </HStack>
                <Tabs isFitted>
                  <TabList>
                    {committeesListWithIcon.map(({ Icon, id, name }) => (
                      <Tab key={id}>
                        <HStack>
                          <Box w={"25px"} h={"25px"}>
                            {Icon && Icon}
                          </Box>
                          <Text
                            fontSize={"sm"}
                            fontWeight={"semibold"}
                            whiteSpace={"nowrap"}
                          >
                            {name}
                          </Text>
                        </HStack>
                      </Tab>
                    ))}
                  </TabList>

                  <TabPanels>
                    {committeesListWithIcon.map(({ id, name }) => (
                      <TabPanel p={"6"}>
                        <Tabs isFitted variant="soft-rounded">
                          <TabList>
                            {voteOptionsList.map(([key, value]) => (
                              <Tab key={key}>
                                <Text>{value}</Text>
                              </Tab>
                            ))}
                          </TabList>
                          <TabPanels>
                            {voteOptionsList.map(([key, value]) => (
                              <TabPanel w={"full"}>
                                <VStack spacing={"1"} alignItems={"start"}>
                                  {allVoters.filter(
                                    (item) =>
                                      item.committee === id &&
                                      item.option === +key
                                  ).length > 0 ? (
                                    allVoters
                                      .filter(
                                        (item) =>
                                          item.committee === id &&
                                          item.option === +key
                                      )
                                      .map(({ voter, txHash }) => (
                                        <HStack w={"full"}>
                                          <WalletAddressCard address={voter} />
                                          <a
                                            href={makeBlockScannerHashUrl(
                                              network,
                                              txHash
                                            )}
                                            target="_blank"
                                          >
                                            <BlockIcon w={"5"} h={"5"} />
                                          </a>
                                        </HStack>
                                      ))
                                  ) : (
                                    <VStack alignSelf={"center"} p={6}>
                                      <NoProposalIcon />
                                      <Text>
                                        No {name} has voted yet! Be the first!
                                      </Text>
                                      <Button variant={"outline"}>
                                        Vote now!
                                      </Button>
                                    </VStack>
                                  )}
                                </VStack>
                              </TabPanel>
                            ))}
                          </TabPanels>
                        </Tabs>
                      </TabPanel>
                    ))}
                  </TabPanels>
                </Tabs>
              </DefaultBox>
            </GridItem>
            <GridItem colSpan={1} h={"fit-content"} mb={4}>
              <DefaultBox>
                <Text p={"5"} fontSize={"lg"} fontWeight={"bold"}>
                  Discussions & References
                </Text>
                <HStack p={"6"}>
                  {resources.map(({ name, url }) => (
                    <a href={url} target="_blank">
                      <Badge
                        p={2}
                        borderRadius={"md"}
                        bgColor={"blue.100"}
                        textColor={"blue.300"}
                      >
                        {name}
                      </Badge>
                    </a>
                  ))}
                </HStack>
              </DefaultBox>
            </GridItem>
            <GridItem colSpan={1} rowSpan={0}>
              <DefaultBox>
                <Box p={"5"}>
                  <Text mb={4} fontSize={"lg"} fontWeight={"bold"}>
                    Details
                  </Text>
                  <Text
                    dangerouslySetInnerHTML={{
                      __html: description,
                    }}
                  ></Text>
                </Box>
              </DefaultBox>
            </GridItem>
          </GridItem>
        </Grid>
      }
    </>
  );
};

export default ProposalDetails;

import React, { FC, useMemo } from "react";
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
import { ArrowForwardIcon, InfoOutlineIcon, TimeIcon } from "@chakra-ui/icons";

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

const ProposalDetails: FC<{ proposal: Proposal }> = ({ proposal }) => {
  const {
    actions,
    creator,
    dao,
    endDate,
    executed,
    id,
    metadata,
    pluginProposalId,
    potentiallyExecutable,
    startDate,
    createdAt,
    proposalType,
  } = proposal;

  console.log({ actions });

  const { description, resources, summary, title, media } = metadata;
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { network } = useNetwork();
  const { address: voterAddress } = useWallet();
  const { committeesListWithIcon, committeesList } = useCommitteeUtils();
  const { daoAddress, pluginAddress } = useAppGlobalConfig();
  // const {
  //   judiciaryVoteListLength,
  //   masterNodeVoteListLength,
  //   peoplesHouseVoteListLength,
  // } = useVoteStats(pluginProposalId);

  const { data: allVoters } = useFetchVotersOnProposal(pluginProposalId);

  const handleVote = async () => {
    // const iterator = daofinClient?.methods.vote(
    //   pluginProposalId,
    //   voteOption,
    //   false
    // );
    // if (!iterator) return;
    // try {
    //   for await (const step of iterator) {
    //     switch (step.key) {
    //       case VoteSteps.WAITING:
    //         console.log("Key:", step.key);
    //         console.log("Tx:", step.txHash);
    //         break;
    //       case VoteSteps.DONE:
    //         console.log("Key:", step.key);
    //         break;
    //     }
    //   }
    // } catch (e) {
    //   console.log(e);
    // }
  };

  // const convertCommitteeBytesToVoteLength = (committee: string) => {
  //   switch (committee) {
  //     case MasterNodeCommittee:
  //       return masterNodeVoteListLength;
  //     case PeoplesHouseCommittee:
  //       return peoplesHouseVoteListLength;
  //     case JudiciaryCommittee:
  //       return judiciaryVoteListLength;
  //   }
  // };
  const committeePanelData = useMemo(
    () => committeesList.map((item) => ({ ...item })),
    [committeesList]
  );

  const voteOptionsList = useMemo(
    () =>
      Object.entries(VoteOption)
        .filter(([_, value]) => isNaN(Number(value)))
        .slice(1),
    []
  );
  const { handleToggleFormModal } = useVoteContext();

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
                  <Button colorScheme="blue" onClick={handleToggleFormModal}>
                    Vote Now
                  </Button>
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
                {actions.map(({ data, to, value }) => (
                  <VStack p={5} alignItems={"flex-start"} key={uuid()}>
                    <Box
                      bgColor={"blue.100"}
                      fontWeight={"semibold"}
                      width={"full"}
                      textAlign={"center"}
                      p={4}
                      borderRadius={"md"}
                    >
                      <HStack justifyContent={"center"}>
                        <Box w={"20px"}>
                          <XdcIcon />
                        </Box>
                        <Text>
                          {weiBigNumberToFormattedNumber(value.toString())}{" "}
                          {CHAIN_METADATA[network].nativeCurrency.symbol}
                        </Text>
                      </HStack>
                    </Box>
                    <HStack justifyContent={"start"} w={"full"}>
                      <Box
                        // bgColor={"blue.100"}
                        p={2}
                        width={"full"}
                        borderRadius={"md"}
                        justifySelf={"stretch"}
                      >
                        <WalletAddressCard sm address={daoAddress} />
                      </Box>{" "}
                      <Box>
                        <ArrowForwardIcon />
                      </Box>
                      <Box
                        // bgColor={"blue.100"}
                        p={2}
                        borderRadius={"md"}
                        width={"full"}
                      >
                        <WalletAddressCard sm address={to} />
                      </Box>
                    </HStack>
                  </VStack>
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
                              <Tab key={key}>{value}</Tab>
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
            <GridItem
              colSpan={1}
              rowSpan={0}
            >
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

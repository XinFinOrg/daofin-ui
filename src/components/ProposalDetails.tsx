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
import { shortenAddress } from "../utils/networks";
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
import { ArrowForwardIcon, TimeIcon } from "@chakra-ui/icons";

import { useCommitteeUtils } from "../hooks/useCommitteeUtils";
import VoteStatProgressBar from "./VoteStatProgressBar";
import VotingStatsBox from "./VotingStatsBox";
import { BlockIcon } from "../utils/assets/icons";
import ProposalStatusStepper from "./ProposalStatusStepper";
import { XdcIcon } from "../utils/assets/icons/XdcIcon";
import { WalletAddressCard } from "./WalletAddressCard";

const ProposalDetails: FC<{ proposal?: Proposal }> = ({ proposal }) => {
  // const {
  //   actions,
  //   creator,
  //   dao,
  //   endDate,
  //   executed,
  //   id,
  //   metadata,
  //   pluginProposalId,
  //   potentiallyExecutable,
  //   startDate,
  // } = proposal;

  const { isOpen, onClose, onOpen } = useDisclosure();
  const { network } = useNetwork();
  const { address: voterAddress } = useWallet();
  const { committeesListWithIcon, committeesList } = useCommitteeUtils();
  // const {
  //   judiciaryVoteListLength,
  //   masterNodeVoteListLength,
  //   peoplesHouseVoteListLength,
  // } = useVoteStats(pluginProposalId);

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
  // const mnStats = useMinParticipationVotingStatsPerCommittee(
  //   pluginProposalId,
  //   MasterNodeCommittee
  // );

  // const judiciaryStats = useMinParticipationVotingStatsPerCommittee(
  //   pluginProposalId,
  //   JudiciaryCommittee
  // );
  // const peopleStats = useMinParticipationVotingStatsPerCommittee(
  //   pluginProposalId,
  //   PeoplesHouseCommittee
  // );

  // const convertCommitteeBytesToVotingStats = (
  //   committee: string
  // ):
  //   | {
  //       current: BigNumber;
  //       minParticipations: BigNumber;
  //       percentage: string;
  //     }
  //   | undefined => {
  //   switch (committee) {
  //     case MasterNodeCommittee:
  //       return mnStats;
  //     case PeoplesHouseCommittee:
  //       return peopleStats
  //         ? {
  //             current: BigNumber.from(
  //               parseInt(formatEther(peopleStats.current))
  //             ),
  //             percentage: peopleStats.percentage,
  //             minParticipations: BigNumber.from(
  //               parseInt(formatEther(peopleStats.minParticipations))
  //             ),
  //           }
  //         : {
  //             current: BigNumber.from(0),
  //             minParticipations: BigNumber.from(0),
  //             percentage: "0",
  //           };
  //     case JudiciaryCommittee:
  //       return judiciaryStats;
  //   }
  // };

  // const mnThresholdStats = useThresholdVotingStatsPerCommittee(
  //   pluginProposalId,
  //   MasterNodeCommittee
  // );

  // const judiciaryThresholdStats = useThresholdVotingStatsPerCommittee(
  //   pluginProposalId,
  //   JudiciaryCommittee
  // );
  // const peopleThresholdStats = useThresholdVotingStatsPerCommittee(
  //   pluginProposalId,
  //   PeoplesHouseCommittee
  // );
  // const convertCommitteeBytesToSupportTresholdStats = (
  //   committee: string
  // ):
  //   | {
  //       current: BigNumber;
  //       supportThreshold: BigNumber;
  //       percentage: string;
  //     }
  //   | undefined => {
  //   switch (committee) {
  //     case MasterNodeCommittee:
  //       return mnThresholdStats;
  //     case PeoplesHouseCommittee:
  //       return peopleThresholdStats;
  //     case JudiciaryCommittee:
  //       return judiciaryThresholdStats;
  //   }
  // };
  // const minParticipationStats = useMemo(
  //   () =>
  //     committeesList && peopleStats && mnStats && judiciaryStats
  //       ? committeesList.map((committee) =>
  //           convertCommitteeBytesToVotingStats(committee)
  //         )
  //       : [],
  //   [committeesList, peopleStats, mnStats, judiciaryStats]
  // );

  // const supportThresholdStats = useMemo(
  //   () =>
  //     committeesList &&
  //     peopleThresholdStats &&
  //     mnThresholdStats &&
  //     judiciaryThresholdStats
  //       ? committeesList.map((committee) =>
  //           convertCommitteeBytesToSupportTresholdStats(committee)
  //         )
  //       : [],
  //   [committeesList, peopleStats, mnStats, judiciaryStats]
  // );

  return (
    <>
      {
        <Grid
          templateColumns="repeat(2, 1fr)"
          // templateRows={"repeat(1, 1fr)"}
          gap={6}
          // w={"full"}
        >
          <GridItem
            w="full"
            bg="gray.50"
            p={"6"}
            borderRadius={"lg"}
            border={"1px"}
            borderColor={"blue.50"}
            boxShadow={"sm"}
            colSpan={2}
          >
            <Flex justifyContent={"space-between"}>
              <Flex flexDirection={"column"} w={"50%"}>
                <Box>
                  <ProposalTypeBadge title="Grant" />
                </Box>
                <Box my={"4"}>
                  <Text as={"h1"} fontSize={"xl"} fontWeight={"bold"}>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  </Text>
                </Box>
                <Flex fontSize={"sm"} justifyContent={"space-between"}>
                  <Text>Published By: 0x22323423423</Text>
                  <HStack>
                    <TimeIcon />
                    <Text> {new Date(Date.now()).toISOString()}</Text>
                  </HStack>
                  <Text>ID {12}</Text>
                  <HStack>
                    <IoShareSocial />
                    <Text>Share</Text>
                  </HStack>
                </Flex>
              </Flex>

              <Flex alignItems={"center"}>
                <Button colorScheme="blue">Vote Now</Button>
              </Flex>
            </Flex>
          </GridItem>

          <GridItem colSpan={1} w="full">
            <GridItem
              w="100%"
              bg="gray.50"
              borderRadius={"lg"}
              border={"1px"}
              borderColor={"blue.50"}
              boxShadow={"sm"}
              h={"min-content"}
              mb={4}
            >
              <VotingStatsBox />
            </GridItem>
            <GridItem
              colSpan={1}
              w="100%"
              bg="gray.50"
              borderRadius={"lg"}
              border={"1px"}
              borderColor={"blue.50"}
              boxShadow={"sm"}
              h={"min-content"}
              mb={4}
            >
              <ProposalStatusStepper />
            </GridItem>
            <GridItem
              colSpan={1}
              w="100%"
              bg="gray.50"
              borderRadius={"lg"}
              border={"1px"}
              borderColor={"blue.50"}
              boxShadow={"sm"}
            >
              <Box p={5}>
                <Text fontSize={"lg"} fontWeight={"bold"}>
                  Executing Actions
                </Text>
                <Text fontSize={"sm"} fontWeight={"normal"}>
                  These actions can be executed only once the governance
                  parameters are met
                </Text>
              </Box>
              <VStack p={5} alignItems={"flex-start"}>
                <Box
                  bgColor={"blue.100"}
                  fontWeight={"semibold"}
                  width={"full"}
                  textAlign={"center"}
                  p={4}
                  borderRadius={"md"}
                >
                  <HStack justifyContent={"center"}>
                    <Box w={'20px'}><XdcIcon  />

                    </Box>
                    <Text>1000 XDC</Text>
                  </HStack>
                </Box>
                <HStack justifyContent={"start"} w={"full"}>
                  <Box
                    bgColor={"blue.100"}
                    p={3}
                    width={"full"}
                    borderRadius={"md"}
                    justifySelf={"stretch"}
                  >
                    <HStack>
                      <Text>From</Text>
                      <Text>{shortenAddress(zeroAddress)}</Text>
                    </HStack>
                  </Box>{" "}
                  <Box>
                    <ArrowForwardIcon />
                  </Box>
                  <Box
                    bgColor={"blue.100"}
                    p={2}
                    borderRadius={"md"}
                    width={"full"}
                  >
                    <HStack>
                      <Text>To</Text>
                      <Text>{shortenAddress(zeroAddress)}</Text>
                    </HStack>
                  </Box>
                </HStack>
              </VStack>
            </GridItem>
          </GridItem>

          <GridItem colSpan={1} colStart={2} colEnd={2}>
            <GridItem
              // w="100%"
              bg="gray.50"
              borderRadius={"lg"}
              border={"1px"}
              borderColor={"blue.50"}
              boxShadow={"sm"}
              h={"min-content"}
              mb={4}
            >
              <HStack justifyContent={"space-between"} mb={"6"} p={"6"}>
                <Text fontSize={"lg"} fontWeight={"bold"}>
                  Voter
                </Text>
              </HStack>
              <Tabs isFitted>
                <TabList>
                  {committeesListWithIcon.map(({ icon, id, name }) => (
                    <Tab key={id}>
                      <HStack>
                        <Box w={"25px"} h={"25px"}>
                          {icon}
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
                  {committeesListWithIcon.map(({}) => (
                    <TabPanel p={"6"}>
                      <Tabs isFitted variant="soft-rounded">
                        <TabList>
                          <Tab>For</Tab>
                          <Tab>Against</Tab>
                          <Tab>Abstain</Tab>
                        </TabList>
                        <TabPanels>
                          {committeesListWithIcon.map(({}) => (
                            <TabPanel w={"full"}>
                              <VStack spacing={"1"} alignItems={"start"}>
                                <HStack>
                                  <WalletAddressCard sm address={zeroAddress} />
                                  <a href="">
                                    <BlockIcon w={"5"} h={"5"} />
                                  </a>
                                </HStack>
                                <HStack>
                                  <WalletAddressCard sm address={zeroAddress} />
                                  <a href="">
                                    <BlockIcon w={"5"} h={"5"} />
                                  </a>
                                </HStack>
                                <HStack>
                                  <WalletAddressCard sm address={zeroAddress} />
                                  <a href="">
                                    <BlockIcon w={"5"} h={"5"} />
                                  </a>
                                </HStack>
                              </VStack>
                            </TabPanel>
                          ))}
                        </TabPanels>
                      </Tabs>
                    </TabPanel>
                  ))}
                </TabPanels>
              </Tabs>
            </GridItem>
            <GridItem
              colSpan={1}
              // w="100%"
              bg="gray.50"
              borderRadius={"lg"}
              border={"1px"}
              borderColor={"blue.50"}
              boxShadow={"sm"}
              h={"fit-content"}
              mb={4}
            >
              <Text p={"5"} fontSize={"lg"} fontWeight={"bold"}>
                Discussions & References
              </Text>
              <HStack p={"6"}>
                <Badge
                  p={2}
                  borderRadius={"md"}
                  bgColor={"blue.100"}
                  textColor={"blue.300"}
                >
                  XDC official
                </Badge>
              </HStack>
            </GridItem>
            <GridItem
              colSpan={1}
              // w="100%"
              bg="gray.50"
              borderRadius={"lg"}
              border={"1px"}
              borderColor={"blue.50"}
              boxShadow={"sm"}
              rowSpan={0}
            >
              <Box p={"5"}>
                <Text mb={4} fontSize={"lg"} fontWeight={"bold"}>
                  Details
                </Text>
                <Text>
                  This AIP propose to modify the parameters of stablecoins
                  across all the Aave pools. Mainly by setting the slope1 to 5%,
                  as well as changing the RF to 25% and Uopt to 90% of some of
                  them. According to research by @monet-supply, the borrowing
                  parameters of the stablecoins on Aave have diverged from the
                  broader market leading to potentials inefficiencies and bad
                  user experience. Those proposed changes have been approved by
                  both risk providers, with additional suggestion by @Gauntlet.
                  Stablecoin across all the V2 and V3 markets are concerned by
                  those change. Namely USDC, USDT, LUSD, FRAX, sUSD, DAI, MAI,
                  GUSD, USDP on ethereum (V2 and V3), polygon (V2 and V2),
                  Arbitrum, Gnosis, Optimism, Avalanche (v2 and V3) and Metis.
                  However the changes of RF and Uopt would be more limited, with
                  the Uopt changes being limited to USDC, USDT, DAI and FRAX
                  across all V3s and the RF ones to USDC, USDT and LUSD only for
                  Ethereum V2.
                </Text>
              </Box>
            </GridItem>
          </GridItem>
        </Grid>
      }
    </>
  );
};

export default ProposalDetails;

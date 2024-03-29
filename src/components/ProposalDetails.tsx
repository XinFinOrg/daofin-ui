import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Proposal } from "../utils/types";
import {
  Box,
  Flex,
  Text,
  Badge,
  Grid,
  GridItem,
  HStack,
  VStack,
} from "@chakra-ui/layout";
import { makeBlockScannerHashUrl, shortenAddress } from "../utils/networks";

import { useNetwork } from "../contexts/network";

import { Button } from "@chakra-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
} from "@chakra-ui/react";
import ProposalTypeBadge from "./ProposalTypeBadge";
import { IoShareSocial } from "react-icons/io5";
import { ArrowForwardIcon, InfoOutlineIcon, TimeIcon } from "@chakra-ui/icons";
import { useCommitteeUtils } from "../hooks/useCommitteeUtils";

import VotingStatsBox from "./VotingStatsBox";
import { BlockIcon } from "../utils/assets/icons";
import ProposalStatusStepper from "./ProposalStatusStepper";
import { WalletAddressCard } from "./WalletAddressCard";
import {
  timestampToStandardFormatString,
  toStandardTimestamp,
} from "../utils/date";
import useFetchVotersOnProposal from "../hooks/useFetchVotersOnProposal";
import { VoteOption } from "@xinfin/osx-daofin-sdk-client";
import { NoProposalIcon } from "../utils/assets/icons/NoProposalIcon";
import { useVoteContext } from "../contexts/voteContext";
import { DefaultBox } from "./Box";
import { ExecuteProposalButton, VoteButton } from "./Button/AuthorizedButton";
import { useExecuteProposalContext } from "../contexts/ExecuteProposalContext";
import ViewGrantProposalType from "./actions/views/ViewGrantProposalType";
import useFetchProposalStatus, {
  FetchProposalStatusType,
} from "../hooks/useFetchProposalStatus";
import { ExpandableText } from "./ExpandableText";
import { DefaultToolTip, InfoTooltip } from "./Tooltip";
import { DefaultButton } from "./Button";

const ProposalDetails: FC<{
  proposal: Proposal | undefined;
  isLoading: boolean;
}> = ({ proposal, isLoading }) => {
  const { network } = useNetwork();
  const { committeesListWithIcon } = useCommitteeUtils();

  const { handleToggleFormModal: onExecuteModalOpen } =
    useExecuteProposalContext();

  const { data: allVoters } = useFetchVotersOnProposal(
    proposal ? proposal.pluginProposalId : ""
  );

  const voteOptionsList = useMemo(
    () =>
      Object.entries(VoteOption)
        .filter(([_, value]) => isNaN(Number(value)))
        .slice(1),
    []
  );

  const [proposalStatus, setProposalStatus] =
    useState<FetchProposalStatusType>();
  const { makeCall } = useFetchProposalStatus();
  useEffect(() => {
    if (proposal?.pluginProposalId) {
      makeCall(proposal.pluginProposalId).then((data) => {
        setProposalStatus(data);
      });
    }
  }, [makeCall, proposal?.pluginProposalId]);
  const filterVotersList = useCallback(
    (tabCommittee: string) => {
      return allVoters.filter(({ committee }) => committee === tabCommittee);
    },
    [allVoters]
  );
  return (
    <>
      {
        <Box w={"full"}>
          <Grid templateColumns={"repeat(2, 1fr)"} gap={[4, 6]}>
            <GridItem colSpan={2}>
              <Skeleton isLoaded={!isLoading}>
                <DefaultBox w={"100%"}>
                  <Flex
                    justifyContent={"space-between"}
                    flexDirection={["column", "column", "row"]}
                  >
                    {proposal && proposal?.metadata && (
                      <Flex
                        flexDirection={"column"}
                        w={["100%", "100%", "50%"]}
                        mb={4}
                      >
                        <Box>
                          <ProposalTypeBadge title="Grant" />
                        </Box>
                        <Box my={"4"}>
                          <Text as={"h1"} fontSize={"xl"} fontWeight={"bold"}>
                            {proposal.metadata.title}
                          </Text>
                          <Text as={"h1"} fontSize={"sm"} fontWeight={"normal"}>
                            {proposal.metadata.summary}
                          </Text>
                        </Box>
                        <Flex
                          fontSize={"sm"}
                          justifyContent={"space-between"}
                          flexDirection={["column", "column", "row"]}
                          gap={1}
                        >
                          <Text>
                            Published By: {shortenAddress(proposal.creator)}
                          </Text>
                          <HStack>
                            <TimeIcon />
                            <Text>
                              {" "}
                              {timestampToStandardFormatString(
                                proposal.createdAt
                              )}
                            </Text>
                          </HStack>
                          <Text>
                            <InfoOutlineIcon mr={1} />
                            ID: {proposal.pluginProposalId}
                          </Text>
                          <HStack>
                            <IoShareSocial />
                            <Text>Share</Text>
                          </HStack>
                        </Flex>
                      </Flex>
                    )}

                    <Flex
                      alignItems={"center"}
                      gap={4}
                      w={["full", "full", "initial"]}
                    >
                      {proposal &&
                        proposal.pluginProposalId &&
                        !isLoading &&
                        proposalStatus && (
                          <>
                            <ProposalActionButtons
                              status={proposalStatus}
                              proposalId={proposal.pluginProposalId}
                            />
                            {/* <VoteButton
                            colorScheme="blue"
                            w={"full"}
                            status={proposalStatus}
                            onClick={handleToggleFormModal}
                            proposalId={proposal.pluginProposalId}
                          >
                            Vote Now
                          </VoteButton> */}

                            {/* <Box>
                            <ArrowForwardIcon />
                          </Box>

                          <ExecuteProposalButton
                            status={proposalStatus}
                            colorScheme="blue"
                            w={"full"}
                            onClick={onExecuteModalOpen}
                          >
                            Execute Now
                          </ExecuteProposalButton> */}
                          </>
                        )}

                      {/* {proposal && !isLoading && proposalStatus?.isOpen ? (
                        proposalStatus?.canExecute ? (
                          <WalletAuthorizedButton
                            colorScheme="blue"
                            w={"full"}
                            onClick={onExecuteModalOpen}
                          >
                            Execute Now
                          </WalletAuthorizedButton>
                        ) : (
                          <VoteButton
                            colorScheme="blue"
                            w={"full"}
                            onClick={handleToggleFormModal}
                          >
                            Vote Now
                          </VoteButton>
                        )
                      ) : proposalStatus?.executed ? (
                        <WalletAuthorizedButton isDisabled={true} w={"full"}>
                          Executed{" "}
                        </WalletAuthorizedButton>
                      ) : (
                        <WalletAuthorizedButton isDisabled={true} w={"full"}>
                          Vote{" "}
                        </WalletAuthorizedButton>
                      )} */}

                      {/* {proposal.executed && <CheckCircleIcon />} */}
                    </Flex>
                  </Flex>
                </DefaultBox>
              </Skeleton>
            </GridItem>
            <GridItem colSpan={[2, 2, 1]}>
              <Skeleton isLoaded={!isLoading} minH={"300px"} mb={6}>
                <GridItem mb={6} w="100%" h={"min-content"}>
                  <DefaultBox>
                    {proposal && <VotingStatsBox proposal={proposal} />}
                  </DefaultBox>
                </GridItem>
              </Skeleton>
              <GridItem colSpan={[2, 2, 1]} h={"min-content"} mb={6}>
                <Skeleton
                  isLoaded={!isLoading && !!proposalStatus}
                  minH={"250px"}
                >
                  <DefaultBox>
                    {proposalStatus && proposal && !isLoading && (
                      <ProposalStatusStepper
                        proposalId={proposal.pluginProposalId}
                        startDate={proposal.startDate}
                        endDate={proposal.endDate}
                        status={proposalStatus}
                        createdAt={toStandardTimestamp(proposal.createdAt)}
                      />
                    )}
                  </DefaultBox>
                </Skeleton>
              </GridItem>
              <GridItem colSpan={[2, 2, 1]}>
                <Skeleton isLoaded={!isLoading} minH={"200px"} mb={6}>
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
                    {proposal?.actions.map((item) => (
                      <ViewGrantProposalType {...item} />
                    ))}
                  </DefaultBox>
                </Skeleton>
              </GridItem>
            </GridItem>

            <GridItem colSpan={[2, 2, 1]}>
              <GridItem h={"min-content"} mb={6}>
                <Skeleton isLoaded={!isLoading} minH={"150px"} mb={6}>
                  <DefaultBox>
                    <HStack justifyContent={"space-between"} mb={"6"} p={"6"}>
                      <Text fontSize={"lg"} fontWeight={"bold"}>
                        Voter
                      </Text>
                    </HStack>
                    <Tabs isFitted>
                      <TabList
                        flexDirection={["column", "column", "row"]}
                        gap={4}
                      >
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
                                {`${name} (${filterVotersList(id).length})`}
                              </Text>
                            </HStack>
                          </Tab>
                        ))}
                      </TabList>

                      <TabPanels>
                        {committeesListWithIcon.map(({ id, name }) => (
                          <TabPanel p={"6"}>
                            <Tabs isFitted variant="soft-rounded">
                              <TabPanels>
                                {voteOptionsList.map(([key]) => (
                                  <TabPanel w={"full"} key={key}>
                                    <VStack spacing={"1"} alignItems={"start"}>
                                      {filterVotersList(id).length > 0 ? (
                                        filterVotersList(id).map(
                                          ({ voter, txHash }, index) => (
                                            <HStack w={"full"} key={index}>
                                              <WalletAddressCard
                                                address={voter}
                                              />
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
                                          )
                                        )
                                      ) : (
                                        <VStack alignSelf={"center"} p={6}>
                                          <NoProposalIcon />
                                          <Text>
                                            No {name} has voted yet! Be the
                                            first!
                                          </Text>
                                          {proposal && proposalStatus && (
                                            <VoteButton
                                              w={"full"}
                                              proposalId={
                                                proposal.pluginProposalId
                                              }
                                              expired={!proposalStatus?.isOpen}
                                              status={proposalStatus}
                                              variant={"outline"}
                                            >
                                              Vote now
                                            </VoteButton>
                                          )}
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
                </Skeleton>
              </GridItem>
              <GridItem colSpan={[2, 2, 1]} h={"fit-content"} mb={6}>
                <Skeleton isLoaded={!isLoading} minH={"100px"} mb={6}>
                  <DefaultBox>
                    <Text p={"5"} fontSize={"lg"} fontWeight={"bold"}>
                      Discussions & References
                    </Text>
                    <HStack p={"6"}>
                      {proposal?.metadata?.resources.map(({ name, url }) => (
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
                </Skeleton>
              </GridItem>
              <GridItem colSpan={[2, 2, 1]} rowSpan={0}>
                <Skeleton isLoaded={!isLoading} minH={"100px"} mb={6}>
                  <DefaultBox>
                    <Box p={"5"}>
                      <HStack alignItems={"baseline"}>
                        <Text mb={4} fontSize={"lg"} fontWeight={"bold"}>
                          Details
                        </Text>
                      </HStack>

                      {proposal?.metadata?.description && (
                        <ExpandableText text={proposal.metadata.description} />
                      )}
                    </Box>
                  </DefaultBox>
                </Skeleton>
              </GridItem>
            </GridItem>
          </Grid>
        </Box>
      }
    </>
  );
};

type ProposalActionButtonsProps = {
  status: FetchProposalStatusType;
  proposalId: string;
};

const ProposalActionButtons: FC<ProposalActionButtonsProps> = ({
  status,
  proposalId,
}) => {
  const { handleToggleFormModal } = useVoteContext();
  return (
    <Box>
      <VoteButton
        w={"full"}
        colorScheme="blue"
        status={status}
        expired={!status.isOpen}
        onClick={handleToggleFormModal}
        proposalId={proposalId}
      >
        Vote Now
      </VoteButton>
    </Box>
  );
};

export default ProposalDetails;

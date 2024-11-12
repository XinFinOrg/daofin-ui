import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Proposal, VoterOnProposal } from "../utils/types";
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
import {
  PeoplesHouseCommittee,
  convertCommitteeToPlainText,
  makeBlockScannerAddressUrl,
  makeBlockScannerHashUrl,
  shortenAddress,
} from "../utils/networks";
import { useNetwork } from "../contexts/network";
import {
  Button,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useBreakpoint,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import ProposalTypeBadge from "./Badge/ProposalTypeBadge";
import { IoRocketSharp, IoShareSocial } from "react-icons/io5";
import { ExternalLinkIcon, InfoOutlineIcon, TimeIcon } from "@chakra-ui/icons";
import { useCommitteeUtils } from "../hooks/useCommitteeUtils";

import VotingStatsBox from "./VotingStatsBox";
import { BlockIcon } from "../utils/assets/icons";
import ProposalStatusStepper from "./ProposalStatusStepper";
import { WalletAddressCard } from "./WalletAddressCard";
import {
  timestampToStandardFormatString,
  toNormalDate,
  toStandardFormatString,
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
import { VoteBadge } from "./Badge";
import ViewDecisionMakingTypeAction from "./actions/views/ViewDecisionMakingTypeAction";
import { formatEther } from "viem";
import { Modal } from "./Modal";
import { uuid } from "../utils/numbers";
import { useTranslation } from "react-i18next";

const ProposalDetails: FC<{
  proposal: Proposal | undefined;
  isLoading: boolean;
}> = ({ proposal, isLoading }) => {
  const { network } = useNetwork();
  const { committeesListWithIcon } = useCommitteeUtils();
  const [committeeNameInVotersBox, setCommitteeNameInVotersBox] =
    useState<string>(committeesListWithIcon[0].id);
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
  const { onClose, isOpen, onToggle } = useDisclosure();
  const handleToggleVotersModal = () => {
    onToggle();
  };
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
    (tabCommittee: string, sliceEndIndex?: number) => {
      const filterVotersByCommittee = allVoters.filter(
        ({ committee }) => committee === tabCommittee
      );

      return filterVotersByCommittee.slice(
        0,
        sliceEndIndex ? sliceEndIndex : filterVotersByCommittee.length
      );
    },
    [allVoters]
  );
  const breakpoint = useBreakpoint();
  const { t } = useTranslation();
  return (
    <>
      {
        <Grid maxW="full" templateColumns={"repeat(2, 1fr)"} gap={[4, 6]}>
          <GridItem colSpan={2}>
            <Skeleton isLoaded={!isLoading}>
              <DefaultBox>
                <Flex
                  justifyContent={"space-between"}
                  flexDirection={["column", "column", "row"]}
                  flexWrap={"wrap"}
                >
                  {proposal && proposal?.metadata && (
                    <Flex
                      flexDirection={"column"}
                      w={["100%", "100%", "60%"]}
                      flexWrap={"wrap"}
                      mb={4}
                    >
                      <Box>
                        <ProposalTypeBadge
                          id={proposal.proposalType.proposalTypeId}
                        />
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
                          {`${t("common.publishedBy")}: `}
                          <a
                            href={makeBlockScannerAddressUrl(
                              network,
                              proposal.creator
                            )}
                          >
                            {shortenAddress(proposal.creator)}
                          </a>
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
                        {proposal.executed && proposal.executionDate && (
                          <HStack>
                            <IoRocketSharp />
                            <Text>
                              {timestampToStandardFormatString(
                                proposal.executionDate.toString()
                              )}
                            </Text>
                          </HStack>
                        )}
                      </Flex>
                    </Flex>
                  )}

                  <Flex
                    alignItems={["center", "center", "flex-end", "flex-end"]}
                    gap={4}
                    my="auto"
                    flexDirection={["column"]}
                  >
                    {proposal &&
                      proposal.pluginProposalId &&
                      !isLoading &&
                      proposalStatus && (
                        <ProposalActionButtons
                          status={proposalStatus}
                          proposalId={proposal.pluginProposalId}
                        />
                      )}
                  </Flex>
                </Flex>
              </DefaultBox>
            </Skeleton>
          </GridItem>
          <GridItem colSpan={[2, 2, 2, 1]}>
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
                minH={"400px"}
              >
                <DefaultBox>
                  {proposalStatus && proposal && !isLoading && (
                    <ProposalStatusStepper
                      proposalId={proposal.pluginProposalId}
                      startDate={proposal.startDate}
                      endDate={proposal.endDate}
                      status={proposalStatus}
                      createdAt={toStandardTimestamp(proposal.createdAt)}
                      creationTxHash={proposal.creationTxHash}
                      executionDate={toStandardTimestamp(
                        proposal.executionDate
                      )}
                      executionTxHash={proposal.executionTxHash}
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
                      {t("common.executingActions")}
                    </Text>
                    <Text fontSize={"sm"} fontWeight={"normal"}>
                      {t("common.executingActionsDescription")}
                    </Text>
                  </Box>
                  {proposal?.actions.map((item) => (
                    <ViewGrantProposalType key={uuid()} {...item} />
                  ))}
                  {proposal?.actions.length === 0 && (
                    <ViewDecisionMakingTypeAction />
                  )}
                </DefaultBox>
              </Skeleton>
            </GridItem>
          </GridItem>

          <GridItem colSpan={[2, 2, 2, 1]} w={"full"}>
            <GridItem h={"min-content"} mb={6}>
              <Skeleton isLoaded={!isLoading} minH={"150px"} mb={6}>
                <DefaultBox>
                  <HStack justifyContent={"space-between"} mb={"6"} p={"6"}>
                    <Text fontSize={"lg"} fontWeight={"bold"}>
                      {t("common.voters")}
                    </Text>
                  </HStack>
                  <Tabs isFitted>
                    <TabList
                      // flexDirection={["column", "column", "row"]}
                      gap={4}
                    >
                      {committeesListWithIcon.map(({ Icon, id, name }) => (
                        <Tab
                          key={id}
                          onClick={() => setCommitteeNameInVotersBox(id)}
                        >
                          <HStack>
                            <Box w={"25px"} h={"25px"}>
                              {Icon && Icon}
                            </Box>
                            {(breakpoint === "2xl" ||
                              breakpoint === "xl" ||
                              breakpoint === "lg" ||
                              breakpoint === "md") && (
                              <Text
                                fontSize={"sm"}
                                fontWeight={"semibold"}
                                whiteSpace={"nowrap"}
                              >
                                {t(`community.${name.toLocaleLowerCase()}`)}
                              </Text>
                            )}
                            {/* <Text>( {filterVotersList(id).length} )</Text> */}
                          </HStack>
                        </Tab>
                      ))}
                    </TabList>

                    <TabPanels>
                      {committeesListWithIcon.map(({ id, name }) => (
                        <TabPanel p={["0", "6"]} key={id}>
                          <Tabs isFitted variant="soft-rounded">
                            <TabPanels>
                              {voteOptionsList.map(([key]) => (
                                <TabPanel w={"full"} key={key}>
                                  <VStack spacing={"1"} alignItems={"start"}>
                                    <VoterCards
                                      voters={filterVotersList(id, 5)}
                                    />
                                    <HStack
                                      justifyContent={"center"}
                                      w={"full"}
                                    >
                                      {filterVotersList(id).length === 0 && (
                                        <VStack alignItems={"center"}>
                                          <NoProposalIcon />
                                          <Text>
                                            No{" "}
                                            {convertCommitteeToPlainText(
                                              committeeNameInVotersBox
                                            )}{" "}
                                            has voted yet! Be the first!
                                          </Text>
                                        </VStack>
                                      )}
                                      {filterVotersList(id).length > 5 && (
                                        <Button
                                          variant={"link"}
                                          onClick={handleToggleVotersModal}
                                          textAlign={"center"}
                                        >
                                          {t("common.viewAll")}
                                        </Button>
                                      )}
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
                </DefaultBox>
              </Skeleton>
            </GridItem>
            <GridItem colSpan={[2, 2, 1]} h={"fit-content"} mb={6}>
              <Skeleton isLoaded={!isLoading} minH={"100px"} mb={6}>
                <DefaultBox>
                  <Text p={"5"} fontSize={"lg"} fontWeight={"bold"}>
                    {t("common.discussion&Links")}
                  </Text>
                  <HStack p={"6"}>
                    {proposal?.metadata?.resources.map(({ name, url }) => (
                      <a href={url} target="_blank">
                        <Badge
                          p={2}
                          borderRadius={"md"}
                          bgColor={["lightblue", "blue.400"]}
                          textColor={"white"}
                        >
                          {name} <ExternalLinkIcon />
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
                        {t("common.details")}
                      </Text>
                    </HStack>

                    {proposal?.metadata?.description ? (
                      <ExpandableText text={proposal.metadata.description} />
                    ) : (
                      <Text>Empty</Text>
                    )}
                  </Box>
                </DefaultBox>
              </Skeleton>
            </GridItem>
          </GridItem>
        </Grid>
      }
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        title={convertCommitteeToPlainText(committeeNameInVotersBox)}
        scrollBehavior="inside"
      >
        <VStack spacing={"1"} alignItems={"start"}>
          {filterVotersList(committeeNameInVotersBox).length > 0 ? (
            <VoterCards voters={filterVotersList(committeeNameInVotersBox)} />
          ) : (
            <VStack>
              <NoProposalIcon />
              <Text>
                No {convertCommitteeToPlainText(committeeNameInVotersBox)} has
                voted yet! Be the first!
              </Text>
            </VStack>
          )}
        </VStack>
      </Modal>
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
  const { handleToggleFormModal: handleExecute } = useExecuteProposalContext();
  const { t } = useTranslation();
  return (
    <>
      <VoteButton
        w={["200px", "300px", "200px"]}
        colorScheme="blue"
        status={status}
        expired={!status.isOpen}
        onClick={handleToggleFormModal}
        proposalId={proposalId}
      >
        {t("common.vote")}
      </VoteButton>
      <ExecuteProposalButton
        w={["200px", "300px", "200px"]}
        colorScheme="green"
        status={status}
        onClick={handleExecute}
      >
        {t("common.execute")}
      </ExecuteProposalButton>
    </>
  );
};
const VoterCards: FC<{ voters: VoterOnProposal[] }> = ({ voters }) => {
  const { network } = useNetwork();
  const abstain = useColorModeValue("#D7DEE4", "#151F29");
  const yes = useColorModeValue("#BFEED1", "#04AA46");
  const no = useColorModeValue("#FAD6D6", "#ad2727");
  const mapOptionToColor = (option: number) => {
    switch (option) {
      case 1:
        return abstain;
      case 2:
        return yes;
      case 3:
        return no;

      default:
        break;
    }
  };
  return (
    <VStack spacing={"1"} alignItems={"start"} w={"full"}>
      {voters.length > 0 ? (
        voters.map(({ voter, txHash, option }, index) => (
          <HStack w={"full"} key={index} position={"relative"}>
            <WalletAddressCard address={voter} />
            {/* <VoteBadge option={option} /> */}
            <Box
              position="absolute"
              top="0"
              width="10px"
              height="100%"
              borderTopLeftRadius={"3px"}
              borderBottomLeftRadius={"3px"}
              bg={mapOptionToColor(option)}
            />
            <a href={makeBlockScannerHashUrl(network, txHash)} target="_blank">
              <BlockIcon w={"5"} h={"5"} />
            </a>
          </HStack>
        ))
      ) : (
        <VStack alignSelf={"center"} p={6}></VStack>
      )}
    </VStack>
  );
};

export default ProposalDetails;

import { FC, useCallback, useEffect, useMemo, useState } from "react";
import DaoHeader from "../components/DaoHeader";
import { styled } from "styled-components";
import useDaoProposals from "../hooks/useDaoProposals";
import { useClient } from "../hooks/useClient";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import PeoplesHouseDeposits from "../components/PeoplesHouseDeposits";
import usePeoplesHouseDeposits from "../hooks/useDeposits";
import {
  CHAIN_METADATA,
  getPluginInstallationId,
  makeBlockScannerHashUrl,
  shortenAddress,
  shortenTxHash,
} from "../utils/networks";
import { Box } from "@chakra-ui/layout";
import ManageJudiciary from "../components/ManageJudiciary";
import ManageMasterNodeDelegatee from "../components/ManageMasterNodeDelegatee";
import WrongNetwork from "../components/WrongNetwork";

import {
  Button,
  useDisclosure,
  VStack,
  Text,
  Badge,
  HStack,
  Flex,
  Container,
  useColorModeValue,
  Skeleton,
  IconButton,
  Divider,
} from "@chakra-ui/react";
import { Modal, Page } from "../components";
import { v4 as uuid } from "uuid";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Proposals from "../components/Proposals";
import CommunityCards from "../components/CommunityCards";
import { useCommitteeUtils } from "../hooks/useCommitteeUtils";
import {
  ArrowForwardIcon,
  CheckCircleIcon,
  CheckIcon,
  ExternalLinkIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import { zeroAddress } from "viem";
import { IoBarChart } from "react-icons/io5";
import useFetchDaoBalance from "../hooks/useFetchDaoBalance";
import { weiBigNumberToFormattedNumber } from "../utils/numbers";
import { fetchTokenPrice } from "../services/prices";
import { useNetwork } from "../contexts/network";
import { EmptyBoxIcon } from "../utils/assets/icons/EmptyBoxIcon";
import CoinIcon from "../utils/assets/icons/CoinIcon";
import { WalletAuthorizedButton } from "../components/Button/AuthorizedButton";
import { DefaultBox } from "../components/Box";
import AddFundButton, { AddFund } from "../components/Button/AddFundButton";
import {
  proposalTimeStatus,
  timestampToStandardFormatString,
  toNormalDate,
  toStandardFormatString,
} from "../utils/date";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { jsNumberForAddress } from "react-jazzicon";
import useFetchProposalStatus from "../hooks/useFetchProposalStatus";
import { DarkGrayBox, DefaultBoxProps, WhiteBox } from "../components/Box/DefaultBox";
import {
  ReadyToExecuteProposalType,
  ReadyToExecuteProposals,
} from "../components/ReadyToExecuteProposal";
import { Proposal } from "../utils/types";
import useFetchPluginProposalTypeDetails from "../hooks/useFetchPluginProposalTypeDetails";
import useDaoElectionPeriods from "../hooks/useDaoElectionPeriods";
import { toDate } from "date-fns";
import ProposalStatusBadge from "../components/ProposalStatusBadge";

const Dashboard: FC = () => {
  const navigate = useNavigate();
  const { daoAddress, pluginAddress } = useAppGlobalConfig();
  const {
    data: proposals,
    error,
    isLoading,
  } = useDaoProposals(daoAddress, pluginAddress);

  const { isOpen, onClose, onToggle } = useDisclosure();
  const { data: nativeBalanceOfDao, isLoading: isLoadingNativeBalanceOfDao } =
    useFetchDaoBalance();
  const [proposalTypes, setProposalTypes] = useState([
    {
      id: uuid(),
      name: "Grant",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      isComingSoon: false,
      proposalId: 0,
    },
    {
      id: uuid(),
      name: "Update Settings",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      isComingSoon: true,
    },
    {
      id: uuid(),
      name: "Modify Voting Period",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      isComingSoon: true,
    },
  ]);
  const { committeesListWithIcon } = useCommitteeUtils();
  const { network } = useNetwork();
  const executedProposals = useMemo(
    () => proposals.filter(({ executed }) => executed),
    [proposals]
  );
  const { makeCall } = useFetchProposalStatus();

  const [readyToExecutedProposals, setReadyToExecutedProposals] =
    useState<Proposal[]>();

  const readyToExecutedProposalsCallback = useCallback(
    async () =>
      Promise.all(
        proposals.map(async (item) => {
          const { executed, pluginProposalId } = item;
          const { canExecute } = await makeCall(pluginProposalId);
          // console.log("1", canExecute && !executed);
          // console.log("2", canExecute, !executed);

          return {
            ...item,
            canExecute,
          };
        })
      ),
    [proposals, makeCall]
  );
  useEffect(() => {
    readyToExecutedProposalsCallback().then((data) => {
      setReadyToExecutedProposals([
        ...data.filter(({ canExecute, executed }) => canExecute && !executed),
      ]);
    });
  }, [readyToExecutedProposalsCallback]);
  const onHoverBgColor = useColorModeValue("#D7DEE4", "#1F2E3D");

  const periods = useDaoElectionPeriods();

  return (
    <Page>
      <HStack mb={2}>
        <IoBarChart />

        <Text fontWeight={"semibold"} fontSize={"lg"}>
          Overview
        </Text>
      </HStack>
      <Flex
        w="full"
        mx="auto"
        mb={2}
        flexDirection={["column", "column", "column", "row"]}
        justifyContent={"space-between"}
      >
        <Skeleton
          isLoaded={!isLoading}
          mr={4}
          mb={2}
          w={["100%", "100%", "100%", "50%"]}
        >
          <DefaultBox>
            <HStack justifyContent={"space-between"}>
              <VStack alignItems={"flex-start"}>
                <Text fontSize="sm" fontWeight={"normal"}>
                  Total Proposals
                </Text>

                <Text fontSize="large" fontWeight={"bold"}>
                  {proposals.length}
                </Text>
              </VStack>
              <Box>
                <WalletAuthorizedButton
                  variant="outline"
                  onClick={() => onToggle()}
                >
                  New Proposal
                </WalletAuthorizedButton>
              </Box>
            </HStack>
          </DefaultBox>
        </Skeleton>
        <Skeleton
          isLoaded={!isLoadingNativeBalanceOfDao}
          w={["100%", "100%", "100%", "50%"]}
          mb={2}
        >
          <DefaultBox>
            <HStack justifyContent={"space-between"}>
              <VStack alignItems={"flex-start"}>
                <Text fontSize="sm" fontWeight={"normal"}>
                  Balance in Treasury
                </Text>
                <Text fontSize="large" fontWeight={"bold"}>
                  {nativeBalanceOfDao
                    ? weiBigNumberToFormattedNumber(nativeBalanceOfDao)
                    : 0}{" "}
                  {CHAIN_METADATA[network].nativeCurrency.symbol}
                </Text>
              </VStack>
              <Box>
                <AddFund />
                {/* <AddFundButton variant="outline">+ Add fund</AddFundButton> */}
              </Box>
            </HStack>
          </DefaultBox>
        </Skeleton>
      </Flex>

      <Flex mb={1}>
        <CommunityCards />
      </Flex>
      <Box mb={4}>
        <HStack mb={2}>
          <Text fontWeight={"semibold"} fontSize={"lg"}>
            Election Periods
          </Text>
        </HStack>
        <VStack w={["full", "full", "50%"]} alignItems={"flex-start"}>
          {periods?.map(({ startDate, endDate }, index) => (
            <WhiteBox key={uuid()} p={2} w="full">
              <Flex
                w={"full"}
                justifyContent="flex-start"
                alignItems={"center"}
                textAlign={"center"}
                mb={1}
                fontSize={["xs", "xs", "xs", "sm"]}
              >
                <Text p={"1"}>{index + 1}- </Text>
                <HStack
                  margin={"1"}
                  p={"1"}
                  maxW={"40%"}
                  borderRadius="md"
                  justifyContent={"flex-start"}
                  flexDirection={["column", "column", "row"]}
                >
                  <Text fontWeight={"semibold"}>
                    {toStandardFormatString(toDate(startDate))}
                  </Text>
                </HStack>
                <Box>
                  <ArrowForwardIcon />
                </Box>
                <HStack
                  margin={"1"}
                  p={"1"}
                  borderRadius="md"
                  justifyContent={"center"}
                  flexDirection={["column", "column", "row"]}
                >
                  <Text fontWeight={"semibold"}>
                    {toStandardFormatString(toDate(endDate))}
                  </Text>
                </HStack>
                <Box>
                  <ProposalStatusBadge
                    variant={"subtle"}
                    title={proposalTimeStatus(
                      toDate(startDate),
                      toDate(endDate)
                    )}
                  />
                </Box>
              </Flex>
            </WhiteBox>
          ))}
        </VStack>
      </Box>

      <Flex
        mb={4}
        justifyContent={"space-between"}
        flexDirection={["column", "column", "column", "row"]}
      >
        <Box w={["100%", "100%", "100%", "60%"]} mr={"6"}>
          <Text fontSize={"lg"} fontWeight={"semibold"} mb={"2"}>
            🔥 Ready to Execute
          </Text>
          {/* <DefaultBox borderStyle={"dashed"}>  */}
          <VStack
            alignItems={"flex-start"}
            flexDirection={["column", "column", "column", "row"]}
          >
            <Skeleton
              isLoaded={!isLoading && !!readyToExecutedProposals}
              minH={"50px"}
              w={["full"]}
            >
              {readyToExecutedProposals && (
                <ReadyToExecuteProposals data={readyToExecutedProposals} />
              )}
            </Skeleton>
          </VStack>
          {/* </DefaultBox> */}
        </Box>
        <Box w={["100%", "100%", "100%", "40%"]}>
          <Text fontSize={"lg"} fontWeight={"semibold"} mb={"2"}>
            ✅ Executed Proposals
          </Text>
          {/* <DefaultBox borderStyle={"dashed"} w={"full"}> */}
          <HStack justifyContent={"space-between"}>
            <Skeleton isLoaded={!isLoading} minH={"50px"} w={"full"}>
              {executedProposals.length > 0 ? (
                executedProposals.map(
                  ({
                    executed,
                    executionTxHash,
                    executionBlockNumber,
                    creationTxHash,
                    pluginProposalId,
                    executionDate,
                    executedBy,
                    metadata,
                  }) => (
                    <GreenDefaultBox w={"full"} mb={2}>
                      <HStack
                        flexDirection={["column", "row"]}
                        alignItems={"flex-start"}
                      >
                        <Box minW={"20px"}>
                          <Jazzicon
                            diameter={40}
                            seed={jsNumberForAddress(creationTxHash)}
                          />
                        </Box>
                        <VStack alignItems={"flex-start"}>
                          <Text as={"h1"} fontSize={"sm"} fontWeight={"bold"}>
                            {metadata.title}
                          </Text>
                          <HStack
                            justifyContent={"space-between"}
                            flexDirection={["column", "row"]}
                            alignItems={"flex-start"}
                          >
                            <Text fontSize={"xs"}>
                              <TimeIcon mr={"1"} />
                              {timestampToStandardFormatString(executionDate)}
                            </Text>
                            <Text fontSize={"xs"}>ID: {pluginProposalId}</Text>
                            <Text fontSize={"xs"}>
                              <CheckCircleIcon color={"green"} mr={"1"} />
                              Hash: {shortenTxHash(executionTxHash)}{" "}
                              <a
                                target="_blank"
                                href={makeBlockScannerHashUrl(
                                  network,
                                  executionTxHash
                                )}
                              >
                                <ExternalLinkIcon />
                              </a>
                            </Text>
                          </HStack>
                        </VStack>
                        <IconButton
                          aria-label=""
                          variant={"unstyled"}
                          flexGrow={1}
                          textAlign={"end"}
                          icon={<ArrowForwardIcon color={"black"} />}
                          onClick={() => {
                            navigate(`/proposals/${pluginProposalId}/details`);
                          }}
                        />
                      </HStack>
                    </GreenDefaultBox>
                  )
                )
              ) : (
                <DefaultBox
                  textAlign={"center"}
                  borderStyle={"dashed"}
                  w={"full"}
                  mb={2}
                >
                  <Text fontSize={"xs"} fontWeight={"500"} opacity={"0.5"}>
                    {"There is no proposal yet."}
                  </Text>
                </DefaultBox>
              )}
            </Skeleton>
          </HStack>
          {/* </DefaultBox> */}
        </Box>
      </Flex>

      <VStack w={"full"}>
        <Text
          alignSelf={"flex-start"}
          fontSize={"lg"}
          fontWeight={"semibold"}
          mb={"2"}
        >
          Most Recent Proposals
        </Text>
        <Flex justifyContent={"center"} w={"full"}>
          <Box w={"full"}>{<Proposals proposals={proposals} />}</Box>
        </Flex>
        <Link to={"/proposals"}>
          <Button variant={"link"}>
            View all proposals <ArrowForwardIcon />
          </Button>
        </Link>
      </VStack>
      {isOpen && (
        <Modal
          title="What would like to propose?"
          isOpen={isOpen}
          onClose={onClose}
          size="sm"
        >
          <VStack w={"full"}>
            {proposalTypes.map(
              ({ name, description, isComingSoon, id, proposalId }) => (
                <Box key={uuid()}>
                  <Flex
                    _hover={{
                      bgColor: onHoverBgColor,
                    }}
                    transition={"ease-in background-color .1s"}
                    borderRadius={"md"}
                    direction={"column"}
                    p={2}
                    mb={2}
                    cursor={!isComingSoon ? "pointer" : "not-allowed"}
                    w={"full"}
                    onClick={() => {
                      if (isComingSoon) return;
                      navigate(`/create/${proposalId}`);
                    }}
                  >
                    <Text fontWeight={"bold"}>
                      {name} {isComingSoon && <Badge>Coming Soon</Badge>}
                    </Text>

                    <Text fontSize={"sm"}>{description}</Text>
                  </Flex>
                  <Divider />
                </Box>
              )
            )}
          </VStack>
        </Modal>
      )}
    </Page>
  );
};
const GreenDefaultBox: FC<DefaultBoxProps> = (props) => {
  return (
    <Box
      bgColor={useColorModeValue("#BFEED1", "#02441C")}
      p={"6"}
      borderRadius={"lg"}
      border={"1px"}
      borderColor={useColorModeValue("#D7DEE4", "#1F2E3D")}
      boxShadow={"sm"}
      {...props}
    >
      {props.children}
    </Box>
  );
};
export default Dashboard;

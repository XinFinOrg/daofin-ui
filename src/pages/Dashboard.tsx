import { FC, useCallback, useEffect, useMemo, useState } from "react";
import useDaoProposals from "../hooks/useDaoProposals";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import {
  CHAIN_METADATA,
  makeBlockScannerHashUrl,
  shortenTxHash,
} from "../utils/networks";
import { Box } from "@chakra-ui/layout";

import {
  Button,
  useDisclosure,
  VStack,
  Text,
  Badge,
  HStack,
  Flex,
  useColorModeValue,
  Skeleton,
  IconButton,
  Divider,
  useColorMode,
} from "@chakra-ui/react";
import { Modal, Page } from "../components";
import { v4 as uuid } from "uuid";
import { Link, useNavigate } from "react-router-dom";
import Proposals from "../components/Proposals";
import CommunityCards from "../components/CommunityCards";
import {
  ArrowForwardIcon,
  CheckCircleIcon,
  ExternalLinkIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import { IoBarChart } from "react-icons/io5";
import useFetchDaoBalance from "../hooks/useFetchDaoBalance";
import { weiBigNumberToFormattedNumber } from "../utils/numbers";
import { useNetwork } from "../contexts/network";
import { WalletAuthorizedButton } from "../components/Button/AuthorizedButton";
import { DefaultBox } from "../components/Box";
import { AddFund } from "../components/Button/AddFundButton";
import {
  proposalTimeStatus,
  timestampToStandardFormatString,
  toStandardFormatString,
} from "../utils/date";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { jsNumberForAddress } from "react-jazzicon";
import useFetchProposalStatus from "../hooks/useFetchProposalStatus";
import { DefaultBoxProps, WhiteBox } from "../components/Box/DefaultBox";
import { ReadyToExecuteProposals } from "../components/ReadyToExecuteProposal";
import { Proposal } from "../utils/types";
import useDaoElectionPeriods from "../hooks/useDaoElectionPeriods";
import { toDate } from "date-fns";
import ProposalStatusBadge from "../components/Badge/ProposalStatusBadge";
import ElectionPeriods from "../components/ElectionPeriods";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import { PROPOSAL_TYPES } from "../utils/constants";
import { useContractEvent } from "wagmi";
import { DefaultButton } from "../components/Button";
import { useTranslation } from "react-i18next";

const Dashboard: FC = () => {
  const navigate = useNavigate();
  const { daoAddress, pluginAddress } = useAppGlobalConfig();
  const { data: proposals, isLoading } = useDaoProposals(
    daoAddress,
    pluginAddress
  );

  const { isOpen, onClose, onToggle } = useDisclosure();
  const { data: nativeBalanceOfDao, isLoading: isLoadingNativeBalanceOfDao } =
    useFetchDaoBalance();
  const [proposalTypes] = useState(PROPOSAL_TYPES);
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
          const { pluginProposalId } = item;
          // const status = await makeCall(pluginProposalId);
          return {
            ...item,
            // canExecute: status?.canExecute,
          };
        })
      ),
    [proposals, makeCall]
  );
  useEffect(() => {
    readyToExecutedProposalsCallback().then((data) => {
      setReadyToExecutedProposals([
        ...data
          .slice(-3)
          .filter(({ canExecute, executed }) => canExecute && !executed),
      ]);
    });
  }, [readyToExecutedProposalsCallback, network]);
  const onHoverBgColor = useColorModeValue("#D7DEE4", "#1F2E3D");

  const { data: periods, isLoading: isLoadingPeriods } =
    useDaoElectionPeriods();
  const { colorMode } = useColorMode();
  const { t } = useTranslation();

  return (
    <Page title="Dashboard">
      <HStack mb={2}>
        <IoBarChart />

        <Text fontWeight={"semibold"} fontSize={"lg"}>
          {t("dashboard.overview")}
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
                  {t("dashboard.totalProposals")}
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
                  {t("dashboard.newProposal")}
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
                  {t("dashboard.balanceInTreasury")}
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
              </Box>
            </HStack>
          </DefaultBox>
        </Skeleton>
      </Flex>

      <Flex mb={1}>
        <CommunityCards />
      </Flex>
      <Flex flexDirection={["column", "column", "column", "row"]} gap={4}>
        <Box mb={4} w={["full", "full", "full"]}>
          <ElectionPeriods isLoading={isLoadingPeriods} periods={periods} />
        </Box>
      </Flex>

      <Flex
        mb={4}
        justifyContent={"space-between"}
        flexDirection={["column", "column", "column", "row"]}
      >
        <Box w={["100%", "100%", "100%", "60%"]} mr={"6"}>
          <Text fontSize={"lg"} fontWeight={"semibold"} mb={"2"}>
            🔥 {t("common.readytoexecute")}
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
            ✅ {t("common.executedProposals")}
          </Text>
          {/* <DefaultBox borderStyle={"dashed"} w={"full"}> */}
          <HStack justifyContent={"space-between"}>
            <Skeleton isLoaded={!isLoading} minH={"50px"} w={"full"}>
              {executedProposals.length > 0 ? (
                executedProposals
                  .slice(-3)
                  .map(
                    ({
                      executionTxHash,
                      creationTxHash,
                      pluginProposalId,
                      executionDate,
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
                              <Text fontSize={"xs"}>
                                ID: {pluginProposalId}
                              </Text>
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
                            icon={
                              <ArrowForwardIcon
                                color={colorMode == "dark" ? "white" : "black"}
                              />
                            }
                            onClick={() => {
                              navigate(
                                `/proposals/${pluginProposalId}/details`
                              );
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
                    {t("common.thereIsNoProposalYet")}
                  </Text>
                </DefaultBox>
              )}
            </Skeleton>
          </HStack>
          {/* </DefaultBox> */}
        </Box>
      </Flex>

      <VStack w={"full"}>
        <HStack justifyContent={"space-between"} w={"full"}>
          <Text
            alignSelf={"flex-start"}
            fontSize={"lg"}
            fontWeight={"semibold"}
            mb={"2"}
          >
            {t("common.mostRecentProposals")}
          </Text>
          <Link to={"/proposals"}>
            <DefaultButton variant={"link"} size={"sm"}>
            {t("common.viewAll")} <ArrowForwardIcon />
            </DefaultButton>
          </Link>
        </HStack>
        <Flex justifyContent={"center"} w={"full"}>
          <Box w={"full"}>{<Proposals proposals={proposals} />}</Box>
        </Flex>
      </VStack>
      {isOpen && (
        <Modal
          title={t("dashboard.whatToPropose")}
          isOpen={isOpen}
          onClose={onClose}
          size="sm"
        >
          <VStack w={"full"}>
            {proposalTypes.map(
              ({ name, description, isComingSoon, proposalId }) => (
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
                      navigate(
                        `/proposals/create/${name
                          .split(" ")
                          .join("-")
                          .toLocaleLowerCase()}`
                      );
                    }}
                  >
                    <Text fontWeight={"bold"}>
                      {t(`proposalTypes.${name.toLocaleLowerCase()}.name`)}{" "}
                      {isComingSoon && <Badge>Coming Soon</Badge>}
                    </Text>

                    <Text fontSize={"sm"}>
                      {t(
                        `proposalTypes.${name.toLocaleLowerCase()}.description`
                      )}
                    </Text>
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

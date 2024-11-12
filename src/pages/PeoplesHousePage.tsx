import { CHAIN_METADATA, PeoplesHouseCommittee } from "../utils/networks";
import usePeoplesHouseDeposits from "../hooks/useDeposits";
import { useNetwork } from "../contexts/network";
import { useClient } from "../hooks/useClient";
import { FC, useEffect, useMemo, useState } from "react";
import { Box, HStack, VStack } from "@chakra-ui/layout";
import {
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Modal, Page } from "../components";
import JudiciariesIcon from "../utils/assets/icons/JudiciariesIcon";
import { WalletAddressCardWithBalance } from "../components/WalletAddressCard";
import {
  PeoplesHouseProvider,
  usePeopleHouseContext,
} from "../contexts/PeoplesHouseContext";
import { Formik } from "formik";
import {
  numberWithCommaSeparate,
  weiBigNumberToFormattedNumber,
} from "../utils/numbers";
import { BigNumber } from "ethers";
import useFetchTotalNumbersByCommittee from "../hooks/useFetchTotalNumbersByCommittee";
import { EmptyBoxIcon } from "../utils/assets/icons/EmptyBoxIcon";
import {
  PeopleButton,
  WalletAuthorizedButton,
} from "../components/Button/AuthorizedButton";
import { DefaultBox } from "../components/Box";
import RulesOfDecisions from "../components/RulesOfDecisions";
import useFetchPluginProposalTypeDetails from "../hooks/useFetchPluginProposalTypeDetails";
import { DefaultAlert } from "../components/Alerts";
import PeopleHouseIcon from "../utils/assets/icons/PeopleHouseIcon";
import { JoinHouseFormSchema } from "../schemas/joinHouse";
import useGetHouseDepositInfo from "../hooks/useGetHouseDepositInfo";
import { useWallet } from "../hooks/useWallet";
import { ViewGrantProposalType } from "../components/actions";
import { DefaultButton } from "../components/Button";
import {
  Address,
  useContractWrite,
  useWaitForTransaction,
  useWalletClient,
} from "wagmi";
import { DaofinABI } from "../utils/abis/daofin.abi";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import {
  appFormatDistance,
  toDate,
  toNormalDate,
  toStandardTimestamp,
} from "../utils/date";
import Countdown from "react-countdown";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { formatEther } from "viem";
import useIsWithinVotingPeriod from "../hooks/contractHooks/useIsWithinVotingPeriod";
import useDaoGlobalSettings from "../hooks/useDaoGlobalSettings";
import { useTranslation } from "react-i18next";
export type JoinHouseFormType = {
  amount: string;
};
const PeoplesHousePage = () => {
  // const { address: voterAddress } = useWallet();

  const {} = useClient();
  const { network } = useNetwork();
  console.log({network});
  
  // const isUserDeposited = useIsUserDeposited(voterAddress ? voterAddress : "");
  // const isJudiciaryMember = useIsJudiciaryMember(
  //   voterAddress ? voterAddress : ""
  // );
  const totalSupply = useFetchTotalNumbersByCommittee(PeoplesHouseCommittee);

  const { data: deposits } = usePeoplesHouseDeposits();
  const activeDeposits = useMemo(
    () => deposits.filter(({ isActive }) => isActive),
    [deposits]
  );

  const freezedDeposits = useMemo(
    () =>
      deposits.filter(
        ({ isActive, requestToResignTimestamp }) =>
          !isActive && toStandardTimestamp(requestToResignTimestamp.toString())
      ),
    [deposits]
  );
  const totalDeposits = useMemo(
    () =>
      deposits && deposits.length > 0
        ? deposits.reduce((acc, { amount }) => {
            return BigNumber.from(amount).add(acc);
          }, BigNumber.from(0))
        : BigNumber.from(0),
    []
  );
  const communityName = PeoplesHouseCommittee;

  const { data: proposalTypes } = useFetchPluginProposalTypeDetails();
  const { data: setting } = useDaoGlobalSettings();
  const { t } = useTranslation();
  return (
    <Page title="House">
      <Formik
        initialValues={{
          amount: 0,
        }}
        validationSchema={JoinHouseFormSchema}
        validateOnChange={true}
        onSubmit={() => {}}
      >
        <>
          <PeoplesHouseProvider>
            <PeoplesHouseHeader
              totalMembers={activeDeposits ? activeDeposits.length : 0}
              totalDeposits={weiBigNumberToFormattedNumber(totalDeposits)}
              totalSupply={totalSupply ? totalSupply.toString() : "0"}
              houseMinAmount={
                setting ? BigInt(setting.houseMinAmount.toString()) : 0n
              }
            />
          </PeoplesHouseProvider>
        </>
      </Formik>
      <HStack flexDirection={["column", "column", "row"]}>
        <Box
          w={["full", "full", "full", "60%"]}
          alignSelf={"flex-start"}
          mr={0}
        >
          <Tabs variant="soft-rounded" colorScheme="blue">
            <TabList>
              <Tab>{t("common.active")}</Tab>
              <Tab>Freezed</Tab>
            </TabList>
            <TabPanels>
              <TabPanel pl={0}>
                <DefaultBox w={"full"}>
                  <VStack>
                    {activeDeposits && activeDeposits.length > 0 ? (
                      activeDeposits.map(({ amount, voter, txHash }) => (
                        <WalletAddressCardWithBalance
                          address={voter}
                          txHash={txHash}
                          balance={weiBigNumberToFormattedNumber(amount)}
                          symbol={CHAIN_METADATA[network].nativeCurrency.symbol}
                        />
                      ))
                    ) : (
                      <DefaultBox w={"full"}>
                        <VStack alignItems="center" alignSelf={"center"}>
                          <EmptyBoxIcon />
                          <Text
                            fontSize={"xs"}
                            fontWeight={"500"}
                            opacity={"0.5"}
                          >
                            {"There is no member yet."}
                          </Text>
                        </VStack>
                      </DefaultBox>
                    )}
                  </VStack>
                </DefaultBox>
              </TabPanel>
              <TabPanel>
                <DefaultBox w={"full"}>
                  <VStack>
                    {freezedDeposits && freezedDeposits.length > 0 ? (
                      freezedDeposits.map(({ amount, voter, txHash }) => (
                        <WalletAddressCardWithBalance
                          address={voter}
                          txHash={txHash}
                          balance={weiBigNumberToFormattedNumber(amount)}
                          symbol={CHAIN_METADATA[network].nativeCurrency.symbol}
                        />
                      ))
                    ) : (
                      <DefaultBox w={"full"}>
                        <VStack alignItems="center" alignSelf={"center"}>
                          <EmptyBoxIcon />
                          <Text
                            fontSize={"xs"}
                            fontWeight={"500"}
                            opacity={"0.5"}
                          >
                            {"There is no member yet."}
                          </Text>
                        </VStack>
                      </DefaultBox>
                    )}
                  </VStack>
                </DefaultBox>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
        <VStack w={["full", "full", "full", "40%"]}>
          <Box w={["full"]}>
            {proposalTypes && proposalTypes?.length > 0 && (
              <DefaultBox alignSelf={"flex-start"}>
                <RulesOfDecisions
                  communityName={communityName}
                  summary={"All below info demostrate how voting rules work."}
                  proposalTypes={proposalTypes}
                />
              </DefaultBox>
            )}
          </Box>
          <Box w={["full"]}>
            <Resignation />
          </Box>
        </VStack>
      </HStack>
    </Page>
  );
};

interface PeoplesHouseHeaderType {
  totalMembers: number;
  totalDeposits: string;
  totalSupply: string;
  houseMinAmount: bigint;
}
const PeoplesHouseHeader: FC<PeoplesHouseHeaderType> = ({
  totalMembers,
  totalDeposits,
  totalSupply,
  houseMinAmount,
}) => {
  const { handleToggleFormModal } = usePeopleHouseContext();
  const { network } = useNetwork();
  const { t } = useTranslation();
  return (
    <>
      <DefaultBox mb={4}>
        <VStack w={"full"}>
          <HStack
            justifyContent={"space-between"}
            w={"full"}
            mb={4}
            flexDirection={["column", "column", "column", "row"]}
          >
            <Box>
              <HStack>
                <Box w={["60px", "50px"]} flexShrink={1}>
                  <PeopleHouseIcon />
                </Box>
                <Box>
                  <Text fontSize={["lg", "xl"]} fontWeight={"bold"}>
                    {" "}
                    {t("community.house")}
                  </Text>
                  <Text fontSize={"xs"}>{t("community.houseDesc")}</Text>
                </Box>
              </HStack>
            </Box>
            <Box w={["full", "full", "fit-content"]}>
              <PeopleButton
                colorScheme="blue"
                w={["full", "full", "inherit"]}
                onClick={handleToggleFormModal}
              >
                {t("community.joinHouse")}
              </PeopleButton>
            </Box>
          </HStack>
          <HStack
            justifyContent={"space-between"}
            w={"full"}
            flexDirection={["column", "column", "column", "row"]}
          >
            <HStack
              w={["full", "full", "60%"]}
              justifyContent={"flex-start"}
              flexDirection={["column", "column", "column", "row"]}
            >
              <DefaultBox w={["full", "full", "full", "full", "33%"]}>
                <VStack
                  alignSelf={"normal"}
                  alignItems={"flex-start"}
                  justifyContent={"center"}
                >
                  <Text>{t("community.totalSupply")}</Text>
                  <Text
                    fontSize={"lg"}
                    fontWeight={"bold"}
                    whiteSpace={"nowrap"}
                  >
                    {numberWithCommaSeparate(totalSupply)}{" "}
                    {CHAIN_METADATA[network].nativeCurrency.symbol}
                  </Text>
                </VStack>
              </DefaultBox>{" "}
              <DefaultBox
                w={["full", "full", "full", "full", "33%"]}
                alignSelf={"normal"}
              >
                <VStack
                  fontSize={"sm"}
                  alignItems={"flex-start"}
                  justifyContent={"center"}
                >
                  <Text>{t("community.houseMembers")}</Text>
                  <Text fontSize={"lg"} fontWeight={"bold"}>
                    {numberWithCommaSeparate(totalMembers)}
                  </Text>
                </VStack>
              </DefaultBox>
            </HStack>

            <DefaultAlert w={["full", "full", "full", "40%"]}>
              <Box fontSize={"sm"}>
                <Text fontWeight={"semibold"}>
                  {t("community.howDoesHouseWork")}
                </Text>
                <Text>
                  {t("community.howDoesHouseWorkDesc")}
                  <Text fontWeight={"500"}>
                    {t("community.minAmountHouse")}{" "}
                    {`${numberWithCommaSeparate(formatEther(houseMinAmount))} ${
                      CHAIN_METADATA[network].nativeCurrency.symbol
                    }`}
                  </Text>{" "}
                </Text>
              </Box>
            </DefaultAlert>
          </HStack>
        </VStack>
      </DefaultBox>
    </>
  );
};
const Resignation = () => {
  const { address: connectedWalletAddress } = useWallet();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [modalData, setModalData] = useState({
    title: "Resignation",
    imageWarning: false,
    imageSubTitle: "",
    imageAmount: "",
  });

  const { data: connectedWalletDepositInfo } = useGetHouseDepositInfo();
  const { data: isWithinVotingPeriod } = useIsWithinVotingPeriod();

  const doesHaveDeposit = connectedWalletDepositInfo.amount > 0n;
  const isReadyToRequest =
    !isWithinVotingPeriod &&
    connectedWalletDepositInfo.isActive &&
    connectedWalletDepositInfo.startOfCooldownPeriod === 0n &&
    connectedWalletDepositInfo.amount > 0n;

  const isRequestedToClaim =
    !connectedWalletDepositInfo.isActive &&
    connectedWalletDepositInfo.startOfCooldownPeriod > 0n &&
    connectedWalletDepositInfo.amount > 0n;

  const isReadyToClaim =
    !connectedWalletDepositInfo.isActive &&
    connectedWalletDepositInfo.amount > 0n &&
    toNormalDate(
      connectedWalletDepositInfo.endOfCooldownPeriod.toString()
    ).getTime() <
      Date.now() * 6000 * 60 * 24 * 1;

  useEffect(() => {
    if (!connectedWalletAddress) {
      setModalData((prev) => ({
        ...prev,
        imageWarning: true,
        imageSubTitle: "pls connect your wallet",
      }));
    } else {
      // if(depositInfo.){
      // }
    }
  }, [connectedWalletAddress]);
  const { imageSubTitle, imageWarning, title } = modalData;
  const handleResignClicked = () => {
    onOpen();
  };
  const client = useWalletClient();
  const { pluginAddress } = useAppGlobalConfig();
  const {
    writeAsync: writeResign,
    data,
    isLoading: requestIsLoading,
  } = useContractWrite({
    abi: DaofinABI,
    functionName: "resignHouse",
    address: pluginAddress as Address,
    account: connectedWalletAddress as Address,
  });

  const {
    writeAsync: writeClaim,
    data: claimData,
    isLoading: claimIsLoading,
  } = useContractWrite({
    abi: DaofinABI,
    functionName: "executeResignHouse",
    address: pluginAddress as Address,
    account: connectedWalletAddress as Address,
  });

  const {} = useWaitForTransaction({
    hash: data?.hash,
  });
  const handleResignation = async () => {
    const hash = await writeResign();
    console.log(hash);
  };
  const handleClaim = async () => {
    const hash = await writeClaim();
    console.log(hash);
  };
  const { t } = useTranslation();
  return (
    <>
      <DefaultBox alignSelf={"flex-start"}>
        <Box as="span" flex="1" textAlign="left">
          <Text fontWeight={"bold"} mb={"2"}>
            {t("community.resignation")}
          </Text>
          <Text fontSize={"sm"} mb={"2"}>
            {t("community.resignationDesc")}
          </Text>
        </Box>
        {connectedWalletAddress && connectedWalletDepositInfo ? (
          <>
            {doesHaveDeposit ? (
              <>
                <Box w={"full"} mb={"2"}>
                  <ViewGrantProposalType
                    data={new Uint8Array()}
                    to={connectedWalletAddress}
                    value={connectedWalletDepositInfo.amount}
                  />
                </Box>
                <Box w={"full"} mb={"2"}>
                  <WalletAuthorizedButton
                    w={"full"}
                    variant={"outline"}
                    onClick={handleResignation}
                    colorScheme="red"
                    fontSize={["xs", "sm"]}
                    isDisabled={
                      requestIsLoading ||
                      isRequestedToClaim ||
                      !isReadyToRequest
                    }
                  >
                    {isReadyToRequest ? t("community.requestToResign") : ""}
                    {isWithinVotingPeriod
                      ? t("community.unableToWithdraw")
                      : ""}

                    {isRequestedToClaim && connectedWalletDepositInfo ? (
                      <Countdown
                        renderer={({ days, hours, minutes, seconds }) =>
                          `Ends in ${days}D ${hours}H ${minutes}m ${seconds}s`
                        }
                        date={toNormalDate(
                          connectedWalletDepositInfo.endOfCooldownPeriod.toString()
                        )}
                      />
                    ) : (
                      ""
                    )}
                  </WalletAuthorizedButton>
                </Box>
                <Box w={"full"}>
                  <WalletAuthorizedButton
                    w={"full"}
                    variant={"outline"}
                    onClick={handleClaim}
                    isDisabled={
                      claimIsLoading || !isRequestedToClaim || !isReadyToClaim
                    }
                  >
                    {t("community.claimYourWithdraw")}
                  </WalletAuthorizedButton>
                </Box>
              </>
            ) : (
              <></>
            )}
          </>
        ) : (
          t("common.connectWallet")
        )}
      </DefaultBox>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
          <HStack justifyContent={"center"}>
            <Image src="/GasEstimation.png" />

            <Text>{imageSubTitle}</Text>
          </HStack>

          <Box w={"full"}>
            <DefaultButton w={"full"} variant={"outline"}>
              {t("common.cancel")}
            </DefaultButton>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default PeoplesHousePage;

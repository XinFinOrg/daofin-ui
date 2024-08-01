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
export type JoinHouseFormType = {
  amount: string;
};
const PeoplesHousePage = () => {
  // const { address: voterAddress } = useWallet();

  const {} = useClient();
  const { network } = useNetwork();
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
              <Tab>Active</Tab>
              <Tab>Freezed</Tab>
            </TabList>
            <TabPanels>
              <TabPanel pl={0}>
                <DefaultBox w={"full"} >
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
}
const PeoplesHouseHeader: FC<PeoplesHouseHeaderType> = ({
  totalMembers,
  totalDeposits,
  totalSupply,
}) => {
  const { handleToggleFormModal } = usePeopleHouseContext();
  const { network } = useNetwork();
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
                    People’s House
                  </Text>
                  <Text fontSize={"xs"}>
                    This is the group of Token Holders who have deposited their
                    tokens into DAO Treasury.
                  </Text>
                </Box>
              </HStack>
            </Box>
            <Box w={["full", "full", "fit-content"]}>
              <PeopleButton
                colorScheme="blue"
                w={["full", "full", "inherit"]}
                onClick={handleToggleFormModal}
              >
                Join House
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
                  <Text>Total Supply</Text>
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
                  <Text>House Members</Text>
                  <Text fontSize={"lg"} fontWeight={"bold"}>
                    {numberWithCommaSeparate(totalMembers)}
                  </Text>
                </VStack>
              </DefaultBox>
            </HStack>

            <DefaultAlert w={["full", "full", "full", "40%"]}>
              <Box fontSize={"sm"}>
                <Text fontWeight={"semibold"}>How does House work?</Text>
                <Text>
                  People’s House empowers its members by granting voting power
                  proportional to their token holdings, adhering to the
                  principle of "one token, one vote."
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
  return (
    <>
      <DefaultBox alignSelf={"flex-start"}>
        <Box as="span" flex="1" textAlign="left">
          <Text fontWeight={"bold"} mb={"2"}>
            Resignation
          </Text>
          <Text fontSize={"sm"} mb={"2"}>
            As the People’s House, you can add fund anytime to Treasury, and
            request to claim your deposit back
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
                    {isReadyToRequest ? "Request to Resign" : ""}
                    {isWithinVotingPeriod
                      ? "Unable to request inside voting period"
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
                    {"Claim your withdrawal"}
                  </WalletAuthorizedButton>
                </Box>
              </>
            ) : (
              <></>
            )}
          </>
        ) : (
          "Connect your wallet"
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
              Cancel
            </DefaultButton>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default PeoplesHousePage;

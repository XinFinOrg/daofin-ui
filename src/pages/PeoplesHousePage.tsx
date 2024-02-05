import PeoplesHouseDeposits from "../components/PeoplesHouseDeposits";
import { formatEther, parseEther } from "@ethersproject/units";
import {
  CHAIN_METADATA,
  PeoplesHouseCommittee,
  getPluginInstallationId,
} from "../utils/networks";
import usePeoplesHouseDeposits from "../hooks/useDeposits";
import { useDisclosure } from "@chakra-ui/hooks";
import useIsUserDeposited from "../hooks/useIsUserDeposited";
import { useNetwork } from "../contexts/network";
import { useClient } from "../hooks/useClient";
import { useWallet } from "../hooks/useWallet";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import Modal from "../components/Modal/Modal";
import { FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightAddon } from "@chakra-ui/input";
import BoxWrapper from "../components/BoxWrapper";
import { Tooltip } from "@chakra-ui/tooltip";
import { Button } from "@chakra-ui/button";
import useDaoGlobalSettings from "../hooks/useDaoGlobalSettings";
import { Select } from "@chakra-ui/select";
import { option } from "yargs";
import { use } from "chai";
import WithConnectedWallet from "../components/WithConnectedWallet";
import useIsJudiciaryMember from "../hooks/useIsJudiciaryMember";
import React, { FC, useEffect, useMemo } from "react";
import ManageJudiciary from "../components/ManageJudiciary";
import { Box, HStack, VStack } from "@chakra-ui/layout";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Skeleton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Page } from "../components";
import JudiciariesIcon from "../utils/assets/icons/JudiciariesIcon";
import { zeroAddress } from "viem";

import DefaultProgressBar from "../components/DefaultProgressBar";
import {
  WalletAddressCard,
  WalletAddressCardWithBalance,
  WalletAddressCardWithDate,
} from "../components/WalletAddressCard";
import {
  PeoplesHouseProvider,
  usePeopleHouseContext,
} from "../contexts/PeoplesHouseContext";
import { Formik } from "formik";
import { toStandardTimestamp } from "../utils/date";
import useFetchVoterDepositAmount from "../hooks/useFetchVoterDepositAmount";
import {
  numberWithCommaSeparate,
  toEther,
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
export type JoinHouseFormType = {
  amount: string;
};
const PeoplesHousePage = () => {
  const { daoAddress, pluginAddress } = useAppGlobalConfig();

  const { address: voterAddress } = useWallet();

  const { daofinClient } = useClient();
  const { network } = useNetwork();
  const isUserDeposited = useIsUserDeposited(voterAddress ? voterAddress : "");
  const isJudiciaryMember = useIsJudiciaryMember(
    voterAddress ? voterAddress : ""
  );
  const totalSupply = useFetchTotalNumbersByCommittee(PeoplesHouseCommittee);
  const showAddNewButton = isJudiciaryMember || isUserDeposited;

  const { isOpen, onClose, onOpen } = useDisclosure();

  const { data: deposits } = usePeoplesHouseDeposits();

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

  const { data: proposalTypes, isLoading: isLoadingProposalTypes } =
    useFetchPluginProposalTypeDetails();
  return (
    <Page>
      <Formik
        initialValues={{
          amount: "",
        }}
        onSubmit={() => {}}
      >
        <>
          <PeoplesHouseProvider>
            <PeoplesHouseHeader
              totalMembers={deposits ? deposits.length : 0}
              totalDeposits={weiBigNumberToFormattedNumber(totalDeposits)}
              totalSupply={weiBigNumberToFormattedNumber(
                totalSupply ? totalSupply : 0
              )}
            />
            <HStack flexDirection={["column", "column", "column", "row"]}>
              <Box w={["full", "full", "60%"]} alignSelf={"flex-start"} mr={2}>
                <VStack>
                  {deposits && deposits.length > 0 ? (
                    deposits.map(
                      ({
                        amount,
                        id,
                        snapshotBlock,
                        voter,
                        depositDate,
                        txHash,
                      }) => (
                        <WalletAddressCardWithBalance
                          address={voter}
                          balance={weiBigNumberToFormattedNumber(amount)}
                          symbol={CHAIN_METADATA[network].nativeCurrency.symbol}
                        />
                      )
                    )
                  ) : (
                    <>
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
                    </>
                  )}
                </VStack>
              </Box>

              {proposalTypes && proposalTypes?.length > 0 && (
                <DefaultBox
                  w={["full", "full", "40%"]}
                  alignSelf={"flex-start"}
                >
                  <RulesOfDecisions
                    communityName={communityName}
                    summary={"All below info demostrate how voting rules work."}
                    proposalTypes={proposalTypes}
                  />
                </DefaultBox>
              )}
            </HStack>
          </PeoplesHouseProvider>
        </>
      </Formik>
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
                  <JudiciariesIcon />
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
              <DefaultBox w={["full", "full", "full", "33%"]}>
                <VStack
                  fontSize={"sm"}
                  alignSelf={"normal"}
                  alignItems={"flex-start"}
                  justifyContent={"center"}
                >
                  <Text>Deposited Tokens</Text>
                  <Text fontSize={"lg"} fontWeight={"bold"}>
                    {totalDeposits}{" "}
                    {CHAIN_METADATA[network].nativeCurrency.symbol}
                  </Text>
                </VStack>
              </DefaultBox>
              <DefaultBox w={["full", "full", "full", "33%"]}>
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
                    {totalSupply}{" "}
                    {CHAIN_METADATA[network].nativeCurrency.symbol}
                  </Text>
                </VStack>
              </DefaultBox>{" "}
              <DefaultBox
                w={["full", "full", "full", "33%"]}
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

            <DefaultAlert w={["full", "full", "40%"]}>
              <Box fontSize={"sm"}>
                <Text fontWeight={"semibold"}>
                  How to modify one or multiple member?
                </Text>
                <Text>
                  Lorem ipsum dolor sit amet consectetur. Senectus elementum
                  erat pellentesque nisl nibh. Vitae diam dolor convallis porta
                  lacus.
                </Text>
              </Box>
            </DefaultAlert>
          </HStack>
        </VStack>
      </DefaultBox>
    </>
  );
};

export default PeoplesHousePage;

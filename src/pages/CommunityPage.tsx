import {
  Box,
  Flex,
  Text,
  Heading,
  Container,
  HStack,
  VStack,
} from "@chakra-ui/layout";
import React from "react";
import { styled } from "styled-components";
import { v4 as uuid } from "uuid";
import BoxWrapper from "../components/BoxWrapper";
import { Link } from "react-router-dom";
import Page from "../components/Page";
import { IoBarChart } from "react-icons/io5";
import {
  Button,
  IconButton,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import CommunityCards from "../components/CommunityCards";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  WalletAddressCardWithBalance,
  WalletAddressCard,
  WalletAddressCardWithDate,
} from "../components/WalletAddressCard";
import { zeroAddress } from "viem";
import { CHAIN_METADATA, JudiciaryCommittee } from "../utils/networks";
import { useNetwork } from "../contexts/network";
import MasterNodeDelegatePage from "./MasterNodeDelegatePage";
import { MasterNodeSenateCard } from "../components/WalletAddressCard";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import useFetchJudiciaries from "../hooks/useFetchJudiciaries";
import useFetchTotalNumbersByCommittee from "../hooks/useFetchTotalNumbersByCommittee";
import { toNormalDate, toStandardTimestamp } from "../utils/date";
import { useMasterNodeDelegateeSentateContext } from "../contexts/MasterNodeDelegateeSentateContext";
import useFetchMasterNodeDelegatee from "../hooks/useFetchMasterNodeDelegatee";
import usePeoplesHouseDeposits from "../hooks/useDeposits";
import { weiBigNumberToFormattedNumber } from "../utils/numbers";
import { NoProposalIcon } from "../utils/assets/icons/NoProposalIcon";
import { EmptyBoxIcon } from "../utils/assets/icons/EmptyBoxIcon";
import CoinIcon from "../utils/assets/icons/CoinIcon";

const data = [
  {
    name: "",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
];

const CommunityPage = () => {
  const { network } = useNetwork();

  const { daoAddress, pluginAddress } = useAppGlobalConfig();
  const { data: juries, error } = useFetchJudiciaries(
    daoAddress,
    pluginAddress
  );
  const totalNumberOfJudiciaries =
    useFetchTotalNumbersByCommittee(JudiciaryCommittee);

  const { data: people } = usePeoplesHouseDeposits();
  const { data: delegatees } = useFetchMasterNodeDelegatee();
  return (
    <Page>
      <Text fontWeight={"semibold"} fontSize={"lg"}>
        Community
      </Text>

      <Flex mb={4}>
        <HStack
          bgColor={useColorModeValue("gray.50", "gray.900")}
          p={"6"}
          mr={4}
          borderRadius={"lg"}
          border={"1px"}
          borderColor={"blue.50"}
          boxShadow={"sm"}
          w={"50%"}
          justifyContent={"space-between"}
        >
          <VStack alignItems={"flex-start"}>
            <Text fontSize="sm" fontWeight={"normal"}>
              Total Voters
            </Text>
            <Text fontSize="large" fontWeight={"bold"}>
              904
            </Text>
          </VStack>
        </HStack>
        <HStack
          bgColor={useColorModeValue("gray.50", "gray.900")}
          p={"6"}
          borderRadius={"lg"}
          border={"1px"}
          borderColor={"blue.50"}
          boxShadow={"sm"}
          w={"50%"}
          justifyContent={"space-between"}
        >
          <VStack alignItems={"flex-start"}>
            <Text fontSize="sm" fontWeight={"normal"}>
              Balance in Treasury
            </Text>
            <Text fontSize="large" fontWeight={"bold"}>
              430,000
            </Text>
          </VStack>
          <Box>
            <Button variant="outline" colorScheme="blue">
              + Add fund
            </Button>
          </Box>
        </HStack>
      </Flex>
      <Flex mb={4}>
        <CommunityCards />
      </Flex>
      <Flex
        mb={4}
        flexDirection={"column"}
        p={"6"}
        bgColor={useColorModeValue("gray.50", "gray.900")}
        borderRadius={"md"}
      >
        <HStack w={"full"} justifyContent={"space-between"} mb={"4"}>
          <Box>
            <Text fontSize={"md"} fontWeight={"semibold"} mb={"1"}>
              Judiciaries
            </Text>
            <Text>Lorem ipsum dolor sit amet consectetur,</Text>
          </Box>
          <Box display={"inline-flex"} alignItems={"center"}>
            <Text>View all</Text>
            <ArrowForwardIcon />
          </Box>
        </HStack>
        <HStack flexWrap={"wrap"} justifyContent={"flex-start"}>
          {juries.length > 0 &&
            juries.map(({ member, creationDate }) => (
              <Box w={"sm"}>
                <WalletAddressCardWithDate
                  address={member}
                  date={new Date(toStandardTimestamp(creationDate.toString()))}
                />
              </Box>
            ))}
        </HStack>
      </Flex>

      <Flex
        mb={4}
        flexDirection={"column"}
        p={"6"}
        bgColor={useColorModeValue("gray.50", "gray.900")}
        borderRadius={"md"}
      >
        <HStack alignItems={"start"} w={"full"}>
          <VStack w={"50%"} alignItems={"flex-start"}>
            <Box textAlign={"start"}>
              <Text fontSize={"md"} fontWeight={"semibold"} mb={"1"}>
                People’s House
              </Text>
              <Text fontSize={"xs"} fontWeight={"normal"}>
                This is the group of expert people who are selected during
                initial deployment
              </Text>
            </Box>
            <Box w={"100%"} px={6} py={4}>
              <ResponsiveContainer width={"100%"} minHeight={300}>
                <BarChart width={730} height={250} data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  {/* <YAxis /> */}
                  {/* <Legend /> */}
                  <Bar dataKey="pv" fill="#8884d8" />
                  <Bar dataKey="uv" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>

            </Box>
          </VStack>
          <VStack alignItems={"flex-start"} w={"50%"}>
            <Box textAlign={"start"}>
              <Text fontSize={"md"} fontWeight={"semibold"} mb={"1"}>
                Top Contributors
              </Text>
              <Text fontSize={"xs"} fontWeight={"normal"}>
                People that has funded the DAO treasury the most
              </Text>
            </Box>
            <VStack w={"full"}>
              {people.length < 0 ? (
                people.map(
                  ({ amount, depositDate, snapshotBlock, id, voter }) => (
                    <Box w={"full"}>
                      <WalletAddressCardWithBalance
                        address={voter}
                        sm
                        balance={weiBigNumberToFormattedNumber(amount)}
                        symbol={CHAIN_METADATA[network].nativeCurrency.symbol}
                      />
                    </Box>
                  )
                )
              ) : (
                <>
                  <VStack
                    w={"100%"}
                    alignItems="center"
                    alignSelf={"center"}
                    p={6}
                  >
                    <CoinIcon />
                    <Text fontSize={"xs"} fontWeight={"500"} opacity={"0.5"}>
                      {"There is not enough data this month to showcase"}
                    </Text>
                  </VStack>
                </>
              )}
            </VStack>
            <VStack w={"full"}>
              <Button variant={"ghost"} w={"full"} alignSelf={"end"}>
                View All
              </Button>
              <Button colorScheme="blue" w={"full"} alignSelf={"end"}>
                Join House
              </Button>
            </VStack>
          </VStack>
        </HStack>
      </Flex>
      <Flex
        mb={4}
        flexDirection={"column"}
        p={"6"}
        bgColor={useColorModeValue("gray.50", "gray.900")}
        borderRadius={"md"}
        w={"full"}
      >
        <HStack w={"full"} justifyContent={"space-between"} mb={"4"}>
          <Box>
            <Text fontSize={"md"} fontWeight={"semibold"} mb={"1"}>
              Master Node Delegatee Senate
            </Text>
            <Text>Lorem ipsum dolor sit amet consectetur,</Text>
          </Box>
          <Box display={"inline-flex"} alignItems={"center"}>
            <Text>View all</Text>
            <ArrowForwardIcon />
          </Box>
        </HStack>
        <HStack flexWrap={"wrap"} justifyContent={"flex-start"}>
          {delegatees.map(
            ({
              creationDate,
              masterNode,
              member,
              snapshotBlock,
              txHash,
              id,
            }) => (
              <Box w={["50%", "20%"]} key={id}>
                <MasterNodeSenateCard
                  address={member}
                  blockNumber={parseInt(snapshotBlock.toString())}
                  joinedDate={toNormalDate(creationDate.toString())}
                  masterNodeAddress={masterNode}
                />
              </Box>
            )
          )}
        </HStack>
      </Flex>
    </Page>
  );
};

export default CommunityPage;

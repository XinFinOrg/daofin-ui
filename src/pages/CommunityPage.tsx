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
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import useFetchJudiciaries from "../hooks/useFetchJudiciaries";
import useFetchTotalNumbersByCommittee from "../hooks/useFetchTotalNumbersByCommittee";
import { toStandardTimestamp } from "../utils/date";

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
              <Box w={'sm'}>
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
            <Box w={"100%"}>
              <ResponsiveContainer width={"100%"} minHeight={300}>
                <AreaChart width={600} height={200} data={data}>
                  <Area
                    type="monotone"
                    dataKey="uv"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                </AreaChart>
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
              {new Array(4).fill(4).map(() => (
                <Box w={"full"}>
                  <WalletAddressCardWithBalance
                    address={zeroAddress}
                    sm
                    balance={122}
                    symbol={CHAIN_METADATA[network].nativeCurrency.symbol}
                  />
                </Box>
              ))}
            </VStack>
            <Button variant={"ghost"} w={"full"}>
              View All
            </Button>
            <Button variant={"outline"} w={"full"}>
              Join House
            </Button>
          </VStack>
        </HStack>
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
              Master Node Delegatee Senate
            </Text>
            <Text>Lorem ipsum dolor sit amet consectetur,</Text>
          </Box>
          <Box display={"inline-flex"} alignItems={"center"}>
            <Text>View all</Text>
            <ArrowForwardIcon />
          </Box>
        </HStack>
        <HStack flexWrap={"wrap"} justifyContent={"space-around"}>
          {new Array(4).fill(5).map(() => (
            <Box w={"20%"}>
              <MasterNodeSenateCard
                address={zeroAddress}
                blockNumber={58138715}
                joinedDate={new Date()}
                masterNodeAddress={zeroAddress}
              />
            </Box>
          ))}
        </HStack>
      </Flex>
    </Page>
  );
};

export default CommunityPage;

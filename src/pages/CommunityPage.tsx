import { Box, Flex, Text, HStack, VStack } from "@chakra-ui/layout";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import Page from "../components/Page";
import { Skeleton } from "@chakra-ui/react";
import CommunityCards from "../components/CommunityCards";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  WalletAddressCardWithBalance,
  WalletAddressCardWithDate,
} from "../components/WalletAddressCard";
import { CHAIN_METADATA } from "../utils/networks";
import { useNetwork } from "../contexts/network";
import { MasterNodeSenateCard } from "../components/WalletAddressCard";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import useFetchJudiciaries from "../hooks/useFetchJudiciaries";
import { toNormalDate, toStandardTimestamp } from "../utils/date";
import useFetchMasterNodeDelegatee from "../hooks/useFetchMasterNodeDelegatee";
import usePeoplesHouseDeposits from "../hooks/useDeposits";
import {
  toEther,
  toWei,
  weiBigNumberToFormattedNumber,
} from "../utils/numbers";
import { EmptyBoxIcon } from "../utils/assets/icons/EmptyBoxIcon";
import CoinIcon from "../utils/assets/icons/CoinIcon";
import useFetchDaoBalance from "../hooks/useFetchDaoBalance";
import { DefaultBox } from "../components/Box";
import { DefaultButton } from "../components/Button";
import { AddFund } from "../components/Button/AddFundButton";
import useTotalNumberOfVoters from "../hooks/useTotalNumberOfVoters";
import { useCommitteeUtils } from "../hooks/useCommitteeUtils";

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
  const { committeesList } = useCommitteeUtils();
  const {
    data: juries,
    error,
    isLoading: isLoadingJuries,
  } = useFetchJudiciaries(daoAddress, pluginAddress);

  const { data: people, isLoading: isLoadingPeople } =
    usePeoplesHouseDeposits();
  const { data: delegatees, isLoading: isLoadingDelegatee } =
    useFetchMasterNodeDelegatee();
  const { data: nativeBalanceOfDao, isLoading: isLoadingDaoBalance } =
    useFetchDaoBalance();

  const { mapCommitteeToTotalNumber } = useTotalNumberOfVoters();
  const totalVoters = useMemo(
    () =>
      committeesList.reduce((acc, { id }) => {
        return acc.add(toWei(mapCommitteeToTotalNumber(id).toString()));
      }, toWei("0")),
    [mapCommitteeToTotalNumber]
  );

  return (
    <Page>
      <Text fontWeight={"semibold"} fontSize={"lg"} mb={"2"}>
        Community
      </Text>

      <Flex mb={4} flexDirection={["column", "column", "column", "row"]}>
        <Skeleton
          mr={4}
          w={["100%", "100%", "100%", "50%"]}
          isLoaded={!isLoadingDaoBalance}
        >
          <DefaultBox>
            <HStack justifyContent={"space-between"}>
              <VStack alignItems={"flex-start"}>
                <Text fontSize="sm" fontWeight={"normal"}>
                  Total Voters
                </Text>
                <Text fontSize="large" fontWeight={"bold"}>
                  {+toEther(totalVoters.toString())}
                </Text>
              </VStack>
            </HStack>
          </DefaultBox>
        </Skeleton>
        <Skeleton
          w={["100%", "100%", "100%", "50%"]}
          isLoaded={!isLoadingDaoBalance}
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
                </Text>
              </VStack>
              <Box>
                <AddFund />
              </Box>
            </HStack>
          </DefaultBox>
        </Skeleton>
      </Flex>
      <Flex>
        <CommunityCards />
      </Flex>
      <DefaultBox mb={4}>
        <Flex flexDirection={"column"}>
          <HStack w={"full"} justifyContent={"space-between"} mb={"4"}>
            <Box fontSize={["sm", "md"]}>
              <Text fontWeight={"semibold"} mb={"1"}>
                Judiciaries
              </Text>
              <Text fontWeight={"normal"} fontSize={"xs"}>
                A set of pre-selected well-known community leaders.
              </Text>
            </Box>
            <Box display={"inline-flex"} alignItems={"center"}>
              <Link to={"/community/judiciary"}>
                <Text fontSize={["sm", "md"]}>View all</Text>
              </Link>
              <ArrowForwardIcon />
            </Box>
          </HStack>
          {!error ? (
            <Skeleton
              isLoaded={!isLoadingJuries}
              flexWrap={"wrap"}
              justifyContent={"flex-start"}
            >
              <HStack>
                {juries.length > 0 &&
                  juries.slice(0, 5).map(({ member, creationDate }) => (
                    <Box w={"sm"}>
                      <WalletAddressCardWithDate
                        address={member}
                        date={
                          new Date(toStandardTimestamp(creationDate.toString()))
                        }
                      />
                    </Box>
                  ))}
              </HStack>
            </Skeleton>
          ) : (
            "error"
          )}
        </Flex>
      </DefaultBox>
      <DefaultBox mb={4}>
        <Flex flexDirection={"column"}>
          <HStack alignItems={"start"} w={"full"}>
            <VStack
              w={["0", "50%"]}
              alignItems={"flex-start"}
              visibility={["hidden", "visible"]}
              overflow={["hidden", "visible"]}
            >
              <Box textAlign={"start"}>
                <Text fontSize={"md"} fontWeight={"semibold"} mb={"1"}>
                  People’s House
                </Text>
                <Text fontSize={"xs"} fontWeight={"normal"}>
                  This is the group of Token Holders who have deposited their
                  tokens into DAO Treasury.
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
            <VStack alignItems={"flex-start"} w={["100%", "50%"]}>
              <Box textAlign={"start"}>
                <Text fontSize={"md"} fontWeight={"semibold"} mb={"1"}>
                  Top Contributors
                </Text>
                {/* <Text fontSize={"xs"} fontWeight={"normal"}>
                  People that has funded the DAO treasury the most
                </Text> */}
              </Box>
              <VStack w={"full"}>
                {people.length > 0 ? (
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
                <Link to={"/community/peoples-house"}>
                  <DefaultButton variant={"ghost"} w={"full"} alignSelf={"end"}>
                    View All
                  </DefaultButton>
                </Link>
                <Link to={"/community/peoples-house"}>
                  <DefaultButton w={"full"} alignSelf={"end"}>
                    Join House
                  </DefaultButton>
                </Link>
              </VStack>
            </VStack>
          </HStack>
        </Flex>
      </DefaultBox>
      <DefaultBox w={"full"} mb={2}>
        <Flex flexDirection={"column"}>
          <HStack
            w={"full"}
            justifyContent={"space-between"}
            mb={"4"}
            fontSize={["sm", "md"]}
          >
            <Box>
              <Text fontWeight={"semibold"} mb={"1"}>
                Master Node Delegatee Senate
              </Text>
              <Text fontWeight={"normal"} fontSize={"xs"}>
                The set of Master Nodes who have joined DAOFIN by delegation
                mechanism.
              </Text>
            </Box>
            <Box display={"inline-flex"} alignItems={"center"}>
              <Link to={"/community/masternode-delegatee-senate"}>
                <Text>View all</Text>
              </Link>
              <ArrowForwardIcon />
            </Box>
          </HStack>

          <HStack flexWrap={"wrap"} justifyContent={"flex-start"}>
            {delegatees.length > 0 ? (
              delegatees
                .slice(0, 5)
                .map(
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
                        txHash={txHash}
                        address={member}
                        blockNumber={parseInt(snapshotBlock.toString())}
                        joinedDate={toNormalDate(creationDate.toString())}
                        masterNodeAddress={masterNode}
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
                  <EmptyBoxIcon />
                  <Text fontSize={"xs"} fontWeight={"500"} opacity={"0.5"}>
                    {"No data"}
                  </Text>
                </VStack>
              </>
            )}
          </HStack>
        </Flex>
      </DefaultBox>
    </Page>
  );
};

export default CommunityPage;

import {
  Box,
  HStack,
  Heading,
  Icon,
  Image,
  Skeleton,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Modal, Page } from "../components";
import { useNetwork } from "../contexts/network";
import { ArrowForwardIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { XdcIcon } from "../utils/assets/icons/XdcIcon";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import useFetchDaoBalance from "../hooks/useFetchDaoBalance";
import {
  toEther,
  toWei,
  weiBigNumberToFormattedNumber,
} from "../utils/numbers";
import { CHAIN_METADATA, makeBlockScannerAddressUrl } from "../utils/networks";
import { DefaultBox, WalletCardBox } from "../components/Box";
import { FC, useEffect, useMemo, useState } from "react";
import { useGlobalState } from "../contexts/GlobalStateContext";
import CoinIcon from "../utils/assets/icons/CoinIcon";
import { useClient } from "../hooks/useClient";
import { DaoTreasuryProvider } from "../contexts/DaoTreasuryContext";
import { DefaultButton } from "../components/Button";
import { Formik } from "formik";
import { AddFund } from "../components/Button/AddFundButton";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";

import { Link } from "react-router-dom";
import { Address, formatEther } from "viem";
import SecondaryWalletAddressCard from "../components/WalletAddressCard/SecondaryWalletAddressCard";
import { toNormalDate } from "../utils/date";
import { erc20ABI, useContractRead, useToken } from "wagmi";
import WithdrawActionCard from "../components/WalletAddressCard/WithdrawActionCard";
import { BigNumber } from "ethers";
import { useTranslation } from "react-i18next";
const Query = `
query DaoTransfers($daoId: ID!) {
  nativeTransfers(
    where: {dao: $daoId}
    orderBy: createdAt
    orderDirection: desc
  ) {
    id
    to
    from
    amount
    reference
    createdAt
    txHash
  }
}`;
const DaoWithdraws = `
query DaoWithdraws($daoId: ID!) {
  actions(orderBy: proposal__endDate, orderDirection: asc, 
    where: {dao: $daoId proposal_: {executed:true}}
  ) {
    id
    to
    value
    data
    proposal {
      executed
    }
    dao {
      id
    }
    execResult
  }
}
`;

type NativeTransfer = {
  id: string;
  to: string;
  from: string;
  amount: string; // BigInt often represented as a string in TypeScript to avoid precision loss.
  reference: string;
  createdAt: string;
  txHash: string;
};

type WithdrawQueryAction = {
  id: string;
  to: string;
  value: string;
  data: string;
  proposal: {
    executed: boolean;
    executionTxHash: string;
  };
  daoId: string;
  dao: {
    id: string;
  };
  execResult: string;
};
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const TreasuryPage = () => {
  const { data: nativeBalanceOfDao, isLoading: isDaoBalanceLoading } =
    useFetchDaoBalance();
  const { network } = useNetwork();
  const { daofinClient } = useClient();
  const { daoAddress } = useAppGlobalConfig();
  const [addfunds, setAddFunds] = useState<NativeTransfer[]>();
  const [withdraws, setWithdraws] = useState<WithdrawQueryAction[]>();
  const { data: fxdBalance } = useContractRead({
    abi: erc20ABI,
    args: [daoAddress as Address],
    functionName: "balanceOf",
    address: CHAIN_METADATA[network].fxdToken as Address,
  });

  const [pieData, setPieData] = useState([{ name: "Non", value: 1 }]);
  const xdcPrice = useGlobalState().xdcPrice;
  const {
    isOpen: addFundIsOpen,
    onOpen: addFundOnOpen,
    onClose: addFundOnClose,
  } = useDisclosure();

  const {
    isOpen: withdrawIsOpen,
    onOpen: withdrawOnOpen,
    onClose: withdrawOnClose,
  } = useDisclosure();

  // useEffect(() => {
  //   if (!daofinClient || !daofinClient.graphql || !daoAddress) return;
  //   daofinClient.graphql
  //     .request<{ nativeTransfers: NativeTransfer[] }>({
  //       query: Query,
  //       params: { daoId: daoAddress.toLowerCase() },
  //     })
  //     .then((data) => {
  //       setAddFunds(data.nativeTransfers);
  //     })
  //     .catch(console.log);
  // }, [daofinClient, daoAddress]);

  useEffect(() => {
    if (!daofinClient || !daoAddress) return;
    daofinClient?.graphql
      .request<{ actions: WithdrawQueryAction[] }>({
        query: DaoWithdraws,
        params: { daoId: daoAddress.toLowerCase() },
      })
      .then(({ actions }) => {
        setWithdraws(actions);
      })
      .catch(console.log);
  }, [daofinClient, daoAddress]);

  const usdValueOfDao = useMemo(() => {
    return nativeBalanceOfDao
      ? weiBigNumberToFormattedNumber(
          toWei(xdcPrice.toString()).mul(
            parseInt(toEther(nativeBalanceOfDao.toString()))
          )
        )
      : 0;
  }, [xdcPrice, nativeBalanceOfDao]);

  useEffect(() => {
    if (nativeBalanceOfDao && fxdBalance) {
      setPieData([
        {
          name: "XDC",
          value: +weiBigNumberToFormattedNumber(nativeBalanceOfDao),
        },
        {
          name: "FXD",
          value: +weiBigNumberToFormattedNumber(BigNumber.from(fxdBalance)),
        },
      ]);
    }
  }, [nativeBalanceOfDao, fxdBalance]);
  return (
    <Page title="Treasury">
      <Formik
        initialValues={{
          depositAmount: "",
        }}
        onSubmit={() => {}}
      >
        <DaoTreasuryProvider>
          <TreasuryPageHeader
            nativeBalanceOfDao={
              nativeBalanceOfDao ? nativeBalanceOfDao.toString() : "0"
            }
            isDaoBalanceLoading={isDaoBalanceLoading}
          />
          <DefaultBox mr={4} w={"full"} mb={"4"}>
            <HStack>
              <HStack
                w={["0", "0", "50%"]}
                justifyContent={"center"}
                visibility={["hidden", "hidden", "visible"]}
                overflow={["hidden", "hidden", "visible"]}
              >
                {pieData && (
                  <PieChart width={200} height={200}>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={80}
                      fill="#fffff"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                )}
              </HStack>
              <VStack w={["100%", "100%", "50%"]} alignSelf={"flex-start"}>
                <WalletCardBox w={"full"} mr={4} p={4}>
                  <HStack justifyContent={"space-between"}>
                    <HStack>
                      <Box w={"35px"}>
                        <XdcIcon />
                      </Box>
                      <Text fontSize={"md"} fontWeight={"semibold"}>
                        XDC
                        <Text fontSize={"xs"} fontWeight={"normal"}>
                          $ {xdcPrice}
                        </Text>
                      </Text>
                    </HStack>

                    <Box>
                      <Skeleton isLoaded={!isDaoBalanceLoading}>
                        <Text>
                          {nativeBalanceOfDao
                            ? weiBigNumberToFormattedNumber(nativeBalanceOfDao)
                            : 0}{" "}
                          XDC
                        </Text>
                      </Skeleton>
                      <Text>$ {usdValueOfDao?.toString()}</Text>
                    </Box>
                  </HStack>
                </WalletCardBox>
                <WalletCardBox w={"full"} mr={4} p={4}>
                  <HStack justifyContent={"space-between"}>
                    <HStack>
                      <Box w={"35px"}>
                        <Image src="fxd.png" />
                      </Box>
                      <Text fontSize={"md"} fontWeight={"semibold"}>
                        FXD
                        <Text fontSize={"xs"} fontWeight={"normal"}>
                          $ {1}
                        </Text>
                      </Text>
                    </HStack>

                    <Box>
                      <Text>
                        {fxdBalance
                          ? weiBigNumberToFormattedNumber(fxdBalance)
                          : 0}{" "}
                        FXD
                      </Text>
                      <Text>$ {1}</Text>
                    </Box>
                  </HStack>
                </WalletCardBox>
              </VStack>
            </HStack>
          </DefaultBox>
          {/* <HStack
            alignItems={"start"}
            flexDirection={["column", "column", "column", "row"]}
          >
            <DefaultBox mr={"4"} w={["100%", "100%", "100%", "50%"]} mb={"4"}>
              <HStack justifyContent={"space-between"} mb={4}>
                <HStack>
                  <Box></Box>
                  <Box>
                    <Text fontSize={"md"} fontWeight={"semibold"} mb={"1"}>
                      Add Fund
                    </Text>
                    <Text fontSize={"xs"} fontWeight={"normal"}>
                      The history of all deposit activities
                    </Text>
                  </Box>
                </HStack>
                <HStack>
                  <Text
                    cursor={"pointer"}
                    onClick={() => {
                      addFundOnOpen();
                    }}
                  >
                    View All <ArrowForwardIcon />
                  </Text>
                </HStack>
              </HStack>
              <Box>
                {addfunds && addfunds.length > 0 ? (
                  addfunds
                    .slice(0, 5)
                    .map(
                      ({ from, amount, id, createdAt, reference, txHash }) => (
                        <Box mb={"2"}>
                          <SecondaryWalletAddressCard
                            key={id}
                            address={from}
                            balance={formatEther(BigInt(amount)).toString()}
                            date={toNormalDate(createdAt)}
                            symbol="XDC"
                            txHash={txHash}
                            reference={reference}
                          />
                        </Box>
                      )
                    )
                ) : (
                  <WalletCardBox>
                    <VStack>
                      <CoinIcon />
                      <Text>You have not added any fund to yet</Text>
                    </VStack>
                  </WalletCardBox>
                )}
              </Box>
            </DefaultBox>
            <DefaultBox w={["100%", "100%", "100%", "50%"]} mb={"4"}>
              <HStack justifyContent={"space-between"} mb={4}>
                <HStack>
                  <Box></Box>
                  <Box>
                    <Text fontSize={"md"} fontWeight={"semibold"} mb={"1"}>
                      Withdrawals
                    </Text>
                    <Text fontSize={"xs"} fontWeight={"normal"}>
                      The history of all withdrawal activities
                    </Text>
                  </Box>
                </HStack>
                <HStack>
                  <Text
                    cursor={"pointer"}
                    onClick={() => {
                      withdrawOnOpen();
                    }}
                  >
                    View All <ArrowForwardIcon />
                  </Text>
                </HStack>
              </HStack>
              {withdraws && withdraws.length > 0 ? (
                withdraws
                  .slice(0, 5)
                  .map(({ id, to, value, proposal, data, execResult }) => (
                    <Box mb={"2"}>
                      <WithdrawActionCard
                        key={id}
                        address={to}
                        balance={formatEther(BigInt(value)).toString()}
                        // date={toNormalDate(createdAt)}
                        symbol={"XDC"}
                        txHash={
                          "https://apothem.xdcscan.io/txs/0x8f01f72c7a1a80a003bd21262e383fda7e0697e7d5003acacc3c1373c95a6109"
                        }
                        // reference={reference}
                      />
                    </Box>
                  ))
              ) : (
                <WalletCardBox>
                  <VStack>
                    <CoinIcon />
                    <Text>You have not withdrawn any fund to yet</Text>
                  </VStack>
                </WalletCardBox>
              )}
            </DefaultBox>
          </HStack> */}
        </DaoTreasuryProvider>
      </Formik>

      {/* {addFundIsOpen && (
        <Modal
          title="Add Funds"
          isOpen={addFundIsOpen}
          onClose={addFundOnClose}
          size={"lg"}
        >
          <Box>
            {addfunds && addfunds.length > 0 ? (
              addfunds.map(
                ({ from, amount, id, createdAt, reference, txHash }) => (
                  <Box mb={"2"}>
                    <SecondaryWalletAddressCard
                      key={id}
                      address={from}
                      balance={formatEther(BigInt(amount)).toString()}
                      date={toNormalDate(createdAt)}
                      symbol="XDC"
                      txHash={txHash}
                      reference={reference}
                    />
                  </Box>
                )
              )
            ) : (
              <WalletCardBox>
                <VStack>
                  <CoinIcon />
                  <Text>You have not added any fund yet</Text>
                </VStack>
              </WalletCardBox>
            )}
          </Box>
        </Modal>
      )}
      {withdrawIsOpen && (
        <Modal
          title="Withdraws"
          isOpen={withdrawIsOpen}
          onClose={withdrawOnClose}
          size={"lg"}
        >
          <Box>
            {withdraws && withdraws.length > 0 ? (
              withdraws
                .slice(0, 5)
                .map(({ id, to, value, proposal, data, execResult }) => (
                  <Box mb={"2"}>
                    <WithdrawActionCard
                      key={id}
                      address={to}
                      balance={formatEther(BigInt(value)).toString()}
                      // date={toNormalDate(createdAt)}
                      symbol={"XDC"}
                      txHash={
                        "https://apothem.xdcscan.io/txs/0x8f01f72c7a1a80a003bd21262e383fda7e0697e7d5003acacc3c1373c95a6109"
                      }
                      // reference={reference}
                    />
                  </Box>
                ))
            ) : (
              <WalletCardBox>
                <VStack>
                  <CoinIcon />
                  <Text>You have not withdrawn any fund yet.</Text>
                </VStack>
              </WalletCardBox>
            )}
          </Box>
        </Modal>
      )} */}
    </Page>
  );
};
interface TreasuryPageHeaderProps {
  nativeBalanceOfDao: string;
  isDaoBalanceLoading: boolean;
}
const TreasuryPageHeader: FC<TreasuryPageHeaderProps> = ({
  nativeBalanceOfDao,
  isDaoBalanceLoading,
}) => {
  const { network } = useNetwork();
  const { daoAddress } = useAppGlobalConfig();
  const { t } = useTranslation();
  return (
    <>
      <Text fontWeight={"semibold"} fontSize={"lg"} mb={2}>
        Treasury
      </Text>

      <DefaultBox mr={4} w={"full"} mb={"4"}>
        <HStack
          justifyContent={"space-between"}
          mb={4}
          flexDirection={["column", "column", "column", "row"]}
        >
          <HStack>
            <Box>
              <Image src="/treasury.png" w={["60px", "50px"]} />
            </Box>
            <Box>
              <Heading fontSize={["lg", "xl"]} fontWeight={"semibold"} mb={"1"}>
                {t("treasury.governorAsset")}
              </Heading>
              <Text fontSize={"xs"} fontWeight={"normal"}>
                {t("treasury.governorAssetDesc")}
              </Text>
            </Box>
          </HStack>
          <HStack>
            <a href={"https://github.com/XinFinOrg/osx-daofin"} target="_blank">
              <Text fontSize={"xs"} fontWeight={"normal"}>
                {t("treasury.viewContract")} <ExternalLinkIcon />
              </Text>
            </a>
            <a
              href={makeBlockScannerAddressUrl(network, daoAddress)}
              target="_blank"
            >
              <Text fontSize={"xs"} fontWeight={"normal"}>
                {t("treasury.viewContractOnExplorer")} <ExternalLinkIcon />
              </Text>
            </a>
          </HStack>
        </HStack>

        <HStack
          justifyContent={"space-between"}
          flexDirection={["column", "row"]}
        >
          <Box>
            <Text fontSize={"xs"} fontWeight={"normal"}>
              {t("treasury.totalValue")}
            </Text>
            <Skeleton isLoaded={!isDaoBalanceLoading}>
              <Heading fontSize={"2xl"} fontWeight={"bold"} mb={"1"}>
                {weiBigNumberToFormattedNumber(nativeBalanceOfDao)}{" "}
                {CHAIN_METADATA[network].nativeCurrency.symbol}
              </Heading>
            </Skeleton>
          </Box>
          <HStack flexDirection={["column", "row"]} w={["full", "initial"]}>
            <Box w={["full", "initial"]}>
              <Link to={`/create/0`}>
                <DefaultButton w={["full", "initial"]} variant={"outline"}>
                  {t("treasury.withdraw")}
                </DefaultButton>
              </Link>
            </Box>
            <Box w={["full", "initial"]}>
              <AddFund />
            </Box>
          </HStack>
        </HStack>
      </DefaultBox>
    </>
  );
};

export default TreasuryPage;

// 0x35ab90b436a7ba75c88755ac241a10d1d9e4a6e3
// 0x35aB90b436a7bA75C88755ac241A10d1D9e4a6e3

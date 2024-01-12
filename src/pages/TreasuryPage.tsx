import {
  Box,
  Button,
  HStack,
  Text,
  Tooltip,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Page } from "../components";
import { useNetwork } from "../contexts/network";
import { ArrowForwardIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { TreasuryIcon } from "../utils/assets/icons";
import { XdcIcon } from "../utils/assets/icons/XdcIcon";
import { Cell, Pie, PieChart } from "recharts";
import useFetchDaoBalance from "../hooks/useFetchDaoBalance";
import {
  toEther,
  toWei,
  weiBigNumberToFormattedNumber,
} from "../utils/numbers";
import { CHAIN_METADATA } from "../utils/networks";
import { DefaultBox } from "../components/Box";
import { FC, useEffect, useMemo, useState } from "react";
import { useGlobalState } from "../contexts/GlobalStateContext";
import CoinIcon from "../utils/assets/icons/CoinIcon";
import { useClient } from "../hooks/useClient";
import {
  DaoTreasuryProvider,
  useDaoTreasury,
} from "../contexts/DaoTreasuryContext";
import { DefaultButton } from "../components/Button";
import { Formik } from "formik";
import { AddFund } from "../components/Button/AddFundButton";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import { Transfer } from "@xinfin/osx-sdk-client";
import { WalletAddressCardWithBalance } from "../components/WalletAddressCard";

const data = [{ name: "Group A", value: 100 }];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const TreasuryPage = () => {
  const nativeBalanceOfDao = useFetchDaoBalance();
  const { client } = useClient();
  const { daoAddress } = useAppGlobalConfig();
  const [addfunds, setAddFunds] = useState<Transfer[]>();
  const { network } = useNetwork();
  const xdcPrice = useGlobalState().xdcPrice;

  useEffect(() => {
    client?.methods
      .getDaoTransfers({ daoAddressOrEns: daoAddress })
      .then((data) => {
        setAddFunds(data ? data : []);
      })
      .catch(console.log);

  }, []);



  const usdValueOfDao = useMemo(() => {
    return nativeBalanceOfDao
      ? weiBigNumberToFormattedNumber(
          toWei(xdcPrice.toString()).mul(
            parseInt(toEther(nativeBalanceOfDao.toString()))
          )
        )
      : 0;
  }, [xdcPrice, nativeBalanceOfDao]);
  // const { handleOpenPublishModal } = useDaoTreasury();
  return (
    <Page>
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
          />
          <DefaultBox mr={4} w={"full"} mb={"4"}>
            <HStack>
              <VStack w={"50%"}>
                <DefaultBox w={"full"} mr={4}>
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
                      <Text>
                        {nativeBalanceOfDao
                          ? weiBigNumberToFormattedNumber(nativeBalanceOfDao)
                          : 0}{" "}
                        XDC
                      </Text>
                      <Text>$ {usdValueOfDao?.toString()}</Text>
                    </Box>
                  </HStack>
                </DefaultBox>
              </VStack>
              <HStack w={"50%"} justifyContent={"center"}>
                <PieChart width={200} height={200}>
                  <Pie
                    data={data}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#fffff"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </HStack>
            </HStack>
          </DefaultBox>
          <HStack alignItems={"start"}>
            <DefaultBox mr={4} w={"50%"} mb={"4"}>
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
                  <Text cursor={"pointer"}>
                    View All <ArrowForwardIcon />
                  </Text>
                </HStack>
              </HStack>
              {addfunds && addfunds.length > 0 ? (
                addfunds?.map(
                  ({
                    creationDate,
                    from,
                    to,
                    tokenType,
                    transactionId,
                    type,
                  }) => (
                    <WalletAddressCardWithBalance
                      balance={0}
                      symbol=""
                      address={to}
                    />
                  )
                )
              ) : (
                <VStack>
                  <CoinIcon />
                  <Text>You have not added any fund to yet</Text>
                </VStack>
              )}
            </DefaultBox>
            <DefaultBox w={"50%"} mb={"4"}>
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
                  <Text cursor={"pointer"}>
                    View All <ArrowForwardIcon />
                  </Text>
                </HStack>
              </HStack>

              <VStack>
                <CoinIcon />
                <Text>You have not withdrawn any fund to yet</Text>
              </VStack>
            </DefaultBox>
          </HStack>
        </DaoTreasuryProvider>
      </Formik>
    </Page>
  );
};
interface TreasuryPageHeaderProps {
  nativeBalanceOfDao: string;
}
const TreasuryPageHeader: FC<TreasuryPageHeaderProps> = ({
  nativeBalanceOfDao,
}) => {
  const { network } = useNetwork();
  const { handleOpenPublishModal } = useDaoTreasury();
  return (
    <>
      <Text fontWeight={"semibold"} fontSize={"lg"}>
        Treasury
      </Text>

      <DefaultBox mr={4} w={"full"} mb={"4"}>
        <HStack justifyContent={"space-between"} mb={4}>
          <HStack>
            <Box>
              <TreasuryIcon />
            </Box>
            <Box>
              <Text fontSize={"md"} fontWeight={"semibold"} mb={"1"}>
                Governor Assets
              </Text>
              <Text fontSize={"xs"} fontWeight={"normal"}>
                Value of all assets funded in governer smart contract
              </Text>
            </Box>
          </HStack>
          <HStack>
            <a href="">
              <Text fontSize={"xs"} fontWeight={"normal"}>
                View contract <ExternalLinkIcon />
              </Text>
            </a>
            <a href="">
              <Text fontSize={"xs"} fontWeight={"normal"}>
                View on explorer <ExternalLinkIcon />
              </Text>
            </a>
          </HStack>
        </HStack>

        <HStack justifyContent={"space-between"}>
          <Box>
            <Text fontSize={"xs"} fontWeight={"normal"}>
              Total Value
            </Text>
            <Text fontSize={"lg"} fontWeight={"bold"} mb={"1"}>
              {weiBigNumberToFormattedNumber(nativeBalanceOfDao)}

              {CHAIN_METADATA[network].nativeCurrency.symbol}
            </Text>
          </Box>
          <HStack>
            <DefaultButton variant={"outline"}>Withdraw</DefaultButton>
            <AddFund />
          </HStack>
        </HStack>
      </DefaultBox>
    </>
  );
};

export default TreasuryPage;

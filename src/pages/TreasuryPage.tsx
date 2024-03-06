import {
  Box,
  HStack,
  Heading,
  Icon,
  Image,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Page } from "../components";
import { useNetwork } from "../contexts/network";
import { ArrowForwardIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { XdcIcon } from "../utils/assets/icons/XdcIcon";
import { Cell, Pie, PieChart } from "recharts";
import useFetchDaoBalance from "../hooks/useFetchDaoBalance";
import {
  toEther,
  toWei,
  weiBigNumberToFormattedNumber,
} from "../utils/numbers";
import { CHAIN_METADATA, makeBlockScannerAddressUrl } from "../utils/networks";
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
import { Link } from "react-router-dom";

const data = [{ name: "Group A", value: 100 }];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const TreasuryPage = () => {
  const { data: nativeBalanceOfDao, isLoading: isDaoBalanceLoading } =
    useFetchDaoBalance();
  const { client } = useClient();
  const { daoAddress } = useAppGlobalConfig();
  const [addfunds, setAddFunds] = useState<Transfer[]>();
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
            isDaoBalanceLoading={isDaoBalanceLoading}
          />
          <DefaultBox mr={4} w={"full"} mb={""}>
            <HStack>
              <HStack
                w={["0", "0", "50%"]}
                justifyContent={"center"}
                visibility={["hidden", "hidden", "visible"]}
                overflow={["hidden", "hidden", "visible"]}
              >
                <PieChart width={200} height={200}>
                  <Pie
                    data={data}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#fffff"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </HStack>
              <VStack w={["100%", "100%", "50%"]} alignSelf={"flex-start"}>
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
                </DefaultBox>{" "}
                <DefaultBox w={"full"} mr={4}>
                  <HStack justifyContent={"space-between"}>
                    <HStack>
                      <Box w={"35px"}>
                        <Icon />
                      </Box>
                      <Text fontSize={"md"} fontWeight={"semibold"}>
                        FXD
                        <Text fontSize={"xs"} fontWeight={"normal"}>
                          $ {1}
                        </Text>
                      </Text>
                    </HStack>

                    <Box>
                      <Text>0 FXD</Text>
                      <Text>$ {1}</Text>
                    </Box>
                  </HStack>
                </DefaultBox>
              </VStack>
            </HStack>
          </DefaultBox>
          <HStack
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
                  <Text cursor={"pointer"}>
                    View All <ArrowForwardIcon />
                  </Text>
                </HStack>
              </HStack>
              {addfunds && addfunds.length > 0 ? (
                addfunds?.map(
                  ({
                    
                    to,
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
  isDaoBalanceLoading: boolean;
}
const TreasuryPageHeader: FC<TreasuryPageHeaderProps> = ({
  nativeBalanceOfDao,
  isDaoBalanceLoading,
}) => {
  const { network } = useNetwork();
  const { daoAddress } = useAppGlobalConfig();
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
                Governor Assets
              </Heading>
              <Text fontSize={"xs"} fontWeight={"normal"}>
                Value of all assets funded in governer smart contract
              </Text>
            </Box>
          </HStack>
          <HStack>
            <a href={"https://github.com/XinFinOrg/osx-daofin"} target="_blank">
              <Text fontSize={"xs"} fontWeight={"normal"}>
                View contract <ExternalLinkIcon />
              </Text>
            </a>
            <a
              href={makeBlockScannerAddressUrl(network, daoAddress)}
              target="_blank"
            >
              <Text fontSize={"xs"} fontWeight={"normal"}>
                View Treasury on explorer <ExternalLinkIcon />
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
              Total Value
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
                  Withdraw
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

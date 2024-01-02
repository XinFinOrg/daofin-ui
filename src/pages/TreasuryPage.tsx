import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Page } from "../components";
import { useNetwork } from "../contexts/network";
import { ArrowForwardIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { TreasuryIcon } from "../utils/assets/icons";
import { XdcIcon } from "../utils/assets/icons/XdcIcon";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";

import { zeroAddress } from "viem";
import { WalletAddressCardWithBalance } from "../components/WalletAddressCard";

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const TreasuryPage = () => {
  const { network } = useNetwork();
  return (
    <Page>
      <Text fontWeight={"semibold"} fontSize={"lg"}>
        Community
      </Text>

      <Box
        bgColor={useColorModeValue("gray.50", "gray.900")}
        p={"6"}
        mr={4}
        borderRadius={"lg"}
        border={"1px"}
        borderColor={"blue.50"}
        boxShadow={"sm"}
        w={"full"}
        mb={"4"}
      >
        <HStack justifyContent={"space-between"} mb={4}>
          <HStack>
            <Box></Box>
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
                View contract
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
              $ 200,900
            </Text>
          </Box>
          <HStack>
            <Button variant={"outline"}>Withdraw</Button>
            <Button colorScheme="blue">+ Add Fund</Button>
          </HStack>
        </HStack>
      </Box>
      <Box
        bgColor={useColorModeValue("blue.50", "gray.900")}
        p={"6"}
        mr={4}
        borderRadius={"lg"}
        border={"1px"}
        borderColor={"blue.50"}
        boxShadow={"sm"}
        w={"full"}
        mb={"4"}
      >
        <HStack>
          <VStack w={"50%"}>
            <HStack
              bgColor={useColorModeValue("gray.50", "gray.900")}
              p={"6"}
              mr={4}
              borderRadius={"lg"}
              border={"1px"}
              borderColor={"blue.50"}
              boxShadow={"sm"}
              w={"full"}
              justifyContent={"space-between"}
            >
              <HStack>
                <Box w={"35px"}>
                  <XdcIcon />
                </Box>
                <Text fontSize={"md"} fontWeight={"semibold"}>
                  XDC
                  <Text fontSize={"xs"} fontWeight={"normal"}>
                    $ 0.23
                  </Text>
                </Text>
              </HStack>

              <Box>
                <Text>100 XDC</Text>
                <Text>$ 1.023</Text>
              </Box>
            </HStack>
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
      </Box>
      <HStack>
        <Box
          bgColor={useColorModeValue("gray.50", "gray.900")}
          p={"6"}
          mr={4}
          borderRadius={"lg"}
          border={"1px"}
          borderColor={"blue.50"}
          boxShadow={"sm"}
          w={"50%"}
          mb={"4"}
        >
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

          <VStack>
            <WalletAddressCardWithBalance
              sm
              symbol="XDC"
              address={zeroAddress}
              balance={0}
            />
          </VStack>
        </Box>
        <Box
          bgColor={useColorModeValue("gray.50", "gray.900")}
          p={"6"}
          borderRadius={"lg"}
          border={"1px"}
          borderColor={"blue.50"}
          boxShadow={"sm"}
          w={"50%"}
          mb={"4"}
        >
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
            <WalletAddressCardWithBalance
              sm
              symbol="XDC"
              address={zeroAddress}
              balance={0}
            />
          </VStack>
        </Box>
      </HStack>
    </Page>
  );
};

export default TreasuryPage;

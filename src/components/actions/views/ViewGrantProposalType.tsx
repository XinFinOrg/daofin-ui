import { FC } from "react";
import { Box, HStack, Text, VStack, useBreakpoint } from "@chakra-ui/react";
import { XdcIcon } from "../../../utils/assets/icons/XdcIcon";
import { weiBigNumberToFormattedNumber } from "../../../utils/numbers";
import { CHAIN_METADATA } from "../../../utils/networks";
import { WalletAddressCard } from "../../WalletAddressCard";
import { ArrowDownIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { useNetwork } from "../../../contexts/network";
import { v4 as uuid } from "uuid";
import { useAppGlobalConfig } from "../../../contexts/AppGlobalConfig";
import { DaoAction } from "@xinfin/osx-client-common";
import { DefaultAlert } from "../../Alerts";
import { formatEther } from "viem";
const ViewGrantProposalType: FC<DaoAction & { from?: string }> = ({
  to,
  value,
  from,
}) => {
  const { network } = useNetwork();
  const { daoAddress } = useAppGlobalConfig();
  const breakpoint = useBreakpoint();

  return (
    <>
      {
        <VStack alignItems={"flex-start"} key={uuid()}>
          <DefaultAlert
            fontWeight={"semibold"}
            width={"full"}
            alignItems="center"
            justifyContent="center"
            textAlign={"center"}
            p={4}
          >
            <HStack justifyContent={"center"}>
              <Box w={"20px"}>
                <XdcIcon />
              </Box>
              <Text>
                {formatEther(value)}
                {CHAIN_METADATA[network].nativeCurrency.symbol}
              </Text>
            </HStack>
          </DefaultAlert>
          <HStack
            justifyContent={"start"}
            w={"full"}
            flexDirection={["column", "column", "column", "column", "row"]}
          >
            <Box
              // bgColor={"blue.100"}

              width={"full"}
              borderRadius={"md"}
              justifySelf={"stretch"}
            >
              <WalletAddressCard sm address={from ? from : daoAddress} />
            </Box>{" "}
            <Box>
              {breakpoint === "xl" ? <ArrowForwardIcon /> : <ArrowDownIcon />}
            </Box>
            <Box borderRadius={"md"} width={"full"}>
              <WalletAddressCard sm address={to} />
            </Box>
          </HStack>
        </VStack>
      }
    </>
  );
};

export default ViewGrantProposalType;

import  { FC } from "react";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { XdcIcon } from "../../../utils/assets/icons/XdcIcon";
import { weiBigNumberToFormattedNumber } from "../../../utils/numbers";
import { CHAIN_METADATA } from "../../../utils/networks";
import { WalletAddressCard } from "../../WalletAddressCard";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useNetwork } from "../../../contexts/network";
import { v4 as uuid } from "uuid";
import { useAppGlobalConfig } from "../../../contexts/AppGlobalConfig";
import { DaoAction } from "@xinfin/osx-client-common";
import { DefaultAlert } from "../../Alerts";
const ViewGrantProposalType: FC<DaoAction & { from?: string }> = ({
  
  to,
  value,
  from,
}) => {
  const { network } = useNetwork();
  const { daoAddress } = useAppGlobalConfig();
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
                {weiBigNumberToFormattedNumber(value.toString())}{" "}
                {CHAIN_METADATA[network].nativeCurrency.symbol}
              </Text>
            </HStack>
          </DefaultAlert>
          <HStack
            justifyContent={"start"}
            w={"full"}
            flexDirection={["column", "column", "row"]}
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
              <ArrowForwardIcon />
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

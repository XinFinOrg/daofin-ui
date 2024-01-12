import React, { FC } from "react";
import { Proposal } from "../../../utils/types";
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
const ViewGrantProposalType: FC<DaoAction> = ({ data, to, value }) => {
  const { network } = useNetwork();
  const { daoAddress } = useAppGlobalConfig();
  return (
    <>
      {
        <VStack p={5} alignItems={"flex-start"} key={uuid()}>
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
          <HStack justifyContent={"start"} w={"full"}>
            <Box
              // bgColor={"blue.100"}
              p={2}
              width={"full"}
              borderRadius={"md"}
              justifySelf={"stretch"}
            >
              <WalletAddressCard sm address={daoAddress} />
            </Box>{" "}
            <Box>
              <ArrowForwardIcon />
            </Box>
            <Box
              // bgColor={"blue.100"}
              p={2}
              borderRadius={"md"}
              width={"full"}
            >
              <WalletAddressCard sm address={to} />
            </Box>
          </HStack>
        </VStack>
      }
    </>
  );
};

export default ViewGrantProposalType;

import {
  Box,
  HStack,
  IconButton,
  Text,
  useClipboard,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { jsNumberForAddress } from "react-jazzicon";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { CHAIN_METADATA, shortenAddress } from "../utils/networks";
import { CheckIcon, CopyIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useNetwork } from "../contexts/network";

interface WalletAddressCardWithBalanceProps {
  address: string;
  sm?: true;
  balance: number;
  symbol: string;
}
const WalletAddressCardWithBalance: FC<WalletAddressCardWithBalanceProps> = ({
  address,
  sm,
  balance,
  symbol,
}) => {
  const { onCopy, hasCopied } = useClipboard(address);
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();
  const { network } = useNetwork();
  useEffect(() => {
    const timeout = setTimeout(() => {
      setClicked(false);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [hasCopied]);

  const handleCopyClick = () => {
    onCopy();
    setClicked(true);
  };
  return (
    <HStack
      bgColor={useColorModeValue("white", "black")}
      p={2}
      pl={2}
      boxShadow={"sm"}
      borderRadius={"md"}
      alignItems={"center"}
      cursor={"pointer"}
      justifyContent={"space-between"}
      w={"full"}
    >
      <HStack>
        <Box mt={"0.5"} w={"10%"} mr={"4"}>
          <Jazzicon
            diameter={sm ? 25 : 50}
            seed={jsNumberForAddress(address)}
          />
        </Box>
        <Text fontSize="md" fontWeight={"medium"} onClick={handleCopyClick}>
          {shortenAddress(address)}
        </Text>
        {clicked ? (
          <CheckIcon />
        ) : (
          <IconButton
            bgColor="unset"
            color="unset"
            size={"xs"}
            as={CopyIcon}
            aria-label=""
            onClick={handleCopyClick}
          />
        )}
      </HStack>
      <HStack fontSize={"sm"} fontWeight={"semibold"}>
        <Text>{balance} </Text>
        <Text>{symbol} </Text>
      </HStack>
    </HStack>
  );
};

export default WalletAddressCardWithBalance;

import {
  Box,
  HStack,
  IconButton,
  Text,
  VStack,
  useClipboard,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { jsNumberForAddress } from "react-jazzicon";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { CHAIN_METADATA, shortenAddress } from "../../utils/networks";
import {
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useNetwork } from "../../contexts/network";
import { toStandardFormatString } from "../../utils/date";
import { WalletCardBox } from "../Box";

interface WalletAddressCardWithDateProps {
  address: string;
  date: Date;
  sm?: true;
}
const WalletAddressCardWithDate: FC<WalletAddressCardWithDateProps> = ({
  address,
  date,
  sm,
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
    <WalletCardBox w={"full"} px={4} py={2}>
      <HStack alignItems={"center"} justifyContent={"flex-start"}>
        <VStack spacing={"0"}>
          <HStack>
            <Box mt={"0.5"}>
              <Jazzicon diameter={25} seed={jsNumberForAddress(address)} />
            </Box>
            <Text fontSize="md" fontWeight={"500"} onClick={handleCopyClick}>
              {shortenAddress(address)}
            </Text>
            <Box w={"25px"}>
              {clicked ? (
                <IconButton
                  bgColor="unset"
                  color="unset"
                  size={"xs"}
                  as={CheckIcon}
                  aria-label=""
                  w={"5"}
                  h={"5"}
                />
              ) : (
                <IconButton
                  w={"5"}
                  h={"5"}
                  bgColor="unset"
                  color="unset"
                  size={"xs"}
                  as={CopyIcon}
                  aria-label=""
                  onClick={handleCopyClick}
                />
              )}
            </Box>
            <Box w={"1%"}>
              <IconButton
                w={"5"}
                h={"5"}
                aria-label=""
                onClick={() =>
                  window.open(
                    `${CHAIN_METADATA[network].explorer}/address/${address}`,
                    "_blank"
                  )
                }
                size={"xs"}
                bgColor="unset"
                color="unset"
                as={ExternalLinkIcon}
              />
            </Box>
          </HStack>
          <HStack>
            <TimeIcon boxSize={"3"} />
            <Text fontSize={"xs"} fontWeight={"normal"}>
              {toStandardFormatString(date)}
            </Text>
          </HStack>
        </VStack>
      </HStack>
    </WalletCardBox>
  );
};

export default WalletAddressCardWithDate;

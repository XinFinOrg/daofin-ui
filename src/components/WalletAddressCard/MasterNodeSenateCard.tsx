import {
  Box,
  HStack,
  IconButton,
  Text,
  VStack,
  useClipboard,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { CHAIN_METADATA, shortenAddress } from "../../utils/networks";
import {
  CheckCircleIcon,
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import { jsNumberForAddress } from "react-jazzicon";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { useNetwork } from "../../contexts/network";
import { useNavigate } from "react-router-dom";
import { BlockIcon } from "../../utils/assets/icons";
import { zeroAddress } from "viem";
import { toStandardFormatString } from "../../utils/date";
import { WalletCardBox } from "../Box";

interface MasterNodeSenateCardProps {
  address: string;
  masterNodeAddress: string;
  joinedDate: Date;
  blockNumber: number;
  txHash?: string;
}
const MasterNodeSenateCard: FC<MasterNodeSenateCardProps> = ({
  address,
  blockNumber,
  joinedDate,
  masterNodeAddress,
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
      <HStack justifyContent={"space-between"} alignItems={'flex-start'} wrap={'wrap'}>
        <VStack spacing={"0"} alignItems={"flex-start"}>
          <HStack>
            <Box mt={"0.5"}>
              <Jazzicon diameter={25} seed={jsNumberForAddress(address)} />
            </Box>
            <Text fontSize="md" fontWeight={"500"} onClick={handleCopyClick}>
              {shortenAddress(address)}
            </Text>
            <Box>
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
              {toStandardFormatString(joinedDate)}
            </Text>
          </HStack>
          <HStack>
            <BlockIcon boxSize={"3"} />
            <Text fontSize={"xs"} fontWeight={"normal"}>
              {blockNumber}
            </Text>
          </HStack>
        </VStack>
          <HStack>
            <CheckCircleIcon boxSize={"3"} color={"green"} />

            <Text fontSize={"xs"} fontWeight={"normal"}>
              Registered By {shortenAddress(masterNodeAddress)}{" "}
            </Text>
            <Box>
              <IconButton
                w={"3"}
                h={"3"}
                aria-label=""
                onClick={() =>
                  window.open(
                    `${CHAIN_METADATA[network].explorer}/address/${masterNodeAddress}`,
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
      </HStack>
    </WalletCardBox>
  );
};

export default MasterNodeSenateCard;

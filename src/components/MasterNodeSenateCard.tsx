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
import { CHAIN_METADATA, shortenAddress } from "../utils/networks";
import {
  CheckCircleIcon,
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import { jsNumberForAddress } from "react-jazzicon";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { useNetwork } from "../contexts/network";
import { useNavigate } from "react-router-dom";
import { BlockIcon } from "../utils/assets/icons";
import { zeroAddress } from "viem";

interface MasterNodeSenateCardProps {
  address: string;
  masterNodeAddress: string;
  joinedDate: Date;
  blockNumber: number;
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
    <VStack
      alignItems={"flex-start"}
      bgColor={useColorModeValue("white", "black")}
      p={1}
      pb={0}
      mb={0}
      pl={2}
      boxShadow={"sm"}
      borderRadius={"md"}
      gap={0}
    >
      <HStack alignItems={"center"} justifyContent={"space-between"} w={"full"}>
        <Box mt={"0.5"}>
          <Jazzicon diameter={25} seed={jsNumberForAddress(address)} />
        </Box>
        <Text
          w={"md"}
          fontSize="md"
          fontWeight={"medium"}
          onClick={handleCopyClick}
        >
          {shortenAddress(address)}
        </Text>
        <Box>
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
        </Box>

        <IconButton
          aria-label=""
          onClick={() =>
            window.open(
              `${CHAIN_METADATA[network].explorer}/address/${address}`,
              "_blank"
            )
          }
          size={"lg"}
          icon={<ExternalLinkIcon />}
          variant={"unstyled"}
        />
      </HStack>
      <VStack
        alignItems={"flex-start"}
        pl={4}
        fontSize={"sm"}
        fontWeight={"normal"}
        gap={0}
        pb={4}
        flexWrap={"wrap"}
      >
        <Text>
          <TimeIcon mr={1} />
          {joinedDate.toISOString()}
        </Text>
        <HStack>
          <BlockIcon w={"15px"} />
          <Text>{blockNumber}</Text>
        </HStack>
        <Text>
          <CheckCircleIcon color={"green"} mr={1} />
          Registered by {shortenAddress(zeroAddress)} <CopyIcon />
        </Text>
      </VStack>
    </VStack>
  );
};

export default MasterNodeSenateCard;

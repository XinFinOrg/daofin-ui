import { Box, HStack, IconButton, Text, useClipboard, useColorModeValue } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { jsNumberForAddress } from "react-jazzicon";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { CHAIN_METADATA, shortenAddress } from "../utils/networks";
import { CheckIcon, CopyIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useNetwork } from "../contexts/network";

interface WalletAddressCardProps {
  address: string;
  sm?: true;
}
const WalletAddressCard: FC<WalletAddressCardProps> = ({ address, sm }) => {
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
      p={1}
      pl={2}
      boxShadow={"sm"}
      borderRadius={"md"}
      alignItems={"center"}
      justifyContent={"space-between"}
      cursor={"pointer"}
      w={"full"}
    >
      <Box mt={"0.5"} w={"10%"}>
        <Jazzicon diameter={sm ? 25 : 50} seed={jsNumberForAddress(address)} />
      </Box>
      <Text
        w={"md"}
        fontSize="md"
        fontWeight={"medium"}
        onClick={handleCopyClick}
      >
        {shortenAddress(address)}
      </Text>
      <Box w={"10%"}>
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
  );
};

export default WalletAddressCard;

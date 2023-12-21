import { Box, HStack, IconButton, Text, useClipboard } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { jsNumberForAddress } from "react-jazzicon";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { shortenAddress } from "../utils/networks";
import { CheckIcon, CopyIcon } from "@chakra-ui/icons";

interface WalletAddressCardProps {
  address: string;
  sm?: true;
}
const WalletAddressCard: FC<WalletAddressCardProps> = ({ address, sm }) => {
  const { onCopy, hasCopied } = useClipboard(address);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setClicked(false);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [hasCopied]);

  return (
    <HStack
      bgColor={"white"}
      p={2}
      boxShadow={"sm"}
      borderRadius={"md"}
      alignItems={"center"}
      cursor={"pointer"}
      w={"full"}
      onClick={() => {
        onCopy();
        setClicked(true);
      }}
    >
      <Box mt={"0.5"} w={"10%"}>
        <Jazzicon diameter={sm ? 25 : 50} seed={jsNumberForAddress(address)} />
      </Box>
      <Text w={"md"} fontSize="md" fontWeight={"medium"}>
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
          />
        )}
      </Box>
    </HStack>
  );
};

export default WalletAddressCard;

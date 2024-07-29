import {
  Box,
  HStack,
  IconButton,
  Text,
  VStack,
  useBreakpoint,
  useClipboard,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { jsNumberForAddress } from "react-jazzicon";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import {
  CHAIN_METADATA,
  makeBlockScannerHashUrl,
  shortenAddress,
} from "../../utils/networks";
import {
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import { useNetwork } from "../../contexts/network";
import { WalletCardBox } from "../Box";
import { toStandardFormatString } from "../../utils/date";
import { numberWithCommaSeparate } from "../../utils/numbers";

interface SecondaryWalletAddressCardProps {
  address: string;
  sm?: true;
  balance: string | number;
  symbol: string;
  date: Date;
  reference: string;
  txHash?: string;
}
const SecondaryWalletAddressCard: FC<SecondaryWalletAddressCardProps> = ({
  address,
  balance,
  symbol,
  date,
  reference,
  txHash,
}) => {
  const { onCopy, hasCopied } = useClipboard(address);
  const [clicked, setClicked] = useState(false);
  const { network } = useNetwork();
  useEffect(() => {
    const timeout = setTimeout(() => {
      setClicked(false);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [hasCopied]);
  const bp = useBreakpoint();
  const handleCopyClick = () => {
    onCopy();
    setClicked(true);
  };

  const convertReferenceToBetterNames = (reference: string) => {
    switch (reference) {
      case "Native Deposit":
        return reference;
      default:
        return "Unknown";
    }
  };
  return (
    <WalletCardBox w={"full"} px={4} py={2}>
      <HStack
        flexDir={["column", "row"]}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <HStack>
          <Box mt={"2"} mb={"1"}>
            <Jazzicon
              diameter={bp === "xs" ? 20 : 30}
              seed={jsNumberForAddress(address)}
            />
          </Box>
          <VStack spacing={"0"} alignItems={"start"}>
            <HStack>
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

            {txHash && (
              <a
                href={makeBlockScannerHashUrl(network, txHash)}
                target="_blank"
              >
                <HStack>
                  <Text fontSize={"xs"} fontWeight={"normal"}>
                    <Text fontSize={"xs"} fontWeight="normal">
                      View on Explorer
                    </Text>
                  </Text>
                </HStack>
              </a>
            )}
          </VStack>
        </HStack>
        <VStack alignItems={'end'}>
          <HStack fontSize={"sm"} fontWeight={"semibold"} color={'lightgreen'}>
            <Text>+ {numberWithCommaSeparate(balance)} </Text>
            <Text>{symbol} </Text>
          </HStack>
          <Text fontSize={"xs"} fontWeight="normal">
            {convertReferenceToBetterNames(reference)}{" "}
          </Text>
        </VStack>
      </HStack>
    </WalletCardBox>
  );
};

export default SecondaryWalletAddressCard;

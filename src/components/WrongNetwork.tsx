import React from "react";
import { useNetwork } from "../contexts/network";
import { useWallet } from "../hooks/useWallet";
import { Box, Text } from "@chakra-ui/react";

function WrongNetwork() {
  const { network } = useNetwork();
  const { isConnected } = useWallet();
  return (
    <>
      {isConnected && network === "unsupported" && (
        <Box bgColor={"red.300"} className="w-full">
          <Text colorScheme="gray" fontSize='xs'>Wrong Network</Text>
        </Box>
      )}
    </>
  );
}

export default WrongNetwork;

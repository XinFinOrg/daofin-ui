import { HStack, Text, VStack } from "@chakra-ui/react";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import React, { FC } from "react";
import { DefaultButton } from "../Button";
import { useWalletConnectors } from "@rainbow-me/rainbowkit/dist/wallets/useWalletConnectors";
import { Link } from "react-router-dom";

const NoMasterNodeAllowedModalContent: FC<{
  callbackFunction?: () => void;
}> = ({ callbackFunction }) => {
  return (
    <VStack>
      <Text>Do you want to become a Master Node Deletegatee Senate?</Text>

      <Link to={"/community/masternode-delegatee-senate"} target="_blank">
        <DefaultButton> Go to the Senate page</DefaultButton>
      </Link>
    </VStack>
  );
};

export default NoMasterNodeAllowedModalContent;

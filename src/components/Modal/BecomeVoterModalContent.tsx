import { HStack, Text, VStack } from "@chakra-ui/react";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import React, { FC } from "react";
import { DefaultButton } from "../Button";
import { useWalletConnectors } from "@rainbow-me/rainbowkit/dist/wallets/useWalletConnectors";
import { Link } from "react-router-dom";

const BecomeVoterModalContent: FC<{ callbackFunction: () => void }> = ({
  callbackFunction,
}) => {
  const { openConnectModal } = useConnectModal();
  return (
    <VStack>
      <Text>Do you want to become a voter?</Text>

      <Link to={"/community"} target="_blank">
        <DefaultButton> Go to Community page</DefaultButton>
      </Link>
    </VStack>
  );
};

export default BecomeVoterModalContent;

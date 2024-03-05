import { HStack } from "@chakra-ui/react";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import React, { FC } from "react";
import { DefaultButton } from "../Button";
import { useWalletConnectors } from "@rainbow-me/rainbowkit/dist/wallets/useWalletConnectors";

const ConnecToWalletModalContent: FC<{ callbackFunction: () => void }> = ({
  callbackFunction,
}) => {
  const { openConnectModal } = useConnectModal();
  return (
    <HStack justifyContent={"center"} alignItems={"center"}>
      <DefaultButton
        onClick={() => {
          if (openConnectModal) openConnectModal();
          callbackFunction();
        }}
      >
        Connect your wallet
      </DefaultButton>
    </HStack>
  );
};

export default ConnecToWalletModalContent;

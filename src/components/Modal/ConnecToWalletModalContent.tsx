import { HStack } from "@chakra-ui/react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { FC } from "react";
import { DefaultButton } from "../Button";

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

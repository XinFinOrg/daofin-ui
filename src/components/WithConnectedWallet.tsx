import React, { FC, PropsWithChildren } from "react";
import { useWallet } from "../hooks/useWallet";
import { Web3Button } from "@web3modal/react";
import { Button } from "@chakra-ui/button";

const WithConnectedWallet: FC<PropsWithChildren> = ({ children }) => {
  const { address, isOnWrongNetwork } = useWallet();
  return <>{address ? children : ""}</>;
};

export default WithConnectedWallet;

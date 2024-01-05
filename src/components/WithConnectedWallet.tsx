import React, { FC, PropsWithChildren } from "react";
import { useWallet } from "../hooks/useWallet";

const WithConnectedWallet: FC<PropsWithChildren> = ({ children }) => {
  const { address } = useWallet();
  return <>{address ? children : ""}</>;
};

export default WithConnectedWallet;

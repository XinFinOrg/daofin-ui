import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { FC, PropsWithChildren } from "react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { xdcTestnet, xdc } from "wagmi/chains";

const WagmiProvider: FC<PropsWithChildren> = ({ children }) => {
  const projectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID as string;

  // 2. Create wagmiConfig
  const chains = [xdcTestnet, xdc];
  const { publicClient } = configureChains(chains, [
    w3mProvider({ projectId }),
  ]);
  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, chains }),
    publicClient,
  });

  const ethereumClient = new EthereumClient(wagmiConfig, chains);

  return (
    <WagmiConfig config={wagmiConfig}>
      <>
        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        {children}
      </>
    </WagmiConfig>
  );
};
export default WagmiProvider;

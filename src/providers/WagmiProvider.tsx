import {
  Chain,
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { FC, PropsWithChildren } from "react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { xdcTestnet } from "wagmi/chains";
import {
  injectedWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { publicProvider } from "wagmi/providers/public";
const WagmiProvider: FC<PropsWithChildren> = ({ children }) => {
  const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID as string;
  const chains = [xdcTestnet];
  const { publicClient } = configureChains(chains, [publicProvider()]);

  const connectors = connectorsForWallets([
    {
      groupName: "Recommended",
      wallets: [
        injectedWallet({ chains }),
        walletConnectWallet({ projectId, chains }),
      ],
    },
  ]);
  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });

  return (
    <WagmiConfig config={wagmiConfig}>
      <>
        <RainbowKitProvider chains={chains} modalSize="compact">
          {children}
        </RainbowKitProvider>
      </>
    </WagmiConfig>
  );
};
export default WagmiProvider;

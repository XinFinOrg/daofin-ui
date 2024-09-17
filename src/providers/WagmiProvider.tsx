import {
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { FC, PropsWithChildren } from "react";
import { Address, configureChains, createConfig, WagmiConfig } from "wagmi";
import { xdc, xdcTestnet, polygon } from "wagmi/chains";
import {
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { publicProvider } from "wagmi/providers/public";

const WagmiProvider: FC<PropsWithChildren> = ({ children }) => {
  const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID as string;
  const chains = [
    {
      ...xdcTestnet,
      rpcUrls: {
        default: {
          http: [
            "https://rpc.ankr.com/xdc_testnet/3583202f78729c453907a0326e6341ba382b3210fc4c6d18de3d4f9c0d5a8ba7",
          ],
        },
        public: {
          http: [
            "https://rpc.ankr.com/xdc_testnet/3583202f78729c453907a0326e6341ba382b3210fc4c6d18de3d4f9c0d5a8ba7",
          ],
        },
      },
      contracts: {
        multicall3: {
          address: "0xD4449Bf3f8E6a1b3fb5224F4e1Ec4288BD765547" as Address,
        },
      },
    },
    {
      ...xdc,
      rpcUrls: {
        public: { http: ["https://xdcdaorpc.icotokens.net"] },
        // default: { http: ["https://erpc.xinfin.network"] },
        default: { http: ["https://xdcdaorpc.icotokens.net"] },
      },
      contracts: {
        multicall3: {
          address: "0x0B1795ccA8E4eC4df02346a082df54D437F8D9aF" as Address,
        },
      },
    },
  ];
  const { publicClient } = configureChains(chains, [publicProvider()]);

  const connectors = connectorsForWallets([
    {
      groupName: "Recommended",
      wallets: [
        metaMaskWallet({ projectId, chains }),
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

import {
  InfuraProvider,
  JsonRpcProvider,
  Web3Provider,
} from "@ethersproject/providers";
import React, { createContext, useContext, useEffect, useState } from "react";

import {
  LIVE_CONTRACTS,
  SupportedNetwork as sdkSupportedNetworks,
} from "@xinfin/osx-client-common";

import { useWallet } from "./useWallet";
import { useNetwork } from "../contexts/network";
import {
  CHAIN_METADATA,
  SupportedChainID,
  SupportedNetworks,
  getSupportedNetworkByChainId,
  translateToNetworkishName,
} from "../utils/networks";

// const NW_ARB = { chainId: 42161, name: "arbitrum" };
// const NW_ARB_GOERLI = { chainId: 421613, name: "arbitrum-goerli" };

/* CONTEXT PROVIDER ========================================================= */
type Nullable<T> = T | null;
type Providers = {
  infura: InfuraProvider | JsonRpcProvider;
  web3: Nullable<Web3Provider>;
};

const ProviderContext = createContext<Nullable<Providers>>(null);

type ProviderProviderProps = {
  children: React.ReactNode;
};

/**
 * Returns two blockchain providers.
 *
 * The infura provider is always available, regardless of whether or not a
 * wallet is connected.
 *
 * The web3 provider, however, is based on the conencted and wallet and will
 * therefore be null if no wallet is connected.
 */
export function ProvidersProvider({ children }: ProviderProviderProps) {
  const { provider } = useWallet();
  const { network } = useNetwork();

  const [infuraProvider, setInfuraProvider] = useState<Providers["infura"]>(
    getJsonRpcProvider(network)
  );

  useEffect(() => {
    setInfuraProvider(getInfuraProvider(network));
  }, [network]);

  return (
    <ProviderContext.Provider
      // TODO: remove casting once useSigner has updated its version of the ethers library
      value={{
        infura: infuraProvider,
        web3: (provider as Web3Provider) || null,
      }}
    >
      {children}
    </ProviderContext.Provider>
  );
}

function getInfuraProvider(network: SupportedNetworks) {
  // NOTE Passing the chainIds from useWallet doesn't work in the case of
  // arbitrum and arbitrum-goerli. They need to be passed as objects.
  // However, I have no idea why this is necessary. Looking at the ethers
  // library, there's no reason why passing the chainId wouldn't work. Also,
  // I've tried it on a fresh project and had no problems there...
  if (network == "apothem") {
    return new JsonRpcProvider(CHAIN_METADATA[network].rpc[0], {
      chainId: CHAIN_METADATA[network].id,
      name: translateToNetworkishName(network),
      ensAddress:
        LIVE_CONTRACTS[
          translateToNetworkishName(network) as sdkSupportedNetworks
        ].ensRegistry,
    });
  } else {
    return new JsonRpcProvider(CHAIN_METADATA[network].rpc[0]);
  }
}

/**
 * Returns an AlchemyProvider instance for the given chain ID
 * or null if the API key is not available.
 * @param chainId - The numeric chain ID associated with the desired network.
 * @returns An AlchemyProvider instance for the specified network or null if the API key is not found.
 */

export function getJsonRpcProvider(
  network: SupportedNetworks
): JsonRpcProvider {
  // const translatedNetwork = translateToNetworkishName(network);
  return new JsonRpcProvider(CHAIN_METADATA[network].rpc[0]);
}
/**
 * Returns provider based on the given chain id
 * @param chainId network chain is
 * @returns infura provider
 */
export function useSpecificProvider(
  chainId: SupportedChainID
): Providers["infura"] {
  const network = getSupportedNetworkByChainId(chainId) as SupportedNetworks;

  const [infuraProvider, setInfuraProvider] = useState(
    getJsonRpcProvider(network)
  );

  useEffect(() => {
    setInfuraProvider(getJsonRpcProvider(network));
  }, [chainId, network]);

  return infuraProvider;
}

/* CONTEXT CONSUMER ========================================================= */

export function useProviders(): NonNullable<Providers> {
  return useContext(ProviderContext) as Providers;
}

import {
  Client,
  Context as SdkContext,
  ContextParams,
} from "@xinfin/osx-sdk-client";
import {
  LIVE_CONTRACTS,
  SupportedNetworksArray,
} from "@xinfin/osx-client-common";

import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useWallet } from "./useWallet";
import {
  DaofinClient,
  DaofinContextParams,
  DaofinPluginContext,
} from "@xinfin/osx-daofin-sdk-client";
import {
  CHAIN_METADATA,
  SupportedNetworks,
  translateToAppNetwork,
  translateToNetworkishName,
} from "../utils/networks";
import { Buffer } from "buffer";
import { useNetwork } from "../contexts/network";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
interface ClientContext {
  client?: Client;
  context?: SdkContext;
  daofinClient?: DaofinClient;
  daofinContext?: DaofinPluginContext;
  network?: SupportedNetworks;
}

const UseClientContext = createContext<ClientContext>({} as ClientContext);

export const useClient = () => {
  const client = useContext(UseClientContext);
  if (client === null) {
    throw new Error(
      "useClient() can only be used on the descendants of <UseClientProvider />"
    );
  }
  if (client.context) {
    client.network = translateToAppNetwork(client.context.network);
  }
  return client;
};

export const UseClientProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { signer, provider, address } = useWallet();

  const [client, setClient] = useState<Client>();
  const { network } = useNetwork();

  const [context, setContext] = useState<SdkContext>();

  const [daofinClient, setDaofinClient] = useState<DaofinClient>();
  const [daofinContext, setDaofinContext] = useState<DaofinPluginContext>();
  const { pluginAddress, pluginRepoAddress } = useAppGlobalConfig();

  useEffect(() => {
    const translatedNetwork = translateToNetworkishName(network);

    // when network not supported by the SDK, don't set network
    if (
      translatedNetwork === "unsupported" ||
      !SupportedNetworksArray.includes(translatedNetwork)
    ) {
      return;
    }

    const ipfsNodes = [
      {
        url: `${CHAIN_METADATA[network].ipfs}/api/v0`,
        headers: {
          Authorization: `Basic ${Buffer.from(
            process.env.REACT_APP_IPFS_API_KEY +
              ":" +
              process.env.REACT_APP_IPFS_API_SECRET
          ).toString("base64")}`,
        },
      },
    ];

    const contextParams: ContextParams = {
      daoFactoryAddress: LIVE_CONTRACTS[translatedNetwork].daoFactory,
      network: {
        name: translatedNetwork,
        chainId: CHAIN_METADATA[network].id,
      },
      signer: signer ?? undefined,
      web3Providers: CHAIN_METADATA[network].rpc[0],
      ipfsNodes,
      ensRegistryAddress: LIVE_CONTRACTS[translatedNetwork].ensRegistry,
      graphqlNodes: [{ url: CHAIN_METADATA[network].osxSubgraph }],
    };
    const sdkContext = new SdkContext(contextParams);

    const daofinContext = new DaofinPluginContext({
      ...contextParams,
      graphqlNodes: [{ url: CHAIN_METADATA[network].daofinSubgraph }],
      pluginRepoAddress: pluginRepoAddress,
      pluginAddress: pluginAddress,
    });

    setClient(new Client(sdkContext));
    setDaofinClient(new DaofinClient(daofinContext));
    setContext(sdkContext);
    setDaofinContext(daofinContext);
  }, [network, signer, address]);

  const value: ClientContext = {
    client,
    context,
    daofinClient,
    daofinContext,
  };

  return (
    <UseClientContext.Provider value={value}>
      {children}
    </UseClientContext.Provider>
  );
};

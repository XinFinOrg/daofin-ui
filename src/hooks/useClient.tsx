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
  SUBGRAPH_API_URL,
  SupportedNetworks,
  translateToAppNetwork,
  translateToNetworkishName,
} from "../utils/networks";
import { Buffer } from "buffer";
import { useNetwork } from "../contexts/network";
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
  const { signer, provider } = useWallet();
  console.log({signer});
  console.log(provider?.getSigner());
  
  const [client, setClient] = useState<Client>();
  const { network } = useNetwork();
  const [context, setContext] = useState<SdkContext>();

  const [daofinClient, setDaofinClient] = useState<DaofinClient>();
  const [daofinContext, setDaofinContext] = useState<DaofinPluginContext>();

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
    console.log("0 signer",signer);
    console.log("netwrok",{
      name: translatedNetwork,
      chainId: CHAIN_METADATA[network].id,
    });
    
    const contextParams: ContextParams = {
      daoFactoryAddress: LIVE_CONTRACTS[translatedNetwork].daoFactory,
      network: {
        name: translatedNetwork,
        chainId: CHAIN_METADATA[network].id,
      },
      signer: provider?.getSigner() ?? undefined,
      web3Providers: CHAIN_METADATA[network].rpc[0],
      ipfsNodes,
      ensRegistryAddress: LIVE_CONTRACTS[translatedNetwork].ensRegistry,
      graphqlNodes: [{ url: SUBGRAPH_API_URL[network]! }],
    };
    const sdkContext = new SdkContext(contextParams);

    const daofinContext = new DaofinPluginContext({
      ...contextParams,
      pluginRepoAddress: "0x9C428271bD37BE705c0bB6c39669964A776Abb9f",
      pluginAddress: "0x0bc8cb9529E01c0De2C5516Dc228b0C0E268556a",
    });

    setClient(new Client(sdkContext));
    setDaofinClient(new DaofinClient(daofinContext));
    setContext(sdkContext);
    setDaofinContext(daofinContext);
  }, [network, signer]);

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

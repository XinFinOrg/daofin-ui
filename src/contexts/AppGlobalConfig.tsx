import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useNetwork } from "./network";

export type ContractsObj = {
  daoAddress: string;
  pluginAddress: string;
  pluginRepoAddress: string;
  votingStatsAddress: string;
};
export type AppGlobalConfigContextType = {
  [network: string]: ContractsObj;
};
const initialState = {
  apothem: {
    daoAddress: import.meta.env.VITE_DAOFIN_DAO_ADDRESS_APOTHEM as string,
    pluginAddress: import.meta.env.VITE_DAOFIN_PLUGIN_ADDRESS_APOTHEM as string,
    pluginRepoAddress: import.meta.env
      .VITE_DAOFIN_PLUGIN_REPO_ADDRESS_APOTHEM as string,
    votingStatsAddress: import.meta.env
      .VITE_DAOFIN_VOTING_STATS_APOTHEM as string,
  },
  xdc: {
    daoAddress: import.meta.env.VITE_DAOFIN_DAO_ADDRESS as string,
    pluginAddress: import.meta.env.VITE_DAOFIN_PLUGIN_ADDRESS as string,
    pluginRepoAddress: import.meta.env
      .VITE_DAOFIN_PLUGIN_REPO_ADDRESS as string,
    votingStatsAddress: import.meta.env.VITE_DAOFIN_VOTING_STATS as string,
  },
};
const AppGlobalConfigContext =
  createContext<AppGlobalConfigContextType>(initialState);

export const AppGlobalConfigProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const value = useMemo(() => initialState, []);
  return (
    <AppGlobalConfigContext.Provider value={value}>
      {children}
    </AppGlobalConfigContext.Provider>
  );
};
export const useAppGlobalConfig = (): ContractsObj => {
  const { network } = useNetwork();
  const app = useContext(AppGlobalConfigContext);
  return app[network];
};

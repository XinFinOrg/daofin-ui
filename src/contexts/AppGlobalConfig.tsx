import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from "react";

export type AppGlobalConfigContextType = {
  daoAddress: string;
  pluginAddress: string;
  pluginRepoAddress: string;
  votingStatsAddress: string;
};
const initialState = {
  daoAddress: import.meta.env.VITE_DAOFIN_DAO_ADDRESS as string,
  pluginAddress: import.meta.env.VITE_DAOFIN_PLUGIN_ADDRESS as string,
  pluginRepoAddress: import.meta.env.VITE_DAOFIN_PLUGIN_REPO_ADDRESS as string,
  votingStatsAddress: import.meta.env.VITE_DAOFIN_VOTING_STATS as string,
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
export const useAppGlobalConfig = (): AppGlobalConfigContextType => {
  return useContext(AppGlobalConfigContext);
};

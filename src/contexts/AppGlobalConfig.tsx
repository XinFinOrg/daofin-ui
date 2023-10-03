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
};
const initialState = {
  daoAddress: process.env.REACT_APP_DAOFIN_DAO_ADDRESS as string,
  pluginAddress: process.env.REACT_APP_DAOFIN_PLUGIN_ADDRESS as string,
  pluginRepoAddress: process.env.REACT_APP_DAOFIN_PLUGIN_REPO_ADDRESS as string,
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

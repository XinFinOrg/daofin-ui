import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNetwork } from "./network";
import { constants } from "ethers";
import { fetchTokenPrice } from "../services/prices";

export interface GlobalStateContextType {
  xdcPrice: number;
}

const GlobalStateContext = createContext<GlobalStateContextType | null>(null);

const GlobalStateProvider: FC<PropsWithChildren> = ({ children }) => {
  const [xdcPrice, setXdcPrice] = useState<number>(0);
  const { network } = useNetwork();
  useEffect(() => {
    fetchTokenPrice(constants.AddressZero, network)
      .then((data) => data && setXdcPrice(data))
      .catch(console.log);
  }, []);
  return (
    <GlobalStateContext.Provider value={{ xdcPrice }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
const useGlobalState = () =>
  useContext(GlobalStateContext) as GlobalStateContextType;
export { GlobalStateProvider, useGlobalState };

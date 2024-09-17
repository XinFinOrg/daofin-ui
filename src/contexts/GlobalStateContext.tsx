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
import { useTranslation } from "react-i18next";

export type LangType = "en" | "jpn";
export const langs: LangType[] = ["en", "jpn"];
export interface GlobalStateContextType {
  xdcPrice: number;
  lang: LangType;
  switchLanguage: (lng: string) => void;
}

const GlobalStateContext = createContext<GlobalStateContextType | null>(null);

const GlobalStateProvider: FC<PropsWithChildren> = ({ children }) => {
  const [xdcPrice, setXdcPrice] = useState<number>(0);
  const [lang, setLang] = useState<LangType>("en");
  const { i18n } = useTranslation();
  const { network } = useNetwork();
  useEffect(() => {
    fetchTokenPrice(constants.AddressZero, network)
      .then((data) => data && setXdcPrice(data))
      .catch(console.log);
  }, []);

  const switchLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  return (
    <GlobalStateContext.Provider value={{ xdcPrice, lang, switchLanguage }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
const useGlobalState = () =>
  useContext(GlobalStateContext) as GlobalStateContextType;
export { GlobalStateProvider, useGlobalState };

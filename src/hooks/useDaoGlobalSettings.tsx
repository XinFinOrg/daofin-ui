import { useEffect, useMemo, useState } from "react";
import { useClient } from "./useClient";
import { useNetwork } from "../contexts/network";
import { GlobalSettings } from "@xinfin/osx-daofin-sdk-client";

function useDaoGlobalSettings(): {
  data: GlobalSettings | undefined;
  error: string;
  isLoading: boolean;
} {
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>();
  const { daofinClient, client } = useClient();
  const { network } = useNetwork();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!daofinClient) return;
    setIsLoading(true);

    daofinClient.methods
      .getGlobalSettings()
      .then((data) => {
        setIsLoading(false);
        setGlobalSettings(data as GlobalSettings);
      })
      .catch((e) => {
        setIsLoading(false);
        console.log("error", e);
      });
  }, [daofinClient]);

  return { data: globalSettings, isLoading, error };
}
export default useDaoGlobalSettings;

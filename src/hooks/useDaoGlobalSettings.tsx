import { useEffect, useMemo, useState } from "react";
import { useClient } from "./useClient";
import { useNetwork } from "../contexts/network";
import { GlobalSettings } from "@xinfin/osx-daofin-sdk-client";

function useDaoGlobalSettings(daoAddress: string) {
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>();
  const { daofinClient,client } = useClient();
  const { network } = useNetwork();
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!daofinClient) return;
    setIsLoading(true);
    console.log({client});
    console.log({daofinClient});
    
    daofinClient.methods
      .getGlobalSettings(daoAddress)
      .then((data) => {
        setIsLoading(false);
        setGlobalSettings(data);
      })
      .catch((e) => {
        setIsLoading(false);
        console.log("error", e);
      });
  }, [daofinClient]);

  return globalSettings;
}
export default useDaoGlobalSettings;

import { useEffect, useState } from "react";
import { useClient } from "./useClient";
import { GlobalSettings } from "@xinfin/osx-daofin-sdk-client";

function useDaoGlobalSettings(): {
  data: GlobalSettings | undefined;
  error: string;
  isLoading: boolean;
} {
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>();
  const { daofinClient } = useClient();
  const [error] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!daofinClient) return;
    setIsLoading(true);

    daofinClient.methods
      .getGlobalSettings()
      .then((data: GlobalSettings) => {
        setIsLoading(false);
        setGlobalSettings(data as GlobalSettings);
      })
      .catch((e: any) => {
        setIsLoading(false);
        console.log("error", e);
      });
  }, [daofinClient]);

  return { data: globalSettings, isLoading, error };
}
export default useDaoGlobalSettings;

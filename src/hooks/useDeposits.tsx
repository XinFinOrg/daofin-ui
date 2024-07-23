import { useEffect, useState } from "react";
import { useClient } from "./useClient";
import { getPluginInstallationId } from "../utils/networks";
import { Deposit } from "../utils/types";

import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
const DepositsQueries = `
query DepositsQueries($pluginId: ID!) {
  pluginDeposits(where: {plugin: $pluginId}) {
    id
    voter
    isActive
    startOfCooldownPeriod
    snapshotBlock
    endOfCooldownPeriod
    requestToResignTimestamp
    claimTimestamp
    amount
  }
}
`;
function usePeoplesHouseDeposits(): {
  data: Deposit[];
  error: string;
  isLoading: boolean;
} {
  const { daofinClient } = useClient();
  const { daoAddress, pluginAddress } = useAppGlobalConfig();
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!daofinClient) return;
    setIsLoading(true);
    daofinClient.graphql
      .request<{ pluginDeposits: Deposit[] }>({
        query: DepositsQueries,
        params: {
          pluginId: getPluginInstallationId(daoAddress, pluginAddress),
        },
      })
      .then(({ pluginDeposits }) => {
        setDeposits(pluginDeposits as unknown as Deposit[]);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e);
        console.log("error", e);
      });
  }, [daofinClient]);

  return { data: deposits, error: error, isLoading };
}
export default usePeoplesHouseDeposits;

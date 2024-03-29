import { useEffect, useState } from "react";
import { useClient } from "./useClient";
import { getPluginInstallationId } from "../utils/networks";
import { Judiciary,  } from "../utils/types";
const PluginJudiciariesQueries = `
query PluginJudiciariesQuery($pluginId: ID!) {
  pluginJudiciaries(where:{ plugin: $pluginId }) {
    id
    member
    snapshotBlock
    txHash
    creationDate
    action
  }
}
`;

function useFetchJudiciaries(
  daoAddress: string,
  pluginAddress: string
): { data: Judiciary[]; error: string; isLoading: boolean } {
  const { daofinClient } = useClient();

  const [judiciaries, setJudiciaries] = useState<Judiciary[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const pluginId = getPluginInstallationId(daoAddress, pluginAddress);
  useEffect(() => {
    if (!daofinClient || !pluginId) return;
    setIsLoading(true);

    daofinClient.graphql
      .request<{ pluginJudiciaries: Judiciary[] }>({
        query: PluginJudiciariesQueries,
        params: {
          pluginId,
        },
      })
      .then((data) => {
        setJudiciaries(data.pluginJudiciaries as unknown as Judiciary[]);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e);
        console.log("error", e);
      });
  }, [daofinClient]);

  return { data: judiciaries, error: error, isLoading };
}
export default useFetchJudiciaries;

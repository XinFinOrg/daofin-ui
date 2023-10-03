import { useEffect, useMemo, useState } from "react";
import { useClient } from "./useClient";
import { useNetwork } from "../contexts/network";
import { GlobalSettings } from "@xinfin/osx-daofin-sdk-client";
import { ProposalsQuery } from "@xinfin/osx-daofin-sdk-client/dist/internal/graphql-queries/proposals";
import { BigNumber, ethers } from "ethers";
import { getPluginInstallationId } from "../utils/networks";
import { ProposalBase, ProposalMetadata } from "@xinfin/osx-client-common";
import { Judiciary, Proposal } from "../utils/types";
import { SubgraphProposalBase } from "@xinfin/osx-daofin-sdk-client";
import { resolveIpfsCid } from "@xinfin/osx-sdk-common";
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

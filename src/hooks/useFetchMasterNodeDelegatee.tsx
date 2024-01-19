import { useEffect, useMemo, useState } from "react";
import { useClient } from "./useClient";
import { useNetwork } from "../contexts/network";
import { GlobalSettings } from "@xinfin/osx-daofin-sdk-client";
import { ProposalsQuery } from "@xinfin/osx-daofin-sdk-client/dist/internal/graphql-queries/proposals";
import { BigNumber, ethers } from "ethers";
import { getPluginInstallationId } from "../utils/networks";
import { ProposalBase, ProposalMetadata } from "@xinfin/osx-client-common";
import { Judiciary, MasterNodeDelegatee, Proposal } from "../utils/types";
import { SubgraphProposalBase } from "@xinfin/osx-daofin-sdk-client";
import { resolveIpfsCid } from "@xinfin/osx-sdk-common";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
const PluginMasterNodeDelegateesQueries = `
query QuerypluginMasterNodeDelegatees($pluginId: ID!) {
  pluginMasterNodeDelegatees(where:{ plugin: $pluginId }) {
    id
    masterNode
    member
    action
    snapshotBlock
    txHash
    creationDate
  }
}
`;

function useFetchMasterNodeDelegatee(): {
  data: MasterNodeDelegatee[];
  error: string;
  isLoading: boolean;
} {
  const { daoAddress, pluginAddress } = useAppGlobalConfig();
  const { daofinClient } = useClient();

  const [masterNodeDelegatees, setMasterNodeDelegatees] = useState<
    MasterNodeDelegatee[]
  >([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const pluginId = getPluginInstallationId(daoAddress, pluginAddress);
  useEffect(() => {
    if (!daofinClient || !pluginId) return;
    setIsLoading(true);

    daofinClient.graphql
      .request<{ pluginMasterNodeDelegatees: MasterNodeDelegatee[] }>({
        query: PluginMasterNodeDelegateesQueries,
        params: {
          pluginId,
        },
      })
      .then((data) => {
        setIsLoading(false);
        setMasterNodeDelegatees(
          data.pluginMasterNodeDelegatees as unknown as MasterNodeDelegatee[]
        );
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e);
        console.log("error", e);
      });
  }, [daofinClient]);

  return { data: masterNodeDelegatees, error: error, isLoading };
}
export default useFetchMasterNodeDelegatee;

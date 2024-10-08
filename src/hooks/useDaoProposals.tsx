import { useEffect, useState } from "react";
import { useClient } from "./useClient";
import { getPluginInstallationId } from "../utils/networks";
import { ProposalMetadata } from "@xinfin/osx-client-common";
import { Proposal } from "../utils/types";
import { resolveIpfsCid } from "@xinfin/osx-sdk-common";
import { TallyDetails } from "@xinfin/osx-daofin-sdk-client";
import { allProposalsByPluginIdQuery } from "../utils/graphql-queries/proposals-query";
import useFetchProposalStatus from "./useFetchProposalStatus";
import { useNetwork } from "../contexts/network";

export type SubgraphProposalBase = {
  id: string;
  dao: {
    id: string;
  };
  creator: string;
  metadata: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  executed: boolean;
  pluginProposalId: string;
  potentiallyExecutable: boolean;
  tallyDetails: TallyDetails[];
  proposalType: {
    proposalTypeId: string;
  };
};
function useDaoProposals(
  daoAddress: string,
  pluginAddress: string
): { data: Proposal[]; error: string; isLoading: boolean } {
  const { daofinClient } = useClient();
  const { network } = useNetwork();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { makeCall } = useFetchProposalStatus();
  useEffect(() => {
    if (!daofinClient) return;
    setIsLoading(true);
    daofinClient.graphql
      .request<{ pluginProposals: SubgraphProposalBase[] }>({
        query: allProposalsByPluginIdQuery,
        params: {
          pluginId: getPluginInstallationId(daoAddress, pluginAddress),
        },
      })
      .then(({ pluginProposals }) => {
        return Promise.all(
          pluginProposals.map(async (item) => {
            const metadataCid = resolveIpfsCid(item.metadata);
            const metadataString = await daofinClient.ipfs.fetchString(
              metadataCid
            );
            const metadata = JSON.parse(metadataString) as ProposalMetadata;
            const status = await makeCall(item.pluginProposalId);

            return {
              ...item,
              metadata,
              ...status,
              // committeesVotes: [...stats],
            };
          })
        );
      })
      .then((data) => {
        setProposals(data as unknown as Proposal[]);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e);
        console.log("error", e);
      });
  }, [daofinClient, network]);

  return { data: proposals, error: error, isLoading };
}
export default useDaoProposals;

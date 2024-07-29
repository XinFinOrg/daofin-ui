import { useEffect, useState } from "react";
import { useClient } from "./useClient";
import { getPluginInstallationId } from "../utils/networks";
import {  VoterOnProposal } from "../utils/types";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
const PluginJudiciariesQueries = `
query pluginProposalVotes($pluginId: ID!, $pluginProposalId: String!, $committee: String!  ) {
  pluginProposalVotes(where:{plugin: $pluginId ,pluginProposalId: $pluginProposalId, committee: $committee}) {
    id
    voter
    committee
    pluginProposalId
    option
    txHash
    creationDate
    snapshotBlock
  }
}
`;

function useFetchVotesOnProposalBasedByCommittee(
  proposalId: string,
  committee: string
): { data: VoterOnProposal[]; error: string; isLoading: boolean } {
  const { daofinClient } = useClient();
  const { daoAddress, pluginAddress } = useAppGlobalConfig();
  const [voters, setVoters] = useState<VoterOnProposal[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const pluginId = getPluginInstallationId(daoAddress, pluginAddress);
  useEffect(() => {
    if (!daofinClient || !pluginId || !proposalId || !committee) return;
    setIsLoading(true);

    daofinClient.graphql
      .request<{ pluginProposalVotes: VoterOnProposal[] }>({
        query: PluginJudiciariesQueries,
        params: {
          pluginId,
          pluginProposalId: proposalId,
          committee,
        },
      })
      .then((data) => {
        setVoters(data.pluginProposalVotes as unknown as VoterOnProposal[]);
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e);
        console.log("error", e);
      });
  }, [daofinClient]);

  return { data: voters, error: error, isLoading };
}
export default useFetchVotesOnProposalBasedByCommittee;

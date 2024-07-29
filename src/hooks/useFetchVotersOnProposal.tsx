import { useEffect, useState } from "react";
import { useClient } from "./useClient";
import { getPluginInstallationId } from "../utils/networks";
import {  VoterOnProposal } from "../utils/types";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
const PluginProposalVotes = `
query pluginProposalVotes($pluginId: ID!, $pluginProposalId: String!  ) {
    pluginProposalVotes(where:{plugin: $pluginId ,pluginProposalId: $pluginProposalId}) {
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

function useFetchVotersOnProposal(proposalId: string): {
  data: VoterOnProposal[];
  error: string;
  isLoading: boolean;
} {
  const { daofinClient } = useClient();
  const { daoAddress, pluginAddress } = useAppGlobalConfig();
  const [voters, setVoters] = useState<VoterOnProposal[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const pluginId = getPluginInstallationId(daoAddress, pluginAddress);
  useEffect(() => {
    if (!daofinClient || !pluginId || !proposalId) return;
    setIsLoading(true);

    daofinClient.graphql
      .request<{ pluginProposalVotes: VoterOnProposal[] }>({
        query: PluginProposalVotes,
        params: {
          pluginId,
          pluginProposalId: proposalId,
        },
      })
      .then((data) => {
        setVoters(data.pluginProposalVotes as unknown as VoterOnProposal[]);
        setIsLoading(true);
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e);
        console.log("error", e);
      });
  }, [daofinClient, proposalId]);

  return { data: voters, error: error, isLoading };
}
export default useFetchVotersOnProposal;

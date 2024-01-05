import { useEffect, useMemo, useState } from "react";
import { useClient } from "./useClient";
import { useNetwork } from "../contexts/network";
import { GlobalSettings, VoteOption } from "@xinfin/osx-daofin-sdk-client";
import { ProposalsQuery } from "@xinfin/osx-daofin-sdk-client/dist/internal/graphql-queries/proposals";
import { BigNumber, ethers } from "ethers";
import { getPluginInstallationId } from "../utils/networks";
import { ProposalBase, ProposalMetadata } from "@xinfin/osx-client-common";
import { Judiciary, Proposal, VoterOnProposal } from "../utils/types";
import { SubgraphProposalBase } from "@xinfin/osx-daofin-sdk-client";
import { resolveIpfsCid } from "@xinfin/osx-sdk-common";
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

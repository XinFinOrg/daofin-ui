import { useEffect, useMemo, useState } from "react";
import { useClient } from "./useClient";
import { useNetwork } from "../contexts/network";
import { GlobalSettings } from "@xinfin/osx-daofin-sdk-client";
import { ProposalsQuery } from "@xinfin/osx-daofin-sdk-client/dist/internal/graphql-queries/proposals";
import { BigNumber, ethers } from "ethers";
import { getPluginInstallationId } from "../utils/networks";
import { ProposalBase, ProposalMetadata } from "@xinfin/osx-client-common";
import { Judiciary, Proposal, VoterOnProposal } from "../utils/types";
import { SubgraphProposalBase } from "@xinfin/osx-daofin-sdk-client";
import { resolveIpfsCid } from "@xinfin/osx-sdk-common";
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

function useFetchVotersOnProposal(
  daoAddress: string,
  pluginAddress: string,
  proposalId: string
): { data: VoterOnProposal[]; error: string; isLoading: boolean } {
  const { daofinClient } = useClient();

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
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e);
        console.log("error", e);
      });
  }, [daofinClient]);

  return { data: voters, error: error, isLoading };
}
export default useFetchVotersOnProposal;

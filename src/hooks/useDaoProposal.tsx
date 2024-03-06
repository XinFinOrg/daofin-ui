import { useEffect, useState } from "react";
import { useClient } from "./useClient";
import {  ProposalMetadata } from "@xinfin/osx-client-common";
import { Proposal } from "../utils/types";
import {
  resolveIpfsCid,
} from "@xinfin/osx-sdk-common";
import { useNavigate } from "react-router-dom";
import {
  toStandardTimestamp,
} from "../utils/date";
import { SubgraphProposalBase } from "./useDaoProposals";
const ProposalQueries = `
query ProposalQuery($id: ID!) {
    pluginProposal(id: $id) {
      id
      actions {
        id
        to
        data
        value
      }
      allowFailureMap
      creator
      createdAt
      metadata
      startDate
      endDate
      snapshotBlock
      executed
      creationBlockNumber
      failureMap 
      pluginProposalId
      creationTxHash
      proposalType {
        id
        txHash
        settings {
          id
          supportThreshold
          minParticipation
          minVotingPower
        }
      }
    }
  }
`;
function useDaoProposal(pluginId: string): {
  data: Proposal | undefined;
  error: string;
  isLoading: boolean;
} {
  const { daofinClient } = useClient();

  const [proposals, setProposals] = useState<Proposal>();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!daofinClient) return;
    setIsLoading(true);
    daofinClient.graphql
      .request<{ pluginProposal: SubgraphProposalBase }>({
        query: ProposalQueries,
        params: {
          id: pluginId,
        },
      })
      .then(async ({ pluginProposal }) => {
        if (pluginProposal === null) navigate("/not-found");
        const metadataCid = resolveIpfsCid(pluginProposal.metadata);
        const metadataString = await daofinClient.ipfs.fetchString(metadataCid);
        const metadata = JSON.parse(metadataString) as ProposalMetadata;

        const startDate = toStandardTimestamp(+pluginProposal.startDate);
        const endDate = toStandardTimestamp(+pluginProposal.endDate);

        return {
          ...pluginProposal,
          metadata,
          startDate,
          endDate,
        };
      })
      .then((data) => {
        setProposals(data as unknown as Proposal);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e);
        console.log("error", e);
      });
  }, [daofinClient]);

  return { data: proposals, error: error, isLoading };
}
export default useDaoProposal;

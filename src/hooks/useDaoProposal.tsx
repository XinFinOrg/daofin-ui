import { useEffect, useMemo, useState } from "react";
import { useClient } from "./useClient";
import { useNetwork } from "../contexts/network";
import { GlobalSettings } from "@xinfin/osx-daofin-sdk-client";
import { ProposalsQuery } from "@xinfin/osx-daofin-sdk-client/dist/internal/graphql-queries/proposals";
import { ethers } from "ethers";
import { formatDate, getPluginInstallationId } from "../utils/networks";
import { ProposalBase, ProposalMetadata } from "@xinfin/osx-client-common";
import { Proposal } from "../utils/types";
import { SubgraphProposalBase } from "@xinfin/osx-daofin-sdk-client";
import {
  decodeProposalId,
  encodeProposalId,
  getExtendedProposalId,
  resolveIpfsCid,
} from "@xinfin/osx-sdk-common";
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
        const metadataCid = resolveIpfsCid(pluginProposal.metadata);
        const metadataString = await daofinClient.ipfs.fetchString(metadataCid);
        const metadata = JSON.parse(metadataString) as ProposalMetadata;

        const startDate = +pluginProposal.startDate * 1000;
        const endDate = +pluginProposal.endDate * 1000;
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

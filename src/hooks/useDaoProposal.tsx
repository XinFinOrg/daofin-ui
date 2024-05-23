import { useEffect, useState } from "react";
import { useClient } from "./useClient";
import { ProposalMetadata } from "@xinfin/osx-client-common";
import { Proposal } from "../utils/types";
import { resolveIpfsCid } from "@xinfin/osx-sdk-common";
import { useNavigate } from "react-router-dom";
import { toStandardTimestamp } from "../utils/date";
import { SubgraphProposalBase } from "./useDaoProposals";
import { proposalByProposalIdQuery } from "../utils/graphql-queries/proposals-query";
import useCommunityMembers from "./useCommunityMembers";
import { applyRatioCeiled } from "../utils/vote-utils";

function useDaoProposal(proposalId: string): {
  data: Proposal | undefined;
  error: string;
  isLoading: boolean;
} {
  const { daofinClient } = useClient();

  const [proposals, setProposals] = useState<Proposal>();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { data: communityLengths } = useCommunityMembers();
  useEffect(() => {
    if (!daofinClient || !communityLengths) return;
    setIsLoading(true);
    daofinClient.graphql
      .request<{ pluginProposal: SubgraphProposalBase }>({
        query: proposalByProposalIdQuery,
        params: {
          id: proposalId,
        },
      })
      .then(async ({ pluginProposal }) => {
        if (pluginProposal === null) navigate("/not-found");
        const metadataCid = resolveIpfsCid(pluginProposal.metadata);
        const metadataString = await daofinClient.ipfs.fetchString(metadataCid);
        const metadata = JSON.parse(metadataString) as ProposalMetadata;

        const startDate = toStandardTimestamp(+pluginProposal.startDate);
        const endDate = toStandardTimestamp(+pluginProposal.endDate);
        const a = pluginProposal.tallyDetails[0].proposalType.settings;
        // applyRatioCeiled();
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
  }, [daofinClient, communityLengths]);

  return { data: proposals, error: error, isLoading };
}
export default useDaoProposal;

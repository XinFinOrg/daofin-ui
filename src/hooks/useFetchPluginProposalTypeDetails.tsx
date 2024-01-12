import { useEffect, useMemo, useState } from "react";
import { useClient } from "./useClient";
import { useNetwork } from "../contexts/network";
import { GlobalSettings } from "@xinfin/osx-daofin-sdk-client";
import { ProposalsQuery } from "@xinfin/osx-daofin-sdk-client/dist/internal/graphql-queries/proposals";
import { ethers } from "ethers";
import { formatDate, getPluginInstallationId } from "../utils/networks";
import { ProposalBase, ProposalMetadata } from "@xinfin/osx-client-common";
import { Proposal, ProposalType } from "../utils/types";
import { SubgraphProposalBase } from "@xinfin/osx-daofin-sdk-client";
import {
  decodeProposalId,
  encodeProposalId,
  getExtendedProposalId,
  resolveIpfsCid,
} from "@xinfin/osx-sdk-common";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import useVoteStats from "./useVoteStats";
const ProposalTypesQuery = `
query ProposalTypesQuery($id: ID!) {
  pluginProposalTypes(
    where: {plugin: $id}
  ) {
    id
    txHash
    creationDate
    proposalTypeId
    settings {
      id
      name
      supportThreshold
      minParticipation
      minVotingPower
    }
  }
}
`;
function useFetchPluginProposalTypeDetails(): {
  data: ProposalType[] | undefined;
  error: string;
  isLoading: boolean;
} {
  const { daofinClient } = useClient();

  const [proposalTypes, setProposalTypes] = useState<ProposalType[]>();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { daoAddress, pluginAddress } = useAppGlobalConfig();
  console.log(getPluginInstallationId(daoAddress, pluginAddress));

  useEffect(() => {
    if (!daofinClient) return;
    setIsLoading(true);
    daofinClient.graphql
      .request<{ pluginProposalTypes: SubgraphProposalBase }>({
        query: ProposalTypesQuery,
        params: {
          id: getPluginInstallationId(daoAddress, pluginAddress),
        },
      })
      .then(({ pluginProposalTypes }) => {
        setProposalTypes(pluginProposalTypes as unknown as ProposalType[]);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e);
        console.log("error", e);
      });
  }, [daofinClient]);

  return { data: proposalTypes, error: error, isLoading };
}
export default useFetchPluginProposalTypeDetails;

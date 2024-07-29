import { useEffect, useState } from "react";
import { useClient } from "./useClient";

import { getPluginInstallationId } from "../utils/networks";
import { ProposalType } from "../utils/types";
import { SubgraphProposalBase } from "@xinfin/osx-daofin-sdk-client";

import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
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

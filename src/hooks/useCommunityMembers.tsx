import { useEffect, useState } from "react";
import { useClient } from "./useClient";
import {
  JudiciaryCommittee,
  MasterNodeCommittee,
  PeoplesHouseCommittee,
  getPluginInstallationId,
} from "../utils/networks";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import { allCommunityMembers } from "../utils/graphql-queries/community";

type CommunityMembers = { [community: string]: number };
function useCommunityMembers(): {
  data: CommunityMembers | undefined;
  error: string;
  isLoading: boolean;
} {
  const { daofinClient } = useClient();
  const { daoAddress, pluginAddress } = useAppGlobalConfig();
  const [communities, setCommunities] = useState<CommunityMembers>();

  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!daofinClient) return;
    setIsLoading(true);
    daofinClient.graphql
      .request<{
        pluginJudiciaries: any[];
        pluginDeposits: any[];
        pluginMasterNodeDelegatees: any[];
      }>({
        query: allCommunityMembers,
        params: {
          pluginId: getPluginInstallationId(daoAddress, pluginAddress),
        },
      })
      .then(
        async ({
          pluginDeposits,
          pluginJudiciaries,
          pluginMasterNodeDelegatees,
        }) => {
          setCommunities({
            [`${JudiciaryCommittee}`]: pluginJudiciaries.length,
            [`${MasterNodeCommittee}`]: pluginMasterNodeDelegatees.length,
            [`${PeoplesHouseCommittee}`]: pluginDeposits.length,
          });
          setIsLoading(false);
        }
      )

      .catch((e) => {
        setIsLoading(false);
        setError(e);
        console.log("error", e);
      });
  }, [daofinClient]);

  return { data: communities, error: error, isLoading };
}
export default useCommunityMembers;

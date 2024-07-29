import { useEffect, useState } from "react";
import { useClient } from "./useClient";
import { CommitteeVotingSettings } from "@xinfin/osx-daofin-sdk-client";

function useFetchGlobalCommitteeToVotingSettings(
  committee: string,
  proposalId: string
): CommitteeVotingSettings | undefined {
  const [committeeSettings, setCommitteeSettings] =
    useState<CommitteeVotingSettings>();
  const { daofinClient } = useClient();
  const [, setIsLoading] = useState(false);

  useEffect(() => {
    if (!daofinClient || !proposalId) return;
    setIsLoading(true);

    daofinClient.methods
      .getCommitteesToVotingSettings(proposalId, committee)
      .then((data: any) => {
        setIsLoading(false);
        setCommitteeSettings(data);
      })
      .catch((e: any) => {
        setIsLoading(false);
        console.log("error", e);
      });
  }, [daofinClient]);

  return committeeSettings;
}
export default useFetchGlobalCommitteeToVotingSettings;

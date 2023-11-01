import { useEffect, useMemo, useState } from "react";
import { useClient } from "./useClient";
import { useNetwork } from "../contexts/network";
import {
  CommitteeVotingSettings,
  GlobalSettings,
} from "@xinfin/osx-daofin-sdk-client";

function useFetchGlobalCommitteeToVotingSettings(
  committee: string
): CommitteeVotingSettings | undefined {
  const [committeeSettings, setCommitteeSettings] =
    useState<CommitteeVotingSettings>();
  const { daofinClient, client } = useClient();
  const { network } = useNetwork();
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!daofinClient) return;
    setIsLoading(true);

    daofinClient.methods
      .getCommitteesToVotingSettings("", committee)
      .then((data) => {
        setIsLoading(false);
        setCommitteeSettings(data);
      })
      .catch((e) => {
        setIsLoading(false);
        console.log("error", e);
      });
  }, [daofinClient]);

  return committeeSettings;
}
export default useFetchGlobalCommitteeToVotingSettings;

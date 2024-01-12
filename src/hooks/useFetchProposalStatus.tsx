import { useCallback, useEffect, useState } from "react";
import { useClient } from "./useClient";
export type FetchProposalStatusType = {
  canExecute: boolean;
  isMinParticipationReached: boolean;
  isThresholdReached: boolean;
};
const useFetchProposalStatus = () => {
  const { daofinClient } = useClient();
  const [isLoading, setIsLoading] = useState(false);
  const fetchStatus = useCallback(
    (pluginProposalId: string) =>
      Promise.all([
        daofinClient?.methods.isMinParticipationReached(pluginProposalId),
        daofinClient?.methods.isThresholdReached(pluginProposalId),
        daofinClient?.methods.canExecute(pluginProposalId),
      ]),
    []
  );
  const makeCall = useCallback(async (proposalId: string) => {
    setIsLoading(true);
    const res = await fetchStatus(proposalId);
    setIsLoading(false);

    return {
      isMinParticipationReached: !!res[0],
      isThresholdReached: !!res[1],
      canExecute: !!res[2],
    } as FetchProposalStatusType;
  }, []);
  return { makeCall, isLoading };
};
export default useFetchProposalStatus;

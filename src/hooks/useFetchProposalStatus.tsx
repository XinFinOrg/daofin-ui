import { useCallback, useEffect, useState } from "react";
import { useClient } from "./useClient";
import { Address, useContractReads } from "wagmi";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import { DaofinPlugin__factory } from "@xinfin/osx-daofin-contracts-ethers";
import { multicall } from "@wagmi/core";
export type FetchProposalStatusType = {
  canExecute: boolean;
  isMinParticipationReached: boolean;
  isThresholdReached: boolean;
  isOpen: boolean;
  executed: boolean;
};

const useFetchProposalStatus = () => {
  const { daofinClient } = useClient();
  const [isLoading, setIsLoading] = useState(false);
  const { pluginAddress } = useAppGlobalConfig();
  const daofinContracts = {
    abi: DaofinPlugin__factory.abi,
    address: pluginAddress,
  } as const;

  const fetchStatus = useCallback(
    (pluginProposalId: string) =>
      Promise.all([
        daofinClient?.methods.isMinParticipationReached(pluginProposalId),
        daofinClient?.methods.isThresholdReached(pluginProposalId),
        daofinClient?.methods.canExecute(pluginProposalId),
        daofinClient?.methods.isOpenProposal(pluginProposalId),
        daofinClient?.methods.isExecutedProposal(pluginProposalId),
      ]),
    [daofinClient]
  );
  const makeCall = useCallback(
    async (proposalId: string) => {
      if (!proposalId) return;
      setIsLoading(true);
      const res = await fetchStatus(proposalId);
      setIsLoading(false);

      return {
        isMinParticipationReached: !!res[0],
        isThresholdReached: !!res[1],
        canExecute: !!res[2],
        isOpen: !!res[3],
        executed: !!res[4],
      } as FetchProposalStatusType;
    },
    [fetchStatus]
  );
  return { makeCall, isLoading };
};
export default useFetchProposalStatus;

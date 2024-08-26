import { useCallback, useEffect, useState } from "react";
import { useClient } from "./useClient";
import { Address, useContractReads } from "wagmi";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import { DaofinPlugin__factory } from "@xinfin/osx-daofin-contracts-ethers";
import { multicall } from "@wagmi/core";
import { DaofinABI } from "../utils/abis/daofin.abi";
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
    address: pluginAddress as Address,
  } as const;

  const fetchStatus = useCallback(
    (pluginProposalId: string) =>
      multicall({
        contracts: [
          {
            ...daofinContracts,
            functionName: "isMinParticipationReached",
            args: [BigInt(pluginProposalId)],
          },
          {
            ...daofinContracts,
            functionName: "isThresholdReached",
            args: [BigInt(pluginProposalId)],
          },
          {
            ...daofinContracts,
            functionName: "canExecute",
            args: [BigInt(pluginProposalId)],
          },
          {
            ...daofinContracts,
            functionName: "getProposal",
            args: [BigInt(pluginProposalId)],
          },
        ],
      }),
    // Promise.all([
    //   daofinClient?.methods.isMinParticipationReached(pluginProposalId),
    //   daofinClient?.methods.isThresholdReached(pluginProposalId),
    //   daofinClient?.methods.canExecute(pluginProposalId),
    //   daofinClient?.methods.isOpenProposal(pluginProposalId),
    //   daofinClient?.methods.isExecutedProposal(pluginProposalId),
    // ])
    [daofinClient]
  );
  const makeCall = useCallback(
    async (proposalId: string) => {
      if (!proposalId) return;
      setIsLoading(true);
      const res = await fetchStatus(proposalId);
      setIsLoading(false);
      console.log({ res });
      return {
        isMinParticipationReached: !!res[0].result,
        isThresholdReached: !!res[1].result,
        canExecute: !!res[2].result,
        isOpen: !!res[3].result?.[0],
        executed: !!res[3].result?.[1],
      } as FetchProposalStatusType;
    },
    [fetchStatus]
  );
  return { makeCall, isLoading };
};
export default useFetchProposalStatus;

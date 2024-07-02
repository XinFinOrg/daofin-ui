import { useEffect, useMemo, useState } from "react";
import { useClient } from "../useClient";
import { useWallet } from "../useWallet";
import { Address, erc20ABI, readContracts, useContractRead } from "wagmi";
import DaofinVotingStats from "../../utils/abis/voting-stats.abi.json";
import { useGlobalState } from "../../contexts/GlobalStateContext";
import { useAppGlobalConfig } from "../../contexts/AppGlobalConfig";

function useVotingStatsContract(proposalId: string) {
  return useContractRead({
    abi: DaofinVotingStats,
    address: import.meta.env.VITE_DAOFIN_VOTING_STATS as Address,
    functionName: "getQuorumStats",
    args: [proposalId],
  });
}
export default useVotingStatsContract;

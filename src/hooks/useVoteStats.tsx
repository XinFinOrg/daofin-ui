import { useMemo } from "react";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import {
  JudiciaryCommittee,
  MasterNodeCommittee,
  PeoplesHouseCommittee,
} from "../utils/networks";
import useFetchVotesOnProposalBasedOnOption from "./useFetchVotesOnProposalBasedOnOption";

interface VoteStatsType {
  masterNodeVoteListLength: number;
  judiciaryVoteListLength: number;
  peoplesHouseVoteListLength: number;
}
function useVoteStats(proposalId: string): VoteStatsType {
  const { daoAddress, pluginAddress, pluginRepoAddress } = useAppGlobalConfig();

  const masterNodeVoteList = useFetchVotesOnProposalBasedOnOption(
    daoAddress,
    pluginAddress,
    proposalId,
    MasterNodeCommittee
  );

  const judiciaryVoteList = useFetchVotesOnProposalBasedOnOption(
    daoAddress,
    pluginAddress,
    proposalId,
    JudiciaryCommittee
  );

  const peoplesHouseVoteList = useFetchVotesOnProposalBasedOnOption(
    daoAddress,
    pluginAddress,
    proposalId,
    PeoplesHouseCommittee
  );
    
  const masterNodeVoteListLength = useMemo(
    () => (masterNodeVoteList && masterNodeVoteList?.data?.length) ?? 0,
    [masterNodeVoteList]
  );
  const judiciaryVoteListLength = useMemo(
    () => (judiciaryVoteList && judiciaryVoteList?.data?.length) ?? 0,
    [judiciaryVoteList]
  );
  const peoplesHouseVoteListLength = useMemo(
    () => (peoplesHouseVoteList && peoplesHouseVoteList?.data?.length) ?? 0,
    [peoplesHouseVoteList]
  );
  return {
    masterNodeVoteListLength,
    judiciaryVoteListLength,
    peoplesHouseVoteListLength,
  };
}

export default useVoteStats;

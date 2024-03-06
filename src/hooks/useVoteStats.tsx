import { useMemo} from "react";
import {
  JudiciaryCommittee,
  MasterNodeCommittee,
  PeoplesHouseCommittee,
} from "../utils/networks";
import useFetchVotesOnProposalBasedOnOption from "./useFetchVotesOnProposalBasedOnOption";
import { CommitteeGlobal, useCommitteeUtils } from "./useCommitteeUtils";
import useMinParticipationVotingStatsPerCommittee, {
  VotingMinParticipationStats,
} from "./useMinParticipationVotingStatsPerCommittee";
import useThresholdVotingStatsPerCommittee, {
  VotingSupportThresholdStats,
} from "./useThresholdVotingStatsPerCommittee";
import { VoterOnProposal } from "../utils/types";
import { BigNumber, BigNumberish } from "ethers";
import { VoteOption } from "@xinfin/osx-daofin-sdk-client";

import { toEther } from "../utils/numbers";

export type VoteStatsType = CommitteeGlobal & {
  minParticipation: VotingMinParticipationStats | undefined;
  supportThreshold: VotingSupportThresholdStats | undefined;
  voters:
    | {
        data: VoterOnProposal[];
        error: string;
        isLoading: boolean;
      }
    | undefined;
  options: {
    key: string;
    text: string | VoteOption;
    value: string | undefined;
  }[];
};
function useVoteStats(proposalId: string): VoteStatsType[] {
  const { committeesListWithIcon } = useCommitteeUtils();
  const voteOptionsList = useMemo(
    () =>
      Object.entries(VoteOption)
        .filter(([_, value]) => isNaN(Number(value)))
        .slice(1),
    []
  );
  const masterNodeVoteList = useFetchVotesOnProposalBasedOnOption(
    proposalId,
    MasterNodeCommittee
  );

  const judiciaryVoteList = useFetchVotesOnProposalBasedOnOption(
    proposalId,
    JudiciaryCommittee
  );

  const peoplesHouseVoteList = useFetchVotesOnProposalBasedOnOption(
    proposalId,
    PeoplesHouseCommittee
  );

  const mapCommitteeToVoters = (key: string) => {
    switch (key) {
      case MasterNodeCommittee:
        return masterNodeVoteList;
      case JudiciaryCommittee:
        return judiciaryVoteList;
      case PeoplesHouseCommittee:
        return peoplesHouseVoteList;
    }
  };

  const mnMinParticipationStats = useMinParticipationVotingStatsPerCommittee(
    proposalId,
    MasterNodeCommittee
  );

  const judiciaryMinParticipationStats =
    useMinParticipationVotingStatsPerCommittee(proposalId, JudiciaryCommittee);

  const peopleMinParticipationStats =
    useMinParticipationVotingStatsPerCommittee(
      proposalId,
      PeoplesHouseCommittee
    );

  const mapCommitteeToMinParticipation = (key: string) => {
    switch (key) {
      case MasterNodeCommittee:
        return mnMinParticipationStats;
      case JudiciaryCommittee:
        return judiciaryMinParticipationStats;
      case PeoplesHouseCommittee:
        return peopleMinParticipationStats
          ? {
              ...peopleMinParticipationStats,
              numberOfVotes: BigNumber.from(
                parseInt(
                  toEther(peopleMinParticipationStats.numberOfVotes.toString())
                )
              ),
            }
          : {
              tally: {
                name: "",
                yes: "0",
                no: "0",
                abstain: "0",
              },
              numberOfVotesPercentage: 0,
              numberOfVotes: BigNumber.from(0),
              minParticipation: BigNumber.from(0),
              minParticipationPercentage: 0,
            };
    }
  };

  const mnThresholdStats = useThresholdVotingStatsPerCommittee(
    proposalId,
    MasterNodeCommittee
  );

  const judiciaryThresholdStats = useThresholdVotingStatsPerCommittee(
    proposalId,
    JudiciaryCommittee
  );
  const peopleThresholdStats = useThresholdVotingStatsPerCommittee(
    proposalId,
    PeoplesHouseCommittee
  );
  const mapVoteOptionToTally = (committee: string, key: number) => {
    let value: BigNumberish | undefined;
    switch (key) {
      case VoteOption.YES:
        value =
          mapCommitteeToMinParticipation(committee)?.tally["yes"].toString();
        break;
      case VoteOption.NO:
        value =
          mapCommitteeToMinParticipation(committee)?.tally["no"].toString();
        break;
      case VoteOption.ABSTAIN:
        value =
          mapCommitteeToMinParticipation(committee)?.tally[
            "abstain"
          ].toString();
        break;
    }

    return +toEther(value ? value.toString() : "0");
  };
  const mapCommitteeToSupportTreshold = (key: string) => {
    switch (key) {
      case MasterNodeCommittee:
        return mnThresholdStats;
      case JudiciaryCommittee:
        return judiciaryThresholdStats;
      case PeoplesHouseCommittee:
        return peopleThresholdStats;
    }
  };

  const data = useMemo(() => {
    return committeesListWithIcon.map((item) => ({
      ...item,
      minParticipation: mapCommitteeToMinParticipation(item.id),
      supportThreshold: mapCommitteeToSupportTreshold(item.id),
      voters: mapCommitteeToVoters(item.id),
      options: voteOptionsList.map(([key, text]) => ({
        key,
        text,
        value: mapVoteOptionToTally(item.id, parseInt(key))?.toString(),
      })),
    }));
  }, [
    proposalId,
    committeesListWithIcon,
    voteOptionsList,
    // Threshold
    judiciaryThresholdStats,
    mnThresholdStats,
    mnThresholdStats,
    // minParticipation
    judiciaryMinParticipationStats,
    mnMinParticipationStats,
    peopleMinParticipationStats,
    // vote
    judiciaryVoteList,
    masterNodeVoteList,
    peoplesHouseVoteList,
  ]);
  return data;
}

export default useVoteStats;

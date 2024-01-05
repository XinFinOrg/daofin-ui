import { useMemo } from "react";
import { MasterNodeCommittee, applyRatioCeiled } from "../utils/networks";
import useFetchGlobalCommitteeToVotingSettings from "./useFetchGlobalCommitteeToVotingSettings";
import useFetchProposalTallyDetails from "./useFetchProposalTallyDetails";
import useFetchTotalNumbersByCommittee from "./useFetchTotalNumbersByCommittee";
import { BigNumber } from "@ethersproject/bignumber";
import Big from "big.js";
import { toEther, toStandardPercentage } from "../utils/numbers";

export type VotingSupportThresholdStats = {
  supportThreshold: BigNumber;
  numberOfVotes: BigNumber;
  numberOfVotesPercentage: string;
  supportThresholdPercentage: string;
};

function useThresholdVotingStatsPerCommittee(
  pluginProposalId: string,
  committee: string
): VotingSupportThresholdStats | undefined {
  const globalCommitteeToVotingSettings =
    useFetchGlobalCommitteeToVotingSettings(committee, pluginProposalId);

  const totalNumbers = useFetchTotalNumbersByCommittee(committee);

  const tally = useFetchProposalTallyDetails(pluginProposalId, committee);

  return useMemo(() => {
    if (
      !pluginProposalId ||
      !tally ||
      !tally.data ||
      !globalCommitteeToVotingSettings ||
      !totalNumbers
    )
      return;
    const numberOfVotes = BigNumber.from(tally.data.yes);
    const supportThreshold = applyRatioCeiled(
      BigNumber.from(totalNumbers),
      BigNumber.from(globalCommitteeToVotingSettings?.supportThreshold)
    );

    const numberOfVotesPercentage = numberOfVotes.eq(0)
      ? "0"
      : toEther(
          BigNumber.from(numberOfVotes).mul(100).div(totalNumbers).toString()
        );
    const supportThresholdPercentage = toStandardPercentage(
      globalCommitteeToVotingSettings?.supportThreshold.toString()
    );
    return {
      numberOfVotes,
      supportThreshold,
      numberOfVotesPercentage,
      supportThresholdPercentage,
    };
  }, [pluginProposalId,tally, totalNumbers, globalCommitteeToVotingSettings]);
}
export default useThresholdVotingStatsPerCommittee;

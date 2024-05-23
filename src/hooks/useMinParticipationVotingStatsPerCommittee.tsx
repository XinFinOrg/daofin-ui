import { useMemo } from "react";
import { applyRatioCeiled } from "../utils/vote-utils";
import useFetchGlobalCommitteeToVotingSettings from "./useFetchGlobalCommitteeToVotingSettings";
import useFetchProposalTallyDetails from "./useFetchProposalTallyDetails";
import useFetchTotalNumbersByCommittee from "./useFetchTotalNumbersByCommittee";
import { BigNumber } from "@ethersproject/bignumber";
import { toEther, toStandardPercentage } from "../utils/numbers";
import { TallyDetails } from "@xinfin/osx-daofin-sdk-client";

export type VotingMinParticipationStats = {
  tally: TallyDetails;
  numberOfVotes: BigNumber;
  minParticipation: BigNumber;
  numberOfVotesPercentage: number;
  minParticipationPercentage: number;
};

function useMinParticipationVotingStatsPerCommittee(
  pluginProposalId: string,
  committee: string
): VotingMinParticipationStats | undefined {
  const globalCommitteeToVotingSettings =
    useFetchGlobalCommitteeToVotingSettings(committee, pluginProposalId);

  const totalNumbers = useFetchTotalNumbersByCommittee(committee);

  const tally = useFetchProposalTallyDetails(pluginProposalId, committee);

  return useMemo(() => {
    if (
      !pluginProposalId ||
      !tally.data ||
      !tally.data ||
      !globalCommitteeToVotingSettings ||
      !totalNumbers
    )
      return;
    const numberOfVotes = BigNumber.from(tally.data.yes)
      .add(tally.data.no.toString())
      .add(tally.data.abstain.toString());

    const minParticipation = applyRatioCeiled(
      BigNumber.from(totalNumbers),
      BigNumber.from(globalCommitteeToVotingSettings?.minParticipation)
    );

    const numberOfVotesPercentage = numberOfVotes.eq(0)
      ? 0
      : +toEther(
          BigNumber.from(numberOfVotes).mul(100).div(totalNumbers).toString()
        );

    const minParticipationPercentage = +toStandardPercentage(
      globalCommitteeToVotingSettings.minParticipation.toString()
    );

    return {
      tally: tally.data,
      numberOfVotes,
      minParticipation,
      numberOfVotesPercentage,
      minParticipationPercentage,
    };
  }, [pluginProposalId, tally, totalNumbers, globalCommitteeToVotingSettings]);
}
export default useMinParticipationVotingStatsPerCommittee;

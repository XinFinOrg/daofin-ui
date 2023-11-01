import { useMemo } from "react";
import { MasterNodeCommittee, applyRatioCeiled } from "../utils/networks";
import useFetchGlobalCommitteeToVotingSettings from "./useFetchGlobalCommitteeToVotingSettings";
import useFetchProposalTallyDetails from "./useFetchProposalTallyDetails";
import useFetchTotalNumbersByCommittee from "./useFetchTotalNumbersByCommittee";
import { BigNumber } from "@ethersproject/bignumber";
import { parseEther } from "viem";
import Big from "big.js";

function useMinParticipationVotingStatsPerCommittee(
  pluginProposalId: string,
  committee: string
):
  | {
      current: BigNumber;
      minParticipations: BigNumber;
      percentage: string;
    }
  | undefined {
  const globalCommitteeToVotingSettings =
    useFetchGlobalCommitteeToVotingSettings(committee);

  const totalNumbers = useFetchTotalNumbersByCommittee(committee);

  const tally = useFetchProposalTallyDetails(pluginProposalId, committee);

  return useMemo(() => {
    if (
      !tally ||
      !tally.data ||
      !globalCommitteeToVotingSettings ||
      !totalNumbers
    )
      return;
    const currentVotes = BigNumber.from(tally.data.yes)
      .add(tally.data.no.toString())
      .add(tally.data.abstain.toString());
    const minParticipations = applyRatioCeiled(
      BigNumber.from(totalNumbers),
      BigNumber.from(globalCommitteeToVotingSettings?.minParticipation)
    );
    console.log("minParticipations", minParticipations.toString());

    const percentage = currentVotes.eq(0)
      ? '0'
      : Big(currentVotes.toString()).mul(100).div(minParticipations.toString()).toString();
    console.log("percentage", percentage.toString());

    return {
      current: currentVotes,
      minParticipations: minParticipations,
      percentage,
    };
  }, [tally, totalNumbers, globalCommitteeToVotingSettings]);
}
export default useMinParticipationVotingStatsPerCommittee;

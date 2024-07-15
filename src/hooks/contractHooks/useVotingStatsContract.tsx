import {
  Address,
  useAccount,
  useChainId,
  useContractRead,
  useNetwork,
  usePublicClient,
} from "wagmi";
import { useAppGlobalConfig } from "../../contexts/AppGlobalConfig";
import { VotingStatsABI } from "../../utils/abis/voting-stats.abi";

type CommunityReturnType = {
  name: string;
  yesVotes: bigint;
  noVotes: bigint;
  abstainVotes: bigint;
  totalVotes: bigint;
  currentQuorumNumber: bigint;
  currentPassrateNumber: bigint;
  requiredQuorumNumber: bigint;
  requiredPassrateNumber: bigint;
  totalNumberOfVoters: bigint;
  currentQuroumNumberRatio: bigint;
  requiredQuroumNumberRatio: bigint;
  currentPassrateRatio: bigint;
  currentPassrateNumberRatio: bigint;
  requiredPassrateNumberRatio: bigint;
};
function useVotingStatsContract(proposalId: bigint, proposalTypeId: bigint) {
  const { votingStatsAddress } = useAppGlobalConfig();

  //   if (!proposalId || !proposalTypeId) return;

  return useContractRead<typeof VotingStatsABI, string, CommunityReturnType[]>({
    abi: VotingStatsABI,
    address: votingStatsAddress as Address,
    functionName: "stats",
    args: [proposalId, proposalTypeId],
  });
}
export default useVotingStatsContract;

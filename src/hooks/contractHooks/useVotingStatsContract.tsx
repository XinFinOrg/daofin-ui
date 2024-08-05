import {
  Address,
  useAccount,
  useChainId,
  useContractRead,
  usePublicClient,
} from "wagmi";
import { useAppGlobalConfig } from "../../contexts/AppGlobalConfig";
import { VotingStatsABI } from "../../utils/abis/voting-stats.abi";
import { useNetwork } from "../../contexts/network";
import { useWallet } from "../useWallet";

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
  currentQuorumNumberRatio: bigint;
  requiredQuorumNumberRatio: bigint;
  currentPassrateRatio: bigint;
  currentPassrateNumberRatio: bigint;
  requiredPassrateNumberRatio: bigint;
  status: bigint;
};
function useVotingStatsContract(proposalId: bigint, proposalTypeId: bigint) {
  const { votingStatsAddress } = useAppGlobalConfig();
  const { provider } = useWallet();

  return useContractRead<typeof VotingStatsABI, string, CommunityReturnType[]>({
    abi: VotingStatsABI,
    address: votingStatsAddress as Address,
    functionName: "stats",
    chainId: provider?.network.chainId,
    args: [proposalId, proposalTypeId],
  });
}
export default useVotingStatsContract;

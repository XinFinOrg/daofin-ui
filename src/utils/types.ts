import { DaoAction, ProposalMetadata } from "@xinfin/osx-client-common";
import {
  CommitteeVotingSettings,
  TallyDetails,
  VoteOption,
} from "@xinfin/osx-daofin-sdk-client";
import { BigNumberish } from "ethers";
import { VoteStatsType } from "../hooks/useVoteStats";

export type Proposal = {
  id: string;
  dao: {
    id: string;
  };
  creator: string;
  pluginProposalId: string;
  metadata: ProposalMetadata;
  startDate: number;
  endDate: number;
  executed: boolean;
  potentiallyExecutable: boolean;
  actions: DaoAction[];
  createdAt: string;
  executionTxHash: string;
  executionBlockNumber: string;
  executionDate: number;
  creationTxHash: string;
  executedBy: string;
  proposalType: {
    id: string;
    txHash: string;
    proposalTypeId: string;
    settings: {
      id: string;
      supportThreshold: string;
      minParticipation: string;
      minVotingPower: string;
    };
  };
  committeesVotes: VoteStatsType[];
  electionIndex: string;
  tallyDetails: TallyDetailResponse[];
};
export type Deposit = {
  id: string;
  voter: string;
  amount: string;
  snapshotBlock: number;
  depositDate: number;
  txHash: string;
};
export type Judiciary = {
  id: string;
  member: string;
  snapshotBlock: BigNumberish;
  txHash: string;
  action: BigNumberish;
  creationDate: BigNumberish;
};
export type MasterNodeDelegatee = {
  id: string;
  member: string;
  masterNode: string;
  snapshotBlock: BigNumberish;
  txHash: string;
  action: BigNumberish;
  creationDate: BigNumberish;
};
export const enum TransactionState {
  NONE = "NONE",
  WAITING = "WAITING",
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

export type VoterOnProposal = {
  id: string;
  voter: string;
  committee: string;
  pluginProposalId: string;
  option: VoteOption;
  txHash: string;
  creationDate: BigNumberish;
  snapshotBlock: BigNumberish;
};

export type ProposalType = {
  id: string;
  txHash: string;
  proposalTypeId: string;
  creationDate: BigNumberish;
  settings: CommitteeVotingSettings[];
};
export enum ProposalTypeEnum {
  Grant = 0,
  NewProposalType = 1,
  UpdateSettings = 2,
  UpdateElectionPeriods = 3,
  UpdateJudiciary = 4,
  UpdateProposalCosts = 5,
}
export enum ProposalStatus {
  ACTIVE = "Active",
  PUBLISHED = "Published",
  PENDING = "Pending",
  SUCCEEDED = "Succeeded",
  EXECUTED = "Executed",
  DEFEATED = "Defeated",
  REACHED = "Reached",
  NOT_STARTED = "Not Started",
  EXPIRED = "Expired",
  QUEUED = "Queued",
  READY_TO_EXECUTE = "Ready to execute",
  RUNNING = "Running",
}
export type TallyDetailResponse = {
  committee: string;
  id: string;
  totalVotes: string;
  yesVotes: string;
  noVotes: string;
  abstainVotes: string;
  quorumRequiredVote: string;
  passrateRequiredVote: string;
  quorumActiveVote: string;
  passrateActiveVote: string;
  totalMembers: string;
  pluginProposalId: string;
  proposalType: {
    id: string;
    settings: {
      name: string;
      supportThreshold: string;
      minParticipation: string;
      minVotingPower: string;
    };
  };
};

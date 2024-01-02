import { DaoAction, ProposalMetadata } from "@xinfin/osx-client-common";
import { VoteOption } from "@xinfin/osx-daofin-sdk-client";
import { BigNumberish } from "ethers";

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
  creationTxHash: string;
};
export type Deposit = {
  id: string;
  voter: string;
  amount: string;
  snapshotBlock: number;
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

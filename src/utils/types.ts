import { DaoAction, ProposalMetadata } from "@xinfin/osx-client-common";
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

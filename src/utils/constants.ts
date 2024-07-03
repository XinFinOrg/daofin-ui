import { uuid } from "./numbers";

export const daoAddress = import.meta.env.VITE_DAOFIN_DAO_ADDRESS as string;
export const pluginAddress = import.meta.env
  .VITE_DAOFIN_PLUGIN_ADDRESS as string;

export const PROPOSAL_TYPES = [
  {
    id: uuid(),
    name: "Grant",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    isComingSoon: false,
    proposalId: 0,
  },
  {
    id: uuid(),
    name: "Decision-making",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    isComingSoon: false,
    proposalId: 1,
  },
  {
    id: uuid(),
    name: "Update Voting Settings",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    isComingSoon: true,
  },
  {
    id: uuid(),
    name: "Adjust Voting Periods",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    isComingSoon: true,
  },
];

export const proposalTypeNameToProposalId = (proposalTypeName: string) => {
  switch (proposalTypeName) {
    case "grant":
      return "0";
    case "decision-making":
      return "1";
    default:
      return "-1";
  }

};
export const findProposalTypeById = (proposalTypeId: string) => {
  return PROPOSAL_TYPES.find((item) => item.proposalId === +proposalTypeId);
};

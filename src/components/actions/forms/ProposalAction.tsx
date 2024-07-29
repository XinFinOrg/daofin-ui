import React, { FC } from "react";
import DecisionMakingTypeFormAction from "./DecisionMakingTypeFormAction";
import GrantsProposalTypeForm from "./GrantsProposalTypeForm";

type ProposalActionType = {
  proposalTypeId: string;
};
const ProposalAction: FC<ProposalActionType> = ({ proposalTypeId }) => {
  return (
    <>
      {proposalTypeId === "0" && <GrantsProposalTypeForm />}
      {proposalTypeId === "1" && <DecisionMakingTypeFormAction />}
    </>
  );
};

export default ProposalAction;

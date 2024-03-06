import CreateProposalStepper from "../components/CreateProposalStepper/CreateProposalStepper";

import { useParams } from "react-router";

import { CreateProposalProvider } from "../contexts/CreateProposalContext";
import { Page } from "../components";

export interface CreateProposalFormData {
  metaData: {
    title: string;
    summary: string;
    description: string;
    resources: { name: string; url: string }[];
  };
  action: {
    recipient: string;
    amount: string;
  };
  selectedElectionPeriod: string;
  proposalTypeId: string;
}
const CreateProposal = () => {
  const params = useParams();

  return (
    <Page>
      <CreateProposalProvider>
        <CreateProposalStepper proposalTypeId={params.type} />
      </CreateProposalProvider>
    </Page>
  );
};

export default CreateProposal;

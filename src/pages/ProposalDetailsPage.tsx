
import ProposalDetails from "../components/ProposalDetails";
import { useParams } from "react-router";
import useDaoProposal from "../hooks/useDaoProposal";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import {
  getPluginProposalId,
} from "../utils/networks";
import { Page } from "../components";
import { Formik } from "formik";
import { VoteProvider } from "../contexts/voteContext";
import { ExecuteProposalProvider } from "../contexts/ExecuteProposalContext";

export type VoteFormType = {
  voteOption: number;
};
const ProposalDetailsPage = () => {
  const { pluginAddress,  } = useAppGlobalConfig();
  const { proposalId } = useParams();
  const { data, isLoading } = useDaoProposal(
    getPluginProposalId(pluginAddress, proposalId ? parseInt(proposalId) : 0)
  );

  return (
    <Page>
      <Formik
        initialValues={{
          voteOption: "2",
          proposalId,
        }}
        onSubmit={() => {}}
      >
        {
          <ExecuteProposalProvider proposal={data}>
            <VoteProvider
              proposalId={proposalId ? proposalId : ""}
              proposal={data}
            >
              <ProposalDetails proposal={data} isLoading={isLoading} />
            </VoteProvider>
          </ExecuteProposalProvider>
        }
      </Formik>
    </Page>
  );
};

export default ProposalDetailsPage;

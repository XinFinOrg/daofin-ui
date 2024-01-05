import React from "react";
import ProposalDetails from "../components/ProposalDetails";
import { useParams } from "react-router";
import useDaoProposal from "../hooks/useDaoProposal";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import {
  getPluginInstallationId,
  getPluginProposalId,
} from "../utils/networks";

import { BigNumber, ethers } from "ethers";
import { Page } from "../components";
import { Skeleton } from "@chakra-ui/react";
import { Formik } from "formik";
import { VoteProvider } from "../contexts/voteContext";

export type VoteFormType = {
  voteOption: number;
};
const ProposalDetailsPage = () => {
  const { pluginAddress, daoAddress } = useAppGlobalConfig();
  const { proposalId } = useParams();
  const { data, error, isLoading } = useDaoProposal(
    getPluginProposalId(pluginAddress, proposalId ? parseInt(proposalId) : 0)
  );

  return (
    <Page>
      <Formik
        initialValues={{
          voteOption: "2",
        }}
        onSubmit={() => {}}
      >
        <VoteProvider proposalId={proposalId ? proposalId : ""}>
          {data ? <ProposalDetails proposal={data} /> : null}
        </VoteProvider>
      </Formik>
    </Page>
  );
};

export default ProposalDetailsPage;

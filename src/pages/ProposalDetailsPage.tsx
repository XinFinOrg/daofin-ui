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

const ProposalDetailsPage = () => {
  const { pluginAddress, daoAddress } = useAppGlobalConfig();
  const { proposalId } = useParams();
  const { data, error, isLoading } = useDaoProposal(
    getPluginProposalId(pluginAddress, proposalId ? parseInt(proposalId) : 0)
  );

  return <Page>{<ProposalDetails />}</Page>;
};

export default ProposalDetailsPage;

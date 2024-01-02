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

const ProposalDetailsPage = () => {
  const { pluginAddress, daoAddress } = useAppGlobalConfig();
  const { proposalId } = useParams();
  const { data, error, isLoading } = useDaoProposal(
    getPluginProposalId(pluginAddress, proposalId ? parseInt(proposalId) : 0)
  );

  return (
    <Page>{data ? <ProposalDetails proposal={data} /> : null}</Page>
  );
};

export default ProposalDetailsPage;

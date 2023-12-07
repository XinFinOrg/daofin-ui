import React from "react";
import Proposals from "../components/Proposals";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import useDaoProposals from "../hooks/useDaoProposals";
import { Container } from "@chakra-ui/layout";
import Page from "../components/Page";

const ProposalsPage = () => {
  const { daoAddress, pluginAddress } = useAppGlobalConfig();
  const { data, error, isLoading } = useDaoProposals(daoAddress, pluginAddress);
  return (
    <Page>
      <Container>
        <Proposals proposals={data} />
      </Container>
    </Page>
  );
};

export default ProposalsPage;

import React from "react";
import Proposals from "../components/Proposals";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import useDaoProposals from "../hooks/useDaoProposals";
import { Container } from "@chakra-ui/layout";

const ProposalsPage = () => {
  const { daoAddress, pluginAddress } = useAppGlobalConfig();
  const { data, error, isLoading } = useDaoProposals(daoAddress, pluginAddress);
  return (
    <>
      <Container>
        <Proposals proposals={data} />
      </Container>
    </>
  );
};

export default ProposalsPage;

import React, { useCallback, useMemo } from "react";
import Proposals from "../components/Proposals";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import useDaoProposals from "../hooks/useDaoProposals";
import { Container } from "@chakra-ui/layout";
import Page from "../components/Page";
import { Button } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

const ProposalsPage = () => {
  const { daoAddress, pluginAddress } = useAppGlobalConfig();
  const { data, error, isLoading } = useDaoProposals(daoAddress, pluginAddress);
  console.log({ data });

  return (
    <Page>
      <Proposals proposals={data} />
    </Page>
  );
};

export default ProposalsPage;

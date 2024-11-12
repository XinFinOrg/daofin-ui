import Proposals from "../components/Proposals";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import useDaoProposals from "../hooks/useDaoProposals";
import Page from "../components/Page";
import { useAccount } from "wagmi";

const ProposalsPage = () => {
  const { daoAddress, pluginAddress } = useAppGlobalConfig();
  const { data } = useDaoProposals(daoAddress, pluginAddress);
  // const {}=use()
  return (
    <Page>
      <Proposals proposals={data} />
    </Page>
  );
};

export default ProposalsPage;

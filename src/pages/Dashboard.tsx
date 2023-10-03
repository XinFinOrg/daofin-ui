import { FC } from "react";
import DaoHeader from "../components/DaoHeader";
import DaofinSettingsCard from "../components/DaofinSettingsCard";
import { styled } from "styled-components";
import useDaoProposals from "../hooks/useDaoProposals";
import { useClient } from "../hooks/useClient";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import Deposits from "../components/Deposits";
import useDeposits from "../hooks/useDeposits";
import { getPluginInstallationId } from "../utils/networks";
import { Box } from "@chakra-ui/layout";
import ManageJudiciary from "../components/ManageJudiciary";

const DashboardWrapper = styled.div.attrs({
  className: "m-4 w-100 grid grid-cols-12 grid-rows-12 gap-4",
})``;

const Dashboard: FC = () => {
  const { daofinClient, client } = useClient();
  const { daoAddress, pluginAddress } = useAppGlobalConfig();
  const proposals = useDaoProposals(daoAddress, pluginAddress);
  console.log({ proposals });
  const { data: deposits } = useDeposits(
    getPluginInstallationId(daoAddress, pluginAddress)
  );
  return (
    <>
      <DashboardWrapper>
        <Box className="col-span-12">
          <DaoHeader />
        </Box>
        <Box className="col-span-8">
          <DaofinSettingsCard />
        </Box>
        <Box className="col-span-4">
          <Box className="h-fit row-span-3">
            <Deposits />
          </Box>
          <Box className="h-fit col-span-4 row-span-3">
            <ManageJudiciary />
          </Box>
        </Box>
      </DashboardWrapper>
    </>
  );
};
export default Dashboard;

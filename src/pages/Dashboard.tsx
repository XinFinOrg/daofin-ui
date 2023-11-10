import { FC } from "react";
import DaoHeader from "../components/DaoHeader";
import DaofinSettingsCard from "../components/DaofinSettingsCard";
import { styled } from "styled-components";
import useDaoProposals from "../hooks/useDaoProposals";
import { useClient } from "../hooks/useClient";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import PeoplesHouseDeposits from "../components/PeoplesHouseDeposits";
import usePeoplesHouseDeposits from "../hooks/useDeposits";
import { getPluginInstallationId } from "../utils/networks";
import { Box } from "@chakra-ui/layout";
import ManageJudiciary from "../components/ManageJudiciary";
import ManageMasterNodeDelegatee from "../components/ManageMasterNodeDelegatee";
import WrongNetwork from "../components/WrongNetwork";

const DashboardWrapper = styled.div.attrs({
  className: "m-4 w-100 grid grid-cols-12 grid-rows-12 gap-4",
})``;

const Dashboard: FC = () => {
  const { daofinClient, client } = useClient();
  const { daoAddress, pluginAddress } = useAppGlobalConfig();
  const proposals = useDaoProposals(daoAddress, pluginAddress);
  const { data: deposits } = usePeoplesHouseDeposits(
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
            {deposits && <PeoplesHouseDeposits deposits={deposits} />}
          </Box>
          <Box className="h-fit col-span-4 row-span-3">
            <ManageJudiciary />
          </Box>
          <Box className="h-fit col-span-4 row-span-3">
            <ManageMasterNodeDelegatee />
          </Box>
        </Box>
      </DashboardWrapper>
    </>
  );
};
export default Dashboard;

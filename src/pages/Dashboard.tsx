import { FC, useState } from "react";
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

import {
  Button,
  useDisclosure,
  VStack,
  Text,
  Badge,
  HStack,
  Flex,
  Container,
} from "@chakra-ui/react";
import { Modal, Page } from "../components";
import { v4 as uuid } from "uuid";
import { useLocation, useNavigate } from "react-router-dom";
import Proposals from "../components/Proposals";
const DashboardWrapper = styled.div.attrs({
  className: "grid grid-cols-12 grid-rows-12 gap-4",
})``;

const Dashboard: FC = () => {
  const { daofinClient, client } = useClient();
  const navigate = useNavigate();
  const { daoAddress, pluginAddress } = useAppGlobalConfig();
  const proposals = useDaoProposals(daoAddress, pluginAddress);
  const { data: deposits } = usePeoplesHouseDeposits(
    getPluginInstallationId(daoAddress, pluginAddress)
  );

  const { isOpen, onClose, onToggle } = useDisclosure();

  const [proposalTypes, setProposalTypes] = useState([
    {
      id: uuid(),
      name: "Grant",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      isComingSoon: false,
      proposalId: 1,
    },
    {
      id: uuid(),
      name: "Update Settings",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      isComingSoon: true,
    },
    {
      id: uuid(),
      name: "Modify Voting Period",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      isComingSoon: true,
    },
  ]);
  console.log({ proposals });

  return (
    <Page>
      {/* <DashboardWrapper>
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
      </DashboardWrapper> */}
      <Button color={"primary"} onClick={() => onToggle()}>
        Make a new Proposal
      </Button>
      <Flex justifyContent={"center"} p={2}>
        <Box w={"90%"}>{<Proposals proposals={proposals.data} />}</Box>
      </Flex>
      {isOpen && (
        <Modal
          title="What would like to propose?"
          isOpen={isOpen}
          onClose={onClose}
          size="lg"
        >
          <VStack w={"full"}>
            {proposalTypes.map(
              ({ name, description, isComingSoon, id, proposalId }) => (
                <Flex
                  className={
                    "transition hover:ease-in duration-300 hover:opacity-80	"
                  }
                  direction={"column"}
                  p={2}
                  cursor={"pointer"}
                  w={"full"}
                  onClick={() => {
                    if (isComingSoon) return;
                    navigate(`/create/${proposalId}`);
                  }}
                >
                  <Text fontWeight={"bold"}>
                    {name} {isComingSoon && <Badge>Coming Soon</Badge>}
                  </Text>

                  <Text>{description}</Text>
                </Flex>
              )
            )}
          </VStack>
        </Modal>
      )}
    </Page>
  );
};
export default Dashboard;

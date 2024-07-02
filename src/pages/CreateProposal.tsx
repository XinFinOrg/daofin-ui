import CreateProposalStepper from "../components/CreateProposalStepper/CreateProposalStepper";

import { useParams, useNavigate } from "react-router";

import { CreateProposalProvider } from "../contexts/CreateProposalContext";
import { Modal, Page } from "../components";
import { DefaultButton } from "../components/Button";
import JudiciariesIcon from "../utils/assets/icons/JudiciariesIcon";
import { Box, HStack, Text, useDisclosure } from "@chakra-ui/react";
import PeopleHouseIcon from "../utils/assets/icons/PeopleHouseIcon";
import MasterNodeDelegateeSenateIcon from "../utils/assets/icons/MasterNodeDelegateeSenateIcon";
import { DefaultAlert } from "../components/Alerts";
import { useEffect } from "react";
import useIsValidVoter from "../hooks/contractHooks/useIsUserVotedOnProposal";

export interface CreateProposalFormData {
  metaData: {
    title: string;
    summary: string;
    description: string;
    resources: { name: string; url: string }[];
  };
  action: {
    recipient: string;
    amount: string;
  };
  selectedElectionPeriod: string;
  proposalTypeId: string;
}
const CreateProposal = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { isOpen, onOpen } = useDisclosure();
  const { data: isValidVoter } = useIsValidVoter();

  useEffect(() => {
    if (isValidVoter === false) {
      onOpen();
    }
  }, [isValidVoter]);

  return (
    <Page>
      <CreateProposalProvider>
        <CreateProposalStepper proposalTypeId={params.type} />
      </CreateProposalProvider>

      <Modal noCloseButton isOpen={isOpen} title="" onClose={() => {}}>
        <HStack margin={"auto"} w={"60%"}>
          <JudiciariesIcon />
          <PeopleHouseIcon />
          <MasterNodeDelegateeSenateIcon />
        </HStack>
        <Box my={5}>
          <DefaultAlert status={"warning"}>
            <Text>
              <Text mb={2} textDecoration={'underline'} textUnderlineOffset={'0.2rem'}>You are not a valid voter.</Text>
              In order to make a proposal, you must be part of one of the above
              communities.
            </Text>
          </DefaultAlert>
        </Box>
        <DefaultButton onClick={() => navigate("/community")} w={"full"} mb={4}>
          Go to Comminity page
        </DefaultButton>
        
      </Modal>
    </Page>
  );
};

export default CreateProposal;

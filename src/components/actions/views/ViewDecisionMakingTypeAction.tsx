import { Box, Text } from "@chakra-ui/react";
import { Form, useFormikContext } from "formik";

import { DefaultInput } from "../..";
import { CHAIN_METADATA } from "../../../utils/networks";
import { useNetwork } from "../../../contexts/network";
import { CreateProposalFormData } from "../../../pages/CreateProposal";

const ViewDecisionMakingTypeAction = () => {
  return (
    <Box p={4}>
      <Text fontWeight={'400'} lineHeight={'1.5'} textUnderlineOffset={'0.3rem'}>No Funding is involved in.</Text>
    </Box>
  );
};

export default ViewDecisionMakingTypeAction;

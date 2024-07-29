import { Box, Text } from "@chakra-ui/react";
import { Form, useFormikContext } from "formik";

import { DefaultInput } from "../..";
import { CHAIN_METADATA } from "../../../utils/networks";
import { useNetwork } from "../../../contexts/network";
import { CreateProposalFormData } from "../../../pages/CreateProposal";

const DecisionMakingTypeFormAction = () => {
  return (
    <Box >
      <Text fontWeight={'400'} lineHeight={'1.5'} textUnderlineOffset={'0.3rem'}><strong>Caution:</strong> The main goal of this proposal is making an on-chain decision and not
      designed to be managed funds.</Text>
    </Box>
  );
};

export default DecisionMakingTypeFormAction;

import { Box,  } from "@chakra-ui/react";
import { Form, useFormikContext } from "formik";

import { DefaultInput } from "../..";
import { CHAIN_METADATA } from "../../../utils/networks";
import { useNetwork } from "../../../contexts/network";
import { CreateProposalFormData } from "../../../pages/CreateProposal";

const GrantsProposalTypeForm = () => {
  const {  setFieldValue } = useFormikContext<CreateProposalFormData>();
  const { network } = useNetwork();
  return (
    <Box>
      <Form>
        <Box className="mb-4">
          <DefaultInput
            name="action.recipient"
            label="Recipient Address"
            isRequired={true}
            rightAddon="Paste"
            onClickRightAddon={async (e: any) => {
              const value = await navigator.clipboard.readText();
              setFieldValue("action.recipient", value);
            }}
          />
        </Box>
        <Box>
          <DefaultInput
            rightAddon={CHAIN_METADATA[network].nativeCurrency.symbol}
            type="number"
            name="action.amount"
            label="Requested amount"
          />
        </Box>
      </Form>
    </Box>
  );
};

export default GrantsProposalTypeForm;

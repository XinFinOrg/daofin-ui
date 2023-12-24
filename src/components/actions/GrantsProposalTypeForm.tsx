import { Box, FormControl, useClipboard } from "@chakra-ui/react";
import { Form, useFormikContext } from "formik";
import React from "react";
import { DefaultInput } from "..";
import { CreateProposalFormData } from "../../pages/CreateProposal";
import { CHAIN_METADATA } from "../../utils/networks";
import { useNetwork } from "../../contexts/network";

const GrantsProposalTypeForm = () => {
  const { values, setFieldValue } = useFormikContext<CreateProposalFormData>();
  const { network } = useNetwork();
  return (
    <Box>
      <Form>
        <Box className="mb-4">
          <DefaultInput
            name="action.recipient"
            label="Recipient"
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
            noErrorMessage
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

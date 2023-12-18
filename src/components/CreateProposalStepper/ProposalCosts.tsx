import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Box,
  Flex,
  FormControl,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useClipboard,
  useRadio,
} from "@chakra-ui/react";
import { Form, useField, useFormikContext } from "formik";
import { FC, useMemo } from "react";
import { DefaultInput } from "..";
import { CreateProposalFormData } from "../../pages/CreateProposal";

import useDaoElectionPeriods, {
  ElectionPeriod,
} from "../../hooks/useDaoElectionPeriods";
import { v4 as uuid } from "uuid";
import { CHAIN_METADATA } from "../../utils/networks";
import { useNetwork } from "../../contexts/network";
import { ProposalCostIcon } from "../../utils/assets/icons";
const ProposalCosts: FC = () => {
  const { values, setFieldValue } = useFormikContext<CreateProposalFormData>();
  const { network } = useNetwork();
  const coinSymbol = useMemo(
    () => CHAIN_METADATA[network].nativeCurrency.symbol,
    [network]
  );
  return (
    <>
      <Flex flexDirection={"column"} alignItems={"center"}>
        <Box mb={"4"}>
          <ProposalCostIcon />
        </Box>
        <Box>
          <Heading size={"md"}>
            10,000 <sup>{coinSymbol}</sup>
          </Heading>
        </Box>
      </Flex>
      <Box m="4">
        <Alert
          status="warning"
          alignSelf={"start"}
          fontSize={"sm"}
          borderRadius={"md"}
        >
          <AlertIcon />
          <AlertDescription maxWidth="sm">
            A fixed proposal cost at 10,000 {coinSymbol} is to prevent proposal
            spam. Proposal cost is NOT refundable.
          </AlertDescription>
        </Alert>
      </Box>
    </>
  );
};

export default ProposalCosts;

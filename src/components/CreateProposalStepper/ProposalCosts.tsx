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
  Skeleton,
  Stack,
  Text,
  useClipboard,
  useRadio,
} from "@chakra-ui/react";
import { Form, useField, useFormikContext } from "formik";
import { FC, useEffect, useMemo, useState } from "react";
import { DefaultInput } from "..";
import { CreateProposalFormData } from "../../pages/CreateProposal";

import useDaoElectionPeriods, {
  ElectionPeriod,
} from "../../hooks/useDaoElectionPeriods";
import { v4 as uuid } from "uuid";
import { CHAIN_METADATA } from "../../utils/networks";
import { useNetwork } from "../../contexts/network";
import { ProposalCostIcon } from "../../utils/assets/icons";
import { useClient } from "../../hooks/useClient";
import { BigNumberish } from "ethers";
import { toEther } from "../../utils/numbers";
const ProposalCosts: FC = () => {
  const { values, setFieldValue } = useFormikContext<CreateProposalFormData>();
  const [proposalCosts, setProposalCosts] = useState<BigNumberish>(0);
  const { daofinClient } = useClient();

  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    daofinClient?.methods.getProposalCosts().then((data) => {
      setProposalCosts(data);
      setLoading(false);
    });
  }, []);

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
          <Skeleton isLoaded={!isLoading}>
          <Heading size={"md"}>
            {toEther(proposalCosts?.toString())} <sup>{coinSymbol}</sup>
          </Heading>
          </Skeleton>
         
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
            A fixed proposal cost at {toEther(proposalCosts?.toString())} {coinSymbol} is to prevent proposal
            spam. Proposal cost is NOT refundable.
          </AlertDescription>
        </Alert>
      </Box>
    </>
  );
};

export default ProposalCosts;

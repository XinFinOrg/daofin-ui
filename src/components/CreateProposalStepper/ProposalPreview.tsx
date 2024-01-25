import {
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
import { FC, PropsWithChildren, useMemo } from "react";
import { DefaultInput } from "..";

import useDaoElectionPeriods, {
  ElectionPeriod,
} from "../../hooks/useDaoElectionPeriods";
import { v4 as uuid } from "uuid";
import { CHAIN_METADATA } from "../../utils/networks";
import { useNetwork } from "../../contexts/network";
import { DefaultAlert } from "../Alerts";
import { CreateProposalFormData } from "../../pages/CreateProposal";

const HeadText: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Text
      as="h6"
      fontSize="sm"
      fontWeight={"semibold"}
      textTransform={"uppercase"}
    >
      {children}
    </Text>
  );
};

const ProposalPreview: FC = () => {
  const { values, setFieldValue } = useFormikContext<CreateProposalFormData>();
  const { network } = useNetwork();
  return (
    <Flex flexDirection={"column"}>
      <Box mb={"10"}>
        <HeadText>Title</HeadText>
        <Heading as="h6" size={"md"}>
          {values.metaData.title}
        </Heading>
      </Box>

      <Box mb={"3"}>
        <HeadText>Summary</HeadText>

        <Heading as="h6" size={"md"}>
          {values.metaData.summary}
        </Heading>
      </Box>
      <Box mb={"3"}>
        <HeadText>Description</HeadText>
        <Text
          size={"md"}
          dangerouslySetInnerHTML={{
            __html: values.metaData.description,
          }}
        ></Text>
      </Box>

      <Box mb={"3"}>
        <HeadText>Resources</HeadText>
        <Flex>
          {values.metaData.resources.map(({ name, url }) => (
            <Box mr={"1"}>
              <a href={url} target="_blank">
                <Badge
                  colorScheme="blue"
                  textColor={"blue.500"}
                  borderRadius={"sm"}
                  px={"1"}
                  fontSize={"xs"}
                >
                  {name}
                </Badge>
              </a>
            </Box>
          ))}
        </Flex>
      </Box>
      <Box mb={"3"}>
        <HeadText>Recipient</HeadText>

        <DefaultAlert p={4}>
          <Text>{values.action.recipient}</Text>
        </DefaultAlert>
      </Box>
      <Box mb={"3"}>
        <HeadText>Amount</HeadText>

        <DefaultAlert p={4}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Text>Requested Amount</Text>
            <Text>
              {values.action.amount}{" "}
              {CHAIN_METADATA[network].nativeCurrency.symbol}
            </Text>
          </Flex>
        </DefaultAlert>
      </Box>
    </Flex>
  );
};

export default ProposalPreview;

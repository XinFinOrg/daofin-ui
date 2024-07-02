import {
  Badge,
  Box,
  Flex,
  FormControl,
  HStack,
  Heading,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useClipboard,
  useRadio,
} from "@chakra-ui/react";
import { Form, useField, useFormikContext } from "formik";
import { FC, PropsWithChildren, useMemo, useState } from "react";
import { DefaultInput } from "..";

import useDaoElectionPeriods, {
  ElectionPeriod,
} from "../../hooks/useDaoElectionPeriods";
import { v4 as uuid } from "uuid";
import { CHAIN_METADATA } from "../../utils/networks";
import { useNetwork } from "../../contexts/network";
import { DefaultAlert } from "../Alerts";
import { CreateProposalFormData } from "../../pages/CreateProposal";
import { addPrefix } from "../../utils/url";
import { DefaultButton } from "../Button";
import { ExpandableText } from "../ExpandableText";
import { CopyIcon } from "@chakra-ui/icons";

const HeadText: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Text
      fontSize="md"
      fontWeight={"bold"}
    >
      {children}
    </Text>
  );
};

const ProposalPreview: FC = () => {
  const { values, setFieldValue } = useFormikContext<CreateProposalFormData>();
  const { network } = useNetwork();
  const [noOfLines, setoOfLines] = useState<number | undefined>(7);
  return (
    <Flex flexDirection={"column"}>
      <Box mb={"3"}>
        <HeadText>Title</HeadText>
        <Text as="p" size={"sm"}>
          {values.metaData.title}
        </Text>
      </Box>

      <Box mb={"3"}>
        <HeadText>Summary</HeadText>

        <Text as="p" size={"sm"}>
          {values.metaData.summary}
        </Text>
      </Box>
      <Box mb={"3"}>
        <HeadText>Description</HeadText>
        <ExpandableText text={values.metaData.description} />
      </Box>

      <Box mb={"3"}>
        <HeadText>Resources</HeadText>
        <Flex>
          {values.metaData.resources.map(({ name, url }) => (
            <Box mr={"1"}>
              <a href={addPrefix(url)} target="_blank">
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

      {values.action.recipient && values.action.amount && (
        <>
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
        </>
      )}
    </Flex>
  );
};

export default ProposalPreview;

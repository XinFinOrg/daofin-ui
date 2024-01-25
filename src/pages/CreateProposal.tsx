import { DaoAction, ProposalMetadata } from "@xinfin/osx-client-common";

import { styled } from "styled-components";
import { useClient } from "../hooks/useClient";
import { v4 as uuid } from "uuid";
import CreateMetaData from "../components/CreateProposalStepper/CreateMetaData";

import CreateProposalStepper from "../components/CreateProposalStepper/CreateProposalStepper";
import { ProposalCreationSteps } from "@xinfin/osx-sdk-client";

import { useDisclosure } from "@chakra-ui/hooks";
import Modal from "../components/Modal/Modal";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Progress } from "@chakra-ui/progress";
import { useState } from "react";
import { TransactionState } from "../utils/types";
import { decodeProposalId } from "@xinfin/osx-sdk-common";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/button";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import {
  CHAIN_METADATA,
  shortenAddress,
  shortenTxHash,
} from "../utils/networks";
import { zeroAddress } from "viem";
import Page from "../components/Page";
import {
  Formik,
  FormikProps,
  useField,
  useFormik,
  useFormikContext,
} from "formik";
import { CreateProposalProvider } from "../contexts/CreateProposalContext";
import {
  CreationFormSchema,
  GrantActionSchema,
  MetaDataSchema,
} from "../schemas/createProposalSchema";
import { useSteps } from "@chakra-ui/stepper";
const CreateProposalWrapper = styled.div.attrs({
  className: "min-h-screen",
})``;

const steps = [
  { id: uuid(), title: "MetaData", StepComponents: CreateMetaData },
  { id: uuid(), title: "Second" },
  { id: uuid(), title: "Third" },
];
type CreateProposalType = {
  metaData: ProposalMetadata;
  actions: DaoAction[];
};

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
  proposalTypeId?: string;
}
const CreateProposal = () => {
  const params = useParams();
  console.log(params);

  return (
    <Page>
      <CreateProposalProvider>
        <CreateProposalStepper proposalTypeId={params.type} />
      </CreateProposalProvider>
    </Page>
  );
};

export default CreateProposal;

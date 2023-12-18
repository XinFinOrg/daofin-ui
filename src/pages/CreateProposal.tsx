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
import { useNavigate } from "react-router";
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
  MetaDataSchema,
} from "../schemas/createProposalSchema";
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
    resource: { name: string; url: string };
    resources: { name: string; url: string }[];
  };
  action: {
    recipient: string;
    amount: string;
  };
  selectedElectionPeriod: string;
}
const CreateProposal = () => {
  // const methods = useForm({
  //   defaultValues: {
  //     metaData: {
  //       title: "",
  //       summary: "",
  //       description: "",
  //       resources: [],
  //       resource: {
  //         name: "",
  //         url: "",
  //       },
  //     },
  //     withdrawAction: {
  //       to: "",
  //       value: 0,
  //       data: "",
  //     },
  //     electionPeriodIndex: 0,
  //   },
  // });
  // 0 - NOT_STAR
  const [proposalState, setProposalState] = useState<{
    key: TransactionState;
    proposalId?: number;
    txHash?: string;
    error: boolean;
  }>({
    key: TransactionState.NONE,
    txHash: "",
    proposalId: -1,
    error: false,
  });
  const { daofinClient, client } = useClient();
  const navigate = useNavigate();
  const resetProposalState = () => {
    setProposalState({
      key: TransactionState.NONE,
      txHash: "",
      proposalId: -1,
      error: false,
    });
  };
  const handleSubmitProposal = async (data: CreateProposalFormData) => {
    const ipfsUri = await daofinClient?.methods.pinMetadata({
      title: data.metaData.title,
      description: data.metaData.description,
      summary: data.metaData.summary,
      resources: data.metaData.resources,
    });

    if (!ipfsUri) return;

    setProposalState((prev) => ({
      ...prev,
      key: TransactionState.LOADING,
    }));
    const proposalIterator = daofinClient?.methods.createProposal({
      metdata: ipfsUri,
      actions: [
        {
          data: new Uint8Array(),
          to: zeroAddress,
          value: BigInt("0"),
        },
      ],
      allowFailureMap: 0,
      electionIndex: data.selectedElectionPeriod,
    });
    if (!proposalIterator) {
      return;
    }

    try {
      for await (const step of proposalIterator) {
        switch (step.key) {
          case ProposalCreationSteps.CREATING:
            console.log(step.txHash);
            setProposalState((prev) => ({
              ...prev,
              key: TransactionState.WAITING,
              txHash: step.txHash,
            }));
            break;
          case ProposalCreationSteps.DONE: {
            console.log("DONE", step.key, step.proposalId);
            setProposalState((prev) => ({
              ...prev,
              key: TransactionState.SUCCESS,
              proposalId: decodeProposalId(step.proposalId).id,
            }));

            break;
          }
        }
      }
    } catch (error) {
      console.log(error);
      resetProposalState();
    }
  };

  const initvalues: CreateProposalFormData = {
    metaData: {
      title: "",
      summary: "",
      description: "",
      resource: { name: "", url: "" },
      resources: [{ name: "", url: "" }],
    },
    action: { amount: "", recipient: "" },
    selectedElectionPeriod: "0",
  };
  return (
    <Page>
      <Formik
        initialValues={initvalues}
        validate={(values) => {}}
        validationSchema={CreationFormSchema}
        validateOnChange={true}
        onSubmit={handleSubmitProposal}
      >
        {(props: FormikProps<CreateProposalFormData>) => (
          <CreateProposalProvider>
            <CreateProposalStepper />
          </CreateProposalProvider>
        )}
      </Formik>
    </Page>
  );
};

export default CreateProposal;

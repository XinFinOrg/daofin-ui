import { DaoAction, ProposalMetadata } from "@xinfin/osx-client-common";

import { styled } from "styled-components";
import { useClient } from "../hooks/useClient";
import { v4 as uuid } from "uuid";
import CreateMetaData from "../components/CreateMetaData";
import { FormProvider, useForm } from "react-hook-form";
import CreateProposalStepper from "../components/CreateProposalStepper";
import { ProposalCreationSteps } from "@xinfin/osx-sdk-client";

import { useDisclosure } from "@chakra-ui/hooks";
import Modal from "../components/Modal";
import { Text } from "@chakra-ui/layout";
import { Progress } from "@chakra-ui/progress";
import { useEffect } from "react";
import { parseEther } from "@ethersproject/units";
const CreateProposalWrapper = styled.div.attrs({
  className: "flex justify-center",
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
const CreateProposal = () => {
  const methods = useForm({
    defaultValues: {
      metaData: {
        title: "",
        summary: "",
        description: "",
      },
      withdrawAction: {
        to: "",
        value: 0,
        data: "",
      },
      electionPeriodIndex: 0,
    },
  });

  const { daofinClient, client } = useClient();

  const handleSubmitProposal = async (data: any) => {
    onOpen();

    const ipfsUri = await daofinClient?.methods.pinMetadata({
      title: data.metaData.title,
      description: data.metaData.description,
      summary: data.metaData.summary,
      resources: [],
    });
    console.log({ ipfsUri });
    console.log();

    if (!ipfsUri) return;
    
    const proposalIterator = daofinClient?.methods.createProposal({
      metdata: ipfsUri,
      actions: [
        {
          data: new Uint8Array(),
          to: data.withdrawAction.to,
          value:parseEther(data.withdrawAction.value.toString()).toBigInt(),
        },
      ],
      allowFailureMap: 0,
      electionIndex: data.electionPeriodIndex,
    });
    if (!proposalIterator) return;
    try {
      for await (const step of proposalIterator) {
        switch (step.key) {
          case ProposalCreationSteps.CREATING:
            console.log(step.txHash);

            break;
          case ProposalCreationSteps.DONE: {
            console.log("DONE", step.key, step.proposalId);
            onClose();
            break;
          }
        }
      }
    } catch (error) {
      console.log(error);
      onClose();
    }
  };

  const handleOnChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    methods.setValue(name, value);
  };
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <FormProvider {...methods}>
      <CreateProposalWrapper className="px-24">
        <CreateProposalStepper
          handleSubmitProposal={handleSubmitProposal}
          handleOnChange={handleOnChange}
        />
        <Modal isOpen={isOpen} onClose={onClose} title="Publishing Proposal">
          {<Progress isIndeterminate />}
        </Modal>
      </CreateProposalWrapper>
    </FormProvider>
  );
};

export default CreateProposal;

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
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Progress } from "@chakra-ui/progress";
import { useEffect, useState } from "react";
import { parseEther } from "@ethersproject/units";
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
  const handleSubmitProposal = async (data: any) => {
    const ipfsUri = await daofinClient?.methods.pinMetadata({
      title: data.metaData.title,
      description: data.metaData.description,
      summary: data.metaData.summary,
      resources: [],
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
          value: BigInt('0'),
        },
      ],
      allowFailureMap: 0,
      electionIndex: data.electionPeriodIndex,
    });
    if (!proposalIterator) {

      return;
    }
    onOpen();
    
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
          <Box className="text-center">
            {proposalState.key === TransactionState.LOADING ||
              (proposalState.key === TransactionState.WAITING && (
                <Box className="text-center">
                  <Progress isIndeterminate />
                </Box>
              ))}
            {proposalState.key === TransactionState.SUCCESS && (
              <Box>
                <CheckCircleIcon w={8} h={8} color="green.500" />
              </Box>
            )}
            {proposalState.txHash && (
              <Box>
                <Link
                  to={`${CHAIN_METADATA["apothem"].explorer}/txs/${proposalState.txHash}`}
                  target="_blank"
                  className="blue"
                >
                  Tx Hash {shortenTxHash(proposalState.txHash)}
                </Link>
              </Box>
            )}

            {proposalState?.proposalId && proposalState?.proposalId > -1 && (
              <>
                <Text>Proposal ID: {proposalState.proposalId}</Text>
                <Button
                  onClick={() => {
                    navigate(`/proposals/${proposalState.proposalId}/details`);
                    resetProposalState();
                  }}
                >
                  Go to
                </Button>
              </>
            )}
          </Box>
        </Modal>
      </CreateProposalWrapper>
    </FormProvider>
  );
};

export default CreateProposal;

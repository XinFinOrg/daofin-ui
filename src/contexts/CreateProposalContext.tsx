import { useFormikContext } from "formik";
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import styled from "styled-components";
import { CreateProposalFormData } from "../pages/CreateProposal";
import { usePollGasFee } from "../hooks/usePollGasfee";
import { useClient } from "../hooks/useClient";
import { CreateProposalParams } from "@xinfin/osx-daofin-sdk-client";
import { TransactionReviewModal } from "../components/Modal";
import { useDisclosure } from "@chakra-ui/react";
import { BigNumberish, BigNumber } from "@ethersproject/bignumber";
import { TransactionState } from "../utils/types";
import { decodeAbiParameters, parseEther } from "viem";
import { ProposalCreationSteps } from "@xinfin/osx-sdk-client";
import useTransactionModalDisclosure from "../hooks/useTransactionModalDisclosure";

export type CreateProposalContextType = {
  handlePublishProposal: () => void;
  isOpenPublishModal: boolean;
  handleOpenPublishModal: () => void;
};

const CreateProposalContext = createContext<CreateProposalContextType | null>(
  null
);

const CreateProposalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [proposalCreationData, setProposalCreationData] =
    useState<CreateProposalParams>();

  const { values, resetForm } = useFormikContext<CreateProposalFormData>();
  const { action, metaData, selectedElectionPeriod } = values;

  const { daofinClient } = useClient();

  const { isOpen, onClose, onOpen } = useTransactionModalDisclosure();

  const [creationProcessState, setCreationProcessState] =
    useState<TransactionState>();

  const [publishedTxData, setPublishedTxData] = useState<{
    hash: string;
    data: {
      goTo: string;
      text: string;
    };
  }>();

  const shouldPoll =
    proposalCreationData !== undefined &&
    creationProcessState === TransactionState.LOADING;

  const estimateCreationFees = useCallback(async () => {
    if (proposalCreationData && daofinClient?.estimation)
      return await daofinClient?.estimation.createProposal(
        proposalCreationData
      );
  }, [daofinClient?.estimation, proposalCreationData]);

  const { stopPolling, txCosts, txFees } = usePollGasFee(
    estimateCreationFees,
    shouldPoll
  );

  const handlePublishProposal = async () => {
    if (!proposalCreationData) return;
    const proposalIterator =
      daofinClient?.methods.createProposal(proposalCreationData);
    if (!proposalIterator) {
      return;
    }
    setCreationProcessState(TransactionState.WAITING);

    try {
      for await (const step of proposalIterator) {
        switch (step.key) {
          case ProposalCreationSteps.CREATING:
            setPublishedTxData({
              hash: step.txHash,
              data: {
                goTo: "",
                text: "",
              },
            });
            break;
          case ProposalCreationSteps.DONE: {
            // if (!publishedTxData) return;
            setPublishedTxData((prev) => ({
              hash: prev?.hash ? prev.hash : "",
              data: {
                goTo: `/proposals/${step.proposalId.split("_0x")[1]}/details`,
                text: "View my proposal",
              },
            }));

            setCreationProcessState(TransactionState.SUCCESS);
            resetForm();
            stopPolling();
            break;
          }
        }
      }
    } catch (error) {
      console.log(error);
      setCreationProcessState(TransactionState.ERROR);
    }
  };

  const handleOpenPublishModal = async () => {
    onOpen(() => {
      setCreationProcessState(TransactionState.LOADING);
    });
    let metadaIpfsHash;
    try {
      metadaIpfsHash = await daofinClient?.methods.pinMetadata(metaData);
    } catch {
      throw Error("Could not pin metadata on IPFS");
    }
    if (!metadaIpfsHash) return;

    setProposalCreationData({
      metdata: metadaIpfsHash,
      actions: [
        {
          data: new Uint8Array(),
          to: action.recipient,
          value: BigInt(parseEther(action.amount.toString())),
        },
      ],
      proposalType: 0,
      allowFailureMap: 0,
      electionIndex: selectedElectionPeriod,
      voteOption: 1,
    });
  };

  return (
    <CreateProposalContext.Provider
      value={{
        handlePublishProposal,
        handleOpenPublishModal,
        isOpenPublishModal: isOpen,
      }}
    >
      <CreateProposalWrapper>{children}</CreateProposalWrapper>

      {isOpen && (
        <TransactionReviewModal
          isOpen={isOpen}
          onClose={() =>
            onClose(() => {
              stopPolling();
            })
          }
          data={txFees}
          totalCosts={txCosts}
          onSubmitClick={handlePublishProposal}
          status={creationProcessState}
          txData={publishedTxData}
        />
      )}
    </CreateProposalContext.Provider>
  );
};

const useCreateProposalContext = () => {
  return useContext(CreateProposalContext) as CreateProposalContextType;
};
const CreateProposalWrapper = styled.div.attrs({
  className: "min-h-screen",
})``;

export { CreateProposalProvider, useCreateProposalContext };

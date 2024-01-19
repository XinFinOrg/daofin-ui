import { useDisclosure } from "@chakra-ui/react";
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { Proposal, TransactionState } from "../utils/types";
import TransactionReviewModal, {
  ModalActionButtonType,
} from "../components/Modal/TransactionReviewModal";
import { useNetwork } from "./network";
import { useClient } from "../hooks/useClient";
import { usePollGasFee } from "../hooks/usePollGasfee";
import { ExecuteProposalStep } from "@xinfin/osx-sdk-client";
import { useFormikContext } from "formik";
import { ExecuteSteps } from "@xinfin/osx-daofin-sdk-client";
import { DefaultInput, Modal } from "../components";
import { DefaultButton } from "../components/Button";
import { CHAIN_METADATA } from "../utils/networks";
import { ViewGrantProposalType } from "../components/actions";

interface ExecuteProposalContextType {
  handleSendTx: () => void;
  handleOpenPublishModal: () => void;
  handleToggleFormModal: () => void;
}
type ExecuteParam = {
  proposalId: string;
};
const ExecuteProposalContext = createContext<ExecuteProposalContextType | null>(
  null
);

const ExecuteProposalProvider: FC<
  PropsWithChildren & { proposal: Proposal|undefined }
> = ({ children, proposal }) => {
  const {
    isOpen: isOpenExecuteModal,
    onClose: onCloseExecuteModal,
    onOpen: onOpenExecuteModal,
  } = useDisclosure();

  const {
    isOpen: txReviewIsOpen,
    onToggle: txReviewToggle,
    onOpen: txReviewOpen,
    onClose: txReviewClose,
  } = useDisclosure();

  const [creationProcessState, setCreationProcessState] =
    useState<TransactionState>();

  const [publishedTxData, setPublishedTxData] = useState<{
    hash: string;
    data: ModalActionButtonType;
  }>();
  const { network } = useNetwork();
  const { daofinClient } = useClient();

  const { values, resetForm } = useFormikContext<ExecuteParam>();
  const { proposalId } = values;
  const shouldPoll = creationProcessState === TransactionState.LOADING;

  const estimateCreationFees = useCallback(async () => {
    if (proposalId && daofinClient?.estimation)
      return await daofinClient.estimation.execute(proposalId);
  }, [daofinClient?.estimation]);

  const { stopPolling, txCosts, txFees } = usePollGasFee(
    estimateCreationFees,
    shouldPoll
  );
  const handleSendTx = async () => {
    if (!proposalId) return;

    const steps = daofinClient?.methods.execute(proposalId);
    if (!steps) {
      return;
    }
    setCreationProcessState(TransactionState.WAITING);
    try {
      for await (const step of steps) {
        switch (step.key) {
          case ExecuteSteps.WAITING:
            setPublishedTxData({
              hash: step.txHash,
              data: {
                goTo: "/",
                text: "Go to Dashboard page",
              },
            });
            break;
          case ExecuteSteps.DONE:
            setCreationProcessState(TransactionState.SUCCESS);
            break;
        }
      }
    } catch (error) {
      console.log(error);
      setCreationProcessState(TransactionState.ERROR);
    }
  };
  const handleOpenPublishModal = () => {
    txReviewOpen();
    onCloseExecuteModal();
  };
  const handleToggleFormModal = () => {
    onOpenExecuteModal();
  };
  const handleExecuteClicked = () => {
    setCreationProcessState(TransactionState.LOADING);
    onCloseExecuteModal();
    txReviewOpen();
  };
  return (
    <ExecuteProposalContext.Provider
      value={{
        handleSendTx,
        handleOpenPublishModal,
        handleToggleFormModal,
      }}
    >
      {children}
      {isOpenExecuteModal && (
        <Modal
          isOpen={isOpenExecuteModal}
          onClose={() => {
            onCloseExecuteModal();
            resetForm();
          }}
          size={"xl"}
          title="Execute the proposal"
        >
          <>
            {/* {proposal.actions()} */}
            {proposal?.actions.map((item) => (
              <ViewGrantProposalType {...item} />
            ))}

            <DefaultButton
              w={"full"}
              colorScheme="blue"
              type="submit"
              onClick={handleExecuteClicked}
            >
              Execute Now
            </DefaultButton>
          </>
        </Modal>
      )}
      {txReviewIsOpen && (
        <TransactionReviewModal
          isOpen={txReviewIsOpen}
          onClose={() => {
            txReviewClose();
            resetForm();
            stopPolling();
          }}
          data={txFees}
          totalCosts={txCosts}
          onSubmitClick={handleSendTx}
          status={creationProcessState}
          txData={publishedTxData}
        />
      )}
    </ExecuteProposalContext.Provider>
  );
};
const useExecuteProposalContext = () => {
  return useContext(ExecuteProposalContext) as ExecuteProposalContextType;
};
export { useExecuteProposalContext, ExecuteProposalProvider };

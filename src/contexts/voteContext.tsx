import { useDisclosure } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { VoteFormType } from "../pages/ProposalDetailsPage";
import VoteFormModal from "../components/Modal/VoteFormModal";
import { TransactionReviewModal } from "../components/Modal";
import { Proposal, TransactionState } from "../utils/types";
import { ModalActionButtonType } from "../components/Modal/TransactionReviewModal";
import { useClient } from "../hooks/useClient";
import { usePollGasFee } from "../hooks/usePollGasfee";
import { VoteSteps } from "@xinfin/osx-daofin-sdk-client";

interface VoteContextType {
  handleSendTx: () => void;
  handleOpenPublishModal: () => void;
  handleToggleFormModal: () => void;
}
const VoteContext = createContext<VoteContextType | null>(null);

interface VoteProviderProps extends PropsWithChildren {
  proposal: Proposal | undefined;
  proposalId: string;
}

export const VoteProvider: FC<VoteProviderProps> = ({
  children,
  proposalId,
}) => {
  const { isOpen, onToggle, onClose, onOpen } = useDisclosure();
  const {
    isOpen: txReviewIsOpen,
    onToggle: txReviewToggle,
    onOpen: txReviewOpen,
    onClose: txReviewClose,
  } = useDisclosure();

  const { values, resetForm } = useFormikContext<VoteFormType>();
  const { daofinClient } = useClient();
  const [creationProcessState, setCreationProcessState] =
    useState<TransactionState>();

  const [publishedTxData, setPublishedTxData] = useState<{
    hash: string;
    data: ModalActionButtonType | undefined;
  }>();

  const shouldPoll =
    values !== undefined && creationProcessState === TransactionState.LOADING;

  const estimateCreationFees = useCallback(async () => {
    if (values.voteOption && daofinClient?.estimation)
      return await daofinClient.estimation.vote(
        proposalId,
        values.voteOption,
        false
      );
  }, [daofinClient?.estimation, values.voteOption]);

  const { stopPolling, txCosts, txFees, hasLoaded } = usePollGasFee(
    estimateCreationFees,
    shouldPoll
  );

  const handleToggleFormModal = () => {
    onOpen();
    resetForm();
  };
  const handleSendTx = async () => {
    const iterator = daofinClient?.methods.vote(
      proposalId,
      values.voteOption,
      false
    );

    if (!iterator) return;
    setCreationProcessState(TransactionState.WAITING);
    try {
      for await (const step of iterator) {
        switch (step.key) {
          case VoteSteps.WAITING:
            setPublishedTxData({
              hash: step.txHash,
              data: undefined,
            });
            break;
          case VoteSteps.DONE:
            setCreationProcessState(TransactionState.SUCCESS);

            break;
        }
      }
    } catch (e) {
      setCreationProcessState(TransactionState.ERROR);
      console.log(e);
    }
  };

  const handleOpenPublishModal = () => {
    onClose();
    txReviewOpen();
    setCreationProcessState(TransactionState.LOADING);
  };
  return (
    <VoteContext.Provider
      value={{
        handleToggleFormModal,
        handleSendTx,
        handleOpenPublishModal,
      }}
    >
      {children}
      <>
        {isOpen && (
          <VoteFormModal
            isOpen={isOpen}
            onClose={onClose}
            handleOpenPublishModal={handleOpenPublishModal}
          />
        )}
        {txReviewIsOpen && (
          <TransactionReviewModal
            hasLoaded={hasLoaded}
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
      </>
    </VoteContext.Provider>
  );
};

export const useVoteContext = () => {
  return useContext(VoteContext) as VoteContextType;
};

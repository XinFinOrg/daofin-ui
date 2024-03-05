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
import { useWallet } from "../hooks/useWallet";
import useIsXDCValidatorCandidate from "../hooks/useIsXDCValidatorCandidate";
import { zeroAddress } from "viem";
import useIsMasterNodeDelegatee from "../hooks/useIsMasterNodeDelegatee";
import useIsJudiciaryMember from "../hooks/useIsJudiciaryMember";
import useIsUserDeposited from "../hooks/useIsUserDeposited";
import useIsUserVotedOnProposal from "../hooks/useIsUserVotedOnProposal";
import { useModal } from "./ModalContext";
import useDaoElectionPeriods, {
  useFindProposalElectionPeriod,
} from "../hooks/useDaoElectionPeriods";
import { toStandardTimestamp } from "../utils/date";

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
  proposal,
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

  const { stopPolling, txCosts, txFees } = usePollGasFee(
    estimateCreationFees,
    shouldPoll
  );

  const { address } = useWallet();

  const isMasterNode = useIsXDCValidatorCandidate(
    address ? address : zeroAddress
  );
  const isDelegatee = useIsMasterNodeDelegatee(address ? address : zeroAddress);
  const isJury = useIsJudiciaryMember(address ? address : zeroAddress);

  const isUserDeposited = useIsUserDeposited(address ? address : zeroAddress);

  const isUserVoted = useIsUserVotedOnProposal(proposalId);

  const { data, isActive } = useFindProposalElectionPeriod(proposal?.startDate);
  const { displayModal } = useModal();
  const handleToggleFormModal = () => {
    if (!address) displayModal("connect-wallet");
    else if (isMasterNode) displayModal("not-mn");
    else if (!(isDelegatee || isJury || isUserDeposited))
      displayModal("not-voter");
    else if (isUserVoted) displayModal("voted-already");
    else if (isActive)
      displayModal(
        "waiting-to-start-election",
        toStandardTimestamp(data?.startDate ? data?.startDate : 0)
      );
    else {
      onOpen();
      resetForm();
    }
  };
  const handleSendTx = async () => {
    const iterator = daofinClient?.methods.vote(
      proposalId,
      values.voteOption,
      false
    );
    console.log(values.voteOption);

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

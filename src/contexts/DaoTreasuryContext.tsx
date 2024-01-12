import { Box, Button, Text, useDisclosure } from "@chakra-ui/react";
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { DefaultInput, Modal } from "../components";
import { DefaultButton } from "../components/Button";
import { CHAIN_METADATA } from "../utils/networks";
import { useNetwork } from "./network";
import { useClient } from "../hooks/useClient";
import { useFormikContext } from "formik";
import { toEther, toWei } from "../utils/numbers";
import { useAppGlobalConfig } from "./AppGlobalConfig";
import { zeroAddress } from "viem";
import { TokenType } from "@xinfin/osx-client-common";
import { DaoDepositSteps, DepositParams } from "@xinfin/osx-sdk-client";
import { TransactionReviewModal } from "../components/Modal";
import { TransactionState } from "../utils/types";
import { ModalActionButtonType } from "../components/Modal/TransactionReviewModal";
import { usePollGasFee } from "../hooks/usePollGasfee";
export interface DaoTreasuryContextType {
  handleSendTx: () => void;
  handleOpenPublishModal: () => void;
  handleToggleFormModal: () => void;
}
type DepositForm = {
  amount: string;
};
const DaoTreasuryContext = createContext<DaoTreasuryContextType | null>(null);

const DaoTreasuryProvider: FC<PropsWithChildren> = ({ children }) => {
  const {
    isOpen: isOpenDepositModal,
    onClose: onCloseDepositModal,
    onOpen: onOpenDepositModal,
  } = useDisclosure();

  const {
    isOpen: txReviewIsOpen,
    onToggle: txReviewToggle,
    onOpen: txReviewOpen,
    onClose: txReviewClose,
  } = useDisclosure();

  const [params, setParams] = useState<DepositParams>();

  const { network } = useNetwork();
  const { client } = useClient();
  const { daoAddress } = useAppGlobalConfig();

  const { values, resetForm } = useFormikContext<DepositForm>();

  const [creationProcessState, setCreationProcessState] =
    useState<TransactionState>();

  const [publishedTxData, setPublishedTxData] = useState<{
    hash: string;
    data: ModalActionButtonType;
  }>();

  const shouldPoll =
    values !== undefined && creationProcessState === TransactionState.LOADING;

  const estimateCreationFees = useCallback(async () => {
    if (params && client?.estimation)
      return await client.estimation.deposit(params);
  }, [client?.estimation, params]);

  const { stopPolling, txCosts, txFees } = usePollGasFee(
    estimateCreationFees,
    shouldPoll,
    values.amount
  );

  const handleOpenPublishModal = () => {
    txReviewOpen();
  };
  const handleToggleFormModal = () => {
    onOpenDepositModal();
  };

  const handleSendTx = async () => {
    if (!params) return;

    const steps = client?.methods.deposit(params);
    if (!steps) {
      return;
    }
    setCreationProcessState(TransactionState.WAITING);
    try {
      for await (const step of steps) {
        switch (step.key) {
          case DaoDepositSteps.DEPOSITING:
            // step;
            setPublishedTxData({
              hash: step.txHash,
              data: {
                goTo: "/",
                text: "Go to Dashboard page",
              },
            });
            break;
          case DaoDepositSteps.DONE:
            setCreationProcessState(TransactionState.SUCCESS);
            break;
        }
      }
    } catch (error) {
      console.log(error);
      setCreationProcessState(TransactionState.ERROR);
    }
  };
  const handleDepositClick = () => {
    if (!client || !values.amount) return;

    setParams({
      amount: BigInt(toWei(values.amount).toString()),
      daoAddressOrEns: daoAddress,
      type: TokenType.NATIVE,
    });
    onCloseDepositModal();
    txReviewOpen();
    setCreationProcessState(TransactionState.LOADING);
  };
  return (
    <DaoTreasuryContext.Provider
      value={{
        handleOpenPublishModal,
        handleToggleFormModal,
        handleSendTx,
      }}
    >
      {children}
      {isOpenDepositModal && (
        <Modal
          isOpen={isOpenDepositModal}
          onClose={() => {
            onCloseDepositModal();
            resetForm();
          }}
          title="Deposit to Treasury"
        >
          <>
            <DefaultInput
              name="amount"
              rightAddon={`${CHAIN_METADATA[network].nativeCurrency.symbol}`}
              placeholder="0"
              label="Amount"
              isRequired
              mb={"4"}
            />
            <DefaultButton
              w={"full"}
              colorScheme="blue"
              type="submit"
              onClick={handleDepositClick}
            >
              Deposit
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
    </DaoTreasuryContext.Provider>
  );
};

const useDaoTreasury = () =>
  useContext(DaoTreasuryContext) as DaoTreasuryContextType;
export { DaoTreasuryProvider, useDaoTreasury };

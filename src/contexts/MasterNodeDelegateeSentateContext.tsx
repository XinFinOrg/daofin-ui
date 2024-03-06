import { Box, Button, Text, useDisclosure } from "@chakra-ui/react";
import { Formik, useFormikContext } from "formik";
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { DefaultInput, Modal } from "../components";
import { useClient } from "../hooks/useClient";
import { TransactionReviewModal } from "../components/Modal";
import { TransactionState } from "../utils/types";
import { UpdateOrJoinMasterNodeDelegateeType } from "../pages/MasterNodeDelegatePage";
import { usePollGasFee } from "../hooks/usePollGasfee";
import { UpdateOrJoinMasterNodeDelegateeSteps } from "@xinfin/osx-daofin-sdk-client";
import useTransactionModalDisclosure from "../hooks/useTransactionModalDisclosure";
import { ModalActionButtonType } from "../components/Modal/TransactionReviewModal";
import { DefaultAlert } from "../components/Alerts";

interface MasterNodeDelegateeSentateContextType {
  handleSendTx: () => void;
  handleOpenPublishModal: () => void;
  handleToggleFormModal: () => void;
}

const MasterNodeDelegateeSentateContext =
  createContext<MasterNodeDelegateeSentateContextType | null>(null);

export const MasterNodeDelegateeSentateProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const {
    isOpen: txReviewIsOpen,
    onToggle: txReviewToggle,
    onOpen: txReviewOpen,
    onClose: txReviewClose,
  } = useTransactionModalDisclosure();

  const handleToggleFormModal = () => {
    onToggle();
    resetForm();
  };
  const { daofinClient } = useClient();

  const { values, setFieldValue, resetForm } =
    useFormikContext<UpdateOrJoinMasterNodeDelegateeType>();

  const [creationProcessState, setCreationProcessState] =
    useState<TransactionState>();
  const [publishedTxData, setPublishedTxData] = useState<{
    hash: string;
    data: ModalActionButtonType;
  }>();
  const shouldPoll =
    values !== undefined && creationProcessState === TransactionState.LOADING;

  const estimateCreationFees = useCallback(async () => {
    if (values && daofinClient?.estimation)
      return await daofinClient?.estimation.updateOrJoinMasterNodeDelegatee(
        values.delegateeAddress
      );
  }, [daofinClient?.estimation, values.delegateeAddress]);

  const { txCosts, txFees } = usePollGasFee(estimateCreationFees, shouldPoll);

  const handleSendTx = async () => {
    const proposalIterator =
      daofinClient?.methods.updateOrJoinMasterNodeDelegatee(
        values.delegateeAddress
      );
    if (!proposalIterator) {
      return;
    }
    setCreationProcessState(TransactionState.WAITING);

    try {
      for await (const step of proposalIterator) {
        switch (step.key) {
          case UpdateOrJoinMasterNodeDelegateeSteps.WAITING:
            setPublishedTxData({
              hash: step.txHash,
              data: {
                goTo: "/community",
                text: "Go to community page",
              },
            });
            break;
          case UpdateOrJoinMasterNodeDelegateeSteps.DONE: {
            // if (!publishedTxData) return;
            setCreationProcessState(TransactionState.SUCCESS);
            break;
          }
        }
      }
    } catch (error) {
      console.log(error);
      setCreationProcessState(TransactionState.ERROR);
    }
  };
  const handleOpenPublishModal = () => {
    txReviewOpen();
    setCreationProcessState(TransactionState.LOADING);
  };
  return (
    <MasterNodeDelegateeSentateContext.Provider
      value={{
        handleOpenPublishModal,
        handleSendTx,
        handleToggleFormModal,
      }}
    >
      <>
        {children}
        {isOpen && (
          <Modal
            isOpen={isOpen}
            onClose={() => {
              onClose();
              resetForm();
            }}
            title="Delegate a member"
          >
            <>
              <DefaultAlert p={6}>
                <Box>
                  {" "}
                  <Text fontWeight={"semibold"}>How to delegate a member?</Text>
                  <Text>
                    Lorem ipsum dolor sit amet consectetur. Senectus elementum
                    erat pellentesque nisl nibh.
                  </Text>
                </Box>
              </DefaultAlert>
              <DefaultInput
                name="delegateeAddress"
                rightAddon="Paste"
                placeholder="0x..."
                label="Address"
                isRequired
                mb={"4"}
                onClickRightAddon={async (e: any) => {
                  const value = await navigator.clipboard.readText();
                  setFieldValue("delegateeAddress", value);
                }}
              />
              <Button
                w={"full"}
                colorScheme="blue"
                type="submit"
                onClick={() => {
                  setCreationProcessState(TransactionState.LOADING);
                  onClose();
                  txReviewToggle();
                }}
              >
                Delegate
              </Button>
            </>
          </Modal>
        )}
        {txReviewIsOpen && (
          <TransactionReviewModal
            isOpen={txReviewIsOpen}
            onClose={txReviewClose}
            data={txFees}
            totalCosts={txCosts}
            onSubmitClick={handleSendTx}
            status={creationProcessState}
            txData={publishedTxData}
          />
        )}
      </>
    </MasterNodeDelegateeSentateContext.Provider>
  );
};

export const useMasterNodeDelegateeSentateContext = () => {
  return useContext(
    MasterNodeDelegateeSentateContext
  ) as MasterNodeDelegateeSentateContextType;
};

import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DefaultInput, Modal } from "../components";
import { Box, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { useClient } from "../hooks/useClient";
import { useFormikContext } from "formik";
import { UpdateOrJoinMasterNodeDelegateeType } from "../pages/MasterNodeDelegatePage";
import { JoinHouseFormType } from "../pages/PeoplesHousePage";
import { TransactionState } from "../utils/types";
import { usePollGasFee } from "../hooks/usePollGasfee";
import { JoinHouseSteps } from "@xinfin/osx-daofin-sdk-client";
import { TransactionReviewModal } from "../components/Modal";
import { CHAIN_METADATA } from "../utils/networks";
import { useNetwork } from "./network";
import useDaoGlobalSettings from "../hooks/useDaoGlobalSettings";
import { toWei, weiBigNumberToFormattedNumber } from "../utils/numbers";
import useIsUserDeposited from "../hooks/useIsUserDeposited";
import { useWallet } from "../hooks/useWallet";
import useIsJudiciaryMember from "../hooks/useIsJudiciaryMember";
import { ModalActionButtonType } from "../components/Modal/TransactionReviewModal";
import { DefaultAlert } from "../components/Alerts";

interface PeoplesHouseContextType {
  handleSendTx: () => void;
  handleOpenPublishModal: () => void;
  handleToggleFormModal: () => void;
}

const PeoplesHouseContext = createContext<PeoplesHouseContextType | null>(null);

export const PeoplesHouseProvider: FC<PropsWithChildren> = ({ children }) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const {
    isOpen: txReviewIsOpen,
    onToggle: txReviewToggle,
    onOpen: txReviewOpen,
    onClose: txReviewClose,
  } = useDisclosure();

  const handleToggleFormModal = () => {
    onToggle();
    resetForm();
  };
  const { daofinClient } = useClient();

  const { values, setFieldValue, resetForm } =
    useFormikContext<JoinHouseFormType>();

  const [creationProcessState, setCreationProcessState] =
    useState<TransactionState>();

  const [publishedTxData, setPublishedTxData] = useState<{
    hash: string;
    data: ModalActionButtonType;
  }>();

  const shouldPoll =
    values !== undefined && creationProcessState === TransactionState.LOADING;

  const estimateCreationFees = useCallback(async () => {
    if (values.amount && daofinClient?.estimation)
      return await daofinClient.estimation.joinHouse(toWei(values.amount));
  }, [daofinClient?.estimation, values.amount]);

  const {
    averageFee,
    error,
    maxFee,
    stopPolling,
    tokenPrice,
    txCosts,
    txFees,
    hasLoaded
  } = usePollGasFee(estimateCreationFees, shouldPoll, values.amount);

  const handleSendTx = async () => {
    onClose();
    txReviewOpen();
    const proposalIterator = daofinClient?.methods.joinHouse(
      toWei(values.amount)
    );
    if (!proposalIterator) {
      return;
    }
    setCreationProcessState(TransactionState.WAITING);

    try {
      for await (const step of proposalIterator) {
        switch (step.key) {
          case JoinHouseSteps.DEPOSITING:
            setPublishedTxData({
              hash: step.txHash,
              data: {
                goTo: "/community",
                text: "Go to community page",
              },
            });
            break;
          case JoinHouseSteps.DONE: {
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
  const { address } = useWallet();
  const { network } = useNetwork();
  const { data: settings } = useDaoGlobalSettings();
  const isValidHouseMember = useIsUserDeposited(address);
  
  const handleCloseModal = () => {
    onClose();
    resetForm();
    stopPolling();
  };
  const handleOpenPublishModal = () => {
    txReviewOpen();
    setCreationProcessState(TransactionState.LOADING);
  };
  return (
    <PeoplesHouseContext.Provider
      value={{
        handleSendTx,
        handleOpenPublishModal,
        handleToggleFormModal,
      }}
    >
      {children}
      {isOpen && (
        <Modal isOpen={isOpen} onClose={handleCloseModal} title="Join House">
          <>
            <DefaultAlert>
              <Box>
                {" "}
                <Text fontWeight={"semibold"}>How to Join House?</Text>
                <Text>
                  Adding{" "}
                  {settings
                    ? weiBigNumberToFormattedNumber(
                        settings?.houseMinAmount.toString()
                      )
                    : ""}{" "}
                  {CHAIN_METADATA[network].nativeCurrency.symbol} to Treasury
                  will make you a member of People's House
                </Text>
              </Box>
            </DefaultAlert>
            <DefaultInput
              borderBottomRightRadius={0}
              borderTopRightRadius={0}
              name="amount"
              rightAddon={`${CHAIN_METADATA[network].nativeCurrency.symbol}`}
              placeholder="0"
              label="Amount"
              isRequired
              mb={"4"}
            />
            <Button
              w={"full"}
              colorScheme="blue"
              type="submit"
              onClick={() => {
                onClose();
                txReviewToggle();
                setCreationProcessState(TransactionState.LOADING);
              }}
              // isDisabled={isValidHouseMember}
            >
              Join House
            </Button>
          </>
        </Modal>
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
    </PeoplesHouseContext.Provider>
  );
};
export const usePeopleHouseContext = () => {
  return useContext(PeoplesHouseContext) as PeoplesHouseContextType;
};

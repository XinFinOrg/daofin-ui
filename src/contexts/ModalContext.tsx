import { useDisclosure, useModalContext } from "@chakra-ui/react";
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import { Modal } from "../components";
import ConnecToWalletModalContent from "../components/Modal/ConnecToWalletModalContent";
import BecomeVoterModalContent from "../components/Modal/BecomeVoterModalContent";
import NoMasterNodeAllowedModalContent from "../components/Modal/NoMasterNodeAllowedModalContent";
import { DefaultButton } from "../components/Button";
import WaitingForElectionToStartModalContent from "../components/Modal/WaitingForElectionToStartModalContent";

export type ModalKey =
  | "non"
  | "connect-wallet"
  | "not-people"
  | "not-mn"
  | "not-jury"
  | "not-voter"
  | "voted-already"
  | "waiting-to-start-election"
  | "cannot-execute";

export type ModalContextType = {
  displayModal: (key: ModalKey, data?: any) => void;
};

export const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider: FC<PropsWithChildren> = ({ children }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [key, setKey] = useState<ModalKey>("non");
  const [modalMetadata, setModalMetadata] = useState();
  const displayModal = (key: ModalKey, data?: any) => {
    onOpen();
    setKey(key);
    if (data) {
      setModalMetadata(data);
    }
  };

  const displayTitle = (key: ModalKey) => {
    switch (key) {
      case "connect-wallet":
        return "Connect your wallet";
      case "non":
        return "Fallback";
      case "not-voter":
        return "Become a voter?";
      case "voted-already":
        return "Voted Already";
      case "not-mn":
        return "You are not allowed to vote";
      case "waiting-to-start-election":
        return "Voting session is not started yet";
      case "cannot-execute":
        return "Proposal is not ready to execute.";
      default:
        return "";
    }
  };
  const displayModalContent = (key: ModalKey) => {
    switch (key) {
      case "connect-wallet":
        return (
          <ConnecToWalletModalContent
            callbackFunction={() => {
              onClose();
            }}
          />
        );

      case "non":
        return "Fallback";

      case "not-voter":
        return (
          <BecomeVoterModalContent
            callbackFunction={() => {
              onClose();
            }}
          />
        );

      case "not-mn":
        return <NoMasterNodeAllowedModalContent />;

      case "voted-already":
        return "";
      case "cannot-execute":
        return "";

      case "waiting-to-start-election":
        return (
          <WaitingForElectionToStartModalContent
            startDate={modalMetadata ? (modalMetadata as number) : 0}
            callbackFunction={() => {
              onClose();
            }}
          />
        );
      default:
        return "";
    }
  };
  return (
    <ModalContext.Provider
      value={{
        displayModal,
      }}
    >
      {children}

      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose} title={displayTitle(key)}>
          {displayModalContent(key)}
        </Modal>
      )}
    </ModalContext.Provider>
  );
};
export const useModal = () => {
  return useContext(ModalContext) as ModalContextType;
};

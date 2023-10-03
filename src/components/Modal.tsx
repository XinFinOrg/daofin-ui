import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";

type ModalProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
};

const Modal: FC<ModalProps & PropsWithChildren> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  return (
    <>
      <ChakraModal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>
        </ModalContent>
      </ChakraModal>
    </>
  );
};
export default Modal;

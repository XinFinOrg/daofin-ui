import {
  Modal as ChakraModal,
  ModalProps as ChakraModalProps,
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

export type ModalProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
};

const Modal: FC<ModalProps & PropsWithChildren & ChakraModalProps> = (
  props
) => {
  const { isOpen, onClose, title, children, size } = props;
  return (
    <>
      <ChakraModal {...props} isOpen={isOpen} onClose={onClose}>
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

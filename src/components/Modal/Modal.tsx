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
  useColorModeValue,
} from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";
import { DefaultBox } from "../Box";

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
        <DefaultBox>
        <ModalOverlay />
        <ModalContent bgColor={useColorModeValue("#F6F7F9", "#151F29")}>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>
        </ModalContent>
        </DefaultBox>
      </ChakraModal>
    </>
  );
};
export default Modal;

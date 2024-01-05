import { useDisclosure } from "@chakra-ui/react";

function useTransactionModalDisclosure() {
  const { isOpen, onClose, onOpen, onToggle } = useDisclosure();
  const handleOpen = (callback?: () => void) => {
    onOpen();
    callback && callback();
  };
  const handleClose = (callback?: () => void) => {
    onClose();
    callback && callback();
  };
  const handleToggle = (callback?: () => void) => {
    onToggle();
    callback && callback();
  };

  return {
    isOpen,
    onClose: handleClose,
    onOpen: handleOpen,
    onToggle: handleToggle,
  };
}
export default useTransactionModalDisclosure;

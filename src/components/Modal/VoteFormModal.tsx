import {
  Box,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import Modal from "./Modal";
import { FC, PropsWithChildren, useMemo, useState } from "react";
import SafeIcon from "../../utils/assets/icons/SafeIcon";
import { VoteOption } from "@xinfin/osx-daofin-sdk-client";
import { useFormik, useFormikContext } from "formik";
import { VoteFormType } from "../../pages/ProposalDetailsPage";
import { DefaultBox } from "../Box";

interface VoteFormModalProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  handleOpenPublishModal: () => void;
}
const VoteFormModal: FC<VoteFormModalProps> = ({
  isOpen,
  onClose,
  children,
  handleOpenPublishModal,
}) => {
  const { values, setFieldValue } = useFormikContext<VoteFormType>();
  const voteOptionsList = useMemo(
    () =>
      Object.entries(VoteOption)
        .filter(([_, value]) => isNaN(Number(value)))
        .slice(1),
    []
  );

  const convertVoteOptionText = (key: VoteOption | number) => {
    switch (key) {
      case VoteOption.ABSTAIN:
        return "Abstain";
      case VoteOption.NO:
        return "No, vote Against";
      case VoteOption.YES:
        return "Yes, I vote For";
      default:
        return "";
    }
  };
  const highlightVoteOption = useColorModeValue("blue.50", "blue.800");
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cast your vote">
      <Box w={"20px"} mb={4}>
        <SafeIcon />
      </Box>
      <VStack>
        <RadioGroup
          onChange={(e) => setFieldValue("voteOption", e)}
          value={values.voteOption.toString()}
          w={"full"}
          mb={4}
        >
          <Stack direction="column" w={"full"}>
            {voteOptionsList.map(([key, text]) => (
              <DefaultBox
                key={key}
                bgColor={
                  values.voteOption.toString() === key ? highlightVoteOption : undefined
                }
                w={"full"}
                px={6}
                py={2}
                textAlign={"center"}
              >
                <Radio value={key}>
                  <Text fontWeight={"semibold"} fontSize={"sm"}>
                    {convertVoteOptionText(+key)}
                  </Text>
                </Radio>
              </DefaultBox>
            ))}
          </Stack>
        </RadioGroup>
        <Button colorScheme="blue" w={"full"} onClick={handleOpenPublishModal}>
          Vote now
        </Button>
      </VStack>
    </Modal>
  );
};

export default VoteFormModal;

import React, { FC, useEffect, useState } from "react";
import Modal, { ModalProps } from "./Modal";
import {
  Alert,
  AlertDescription,
  AlertDialogBody,
  Box,
  Button,
  CircularProgress,
  Flex,
  Heading,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import GasEstimation from "../../utils/assets/icons/GasEstimation.png";
import { XdcIcon } from "../../utils/assets/icons/XdcIcon";
import {
  CheckCircleIcon,
  CheckIcon,
  CloseIcon,
  ExternalLinkIcon,
  LinkIcon,
} from "@chakra-ui/icons";
import { makeBlockScannerHashUrl, shortenTxHash } from "../../utils/networks";
import { IoDocumentTextOutline } from "react-icons/io5";
import { BigNumberish } from "@ethersproject/bignumber";
import { TransactionState } from "../../utils/types";
import { useNetwork } from "../../contexts/network";
export type TransactionReviewModalProps = Pick<
  ModalProps,
  "isOpen" | "onClose"
> & {
  data:
    | {
        title: string;
        value: BigNumberish;
        tooltip: string;
      }[]
    | undefined;
  totalCosts:
    | {
        tokenValue: string;
        usdValue: string;
      }
    | undefined;
  onSubmitClick: () => void;
  status?: TransactionState | undefined;
  //   txData: {
  //     hash: string;
  //     proposalId: string;
  //   };
};
const TransactionReviewModal: FC<TransactionReviewModalProps> = ({
  isOpen,
  onClose,
  data,
  totalCosts,
  onSubmitClick,
  status,
  //   transactionData,
}) => {
  const [title, setTitle] = useState("");
  useEffect(() => {
    switch (status) {
      case TransactionState.WAITING:
        setTitle("Confirmation...");
        return;
      case TransactionState.SUCCESS:
      case TransactionState.ERROR:
        setTitle("");
        return;
      default:
        setTitle("Gas Estimation");
    }
  }, [status]);
  const { network } = useNetwork();
  return (
    <Modal title={title} isOpen={isOpen} onClose={onClose}>
      {status === TransactionState.LOADING && (
        <Box>
          <Box mb={4}>
            <Image src={GasEstimation}></Image>
          </Box>
          <Box bgColor={"blue.50"} p={"4"} mb={4}>
            <Flex flexDirection={"column"}>
              {data &&
                data.map(({ title, tooltip, value }) => (
                  <Flex justifyContent={"space-between"}>
                    <Text fontSize={"sm"} fontWeight={"semibold"}>
                      {title}
                    </Text>
                    <Flex
                      fontSize={"sm"}
                      fontWeight={"semibold"}
                      alignItems={"center"}
                    >
                      <XdcIcon />
                      <Text ml={1}>{value.toString()}</Text>
                    </Flex>
                  </Flex>
                ))}
            </Flex>
          </Box>

          <Box bgColor={"blue.50"} p={"4"} mb={4}>
            <Flex flexDirection={"column"}>
              {totalCosts && (
                <Flex justifyContent={"space-between"}>
                  <Text fontSize={"sm"} fontWeight={"semibold"}>
                    Total Costs
                  </Text>
                  <Flex flexDirection={"column"}>
                    <Flex
                      fontSize={"sm"}
                      fontWeight={"semibold"}
                      alignItems={"center"}
                    >
                      <XdcIcon />
                      <Text ml={1}>{totalCosts.tokenValue}</Text>
                    </Flex>
                    <Text fontSize={"sm"} fontWeight={"semibold"}>
                      ${totalCosts.usdValue}
                    </Text>
                  </Flex>
                </Flex>
              )}
            </Flex>
          </Box>
          <Box>
            <Text as="p" fontSize={"sm"} my={4}>
              Estimation will last 29 seconds...
            </Text>
          </Box>
          <Box>
            <Flex flexDirection={"row"} justifyContent={"end"}>
              <Flex>
                <Button
                  type="submit"
                  colorScheme="blue"
                  m={1}
                  onClick={onSubmitClick}
                >
                  Ok, Submit
                </Button>
              </Flex>
            </Flex>
          </Box>
        </Box>
      )}

      {status === TransactionState.WAITING && (
        <Box>
          <Flex
            alignItems={"center"}
            justifyContent="center"
            flexDirection={"column"}
          >
            <Box mb={4}>
              <CircularProgress isIndeterminate />
            </Box>

            <Box w={"full"}>
              <Alert
                status="info"
                borderRadius={"sm"}
                textAlign="center"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <AlertDescription>
                  <Text>Transaction is processing...</Text>
                </AlertDescription>
              </Alert>
            </Box>
          </Flex>
        </Box>
      )}

      {status === TransactionState.SUCCESS && (
        <Box>
          <Flex flexDirection={"column"} alignItems={"center"}>
            <Box maxW={"20"} maxH={"20"} mb={4}>
              <CheckCircleIcon color={"green"} boxSize={"full"} />
            </Box>
            <Box mb={4}>
              <Text as={"p"} fontWeight={"normal"} fontSize={"sm"}>
                Transaction has successfully completed
              </Text>
            </Box>
            <Box mb={4}>
              <Text
                as={"p"}
                fontWeight={"normal"}
                fontSize={"sm"}
                textAlign={"center"}
              >
                <IoDocumentTextOutline style={{ display: "inline-block" }} />
                <Box as={"span"} mx={2}>
                  {shortenTxHash(
                    "0xa51996fd4438d0080767c0d8d25a954affa8bc836e5ec866bf9ba30ea1510dc5"
                  )}
                </Box>
                <a
                  href={
                    "0xa51996fd4438d0080767c0d8d25a954affa8bc836e5ec866bf9ba30ea1510dc5"
                  }
                  target="_blank"
                >
                  <ExternalLinkIcon />
                </a>
              </Text>
            </Box>

            <Box mb={4} w={"full"}>
              <Button w={"full"} colorScheme="blue" mb={2}>
                View my proposal
              </Button>
              <Button w={"full"} variant={"outline"}>
                Dashboard
              </Button>
            </Box>
          </Flex>
        </Box>
      )}

      {status === TransactionState.ERROR && (
        <Box>
          <Flex flexDirection={"column"} alignItems={"center"}>
            <Box
              maxW={"20"}
              maxH={"20"}
              mb={4}
              bgColor={"red"}
              p={5}
              borderRadius={"50%"}
            >
              <CloseIcon color={"white"} boxSize={"full"} />
            </Box>
            <Box mb={4}>
              <Text as={"p"} fontWeight={"normal"} fontSize={"sm"}>
                Transaction has failed
              </Text>
            </Box>
            <Box mb={4}>
              <Text
                as={"p"}
                fontWeight={"normal"}
                fontSize={"sm"}
                textAlign={"center"}
              >
                <IoDocumentTextOutline style={{ display: "inline-block" }} />
                <Box as={"span"} mx={2}>
                  {shortenTxHash(
                    "0xa51996fd4438d0080767c0d8d25a954affa8bc836e5ec866bf9ba30ea1510dc5"
                  )}
                </Box>
                <a href="" target="_blank">
                  <ExternalLinkIcon />
                </a>
              </Text>
            </Box>

            <Box mb={4} w={"full"}>
              <Button w={"full"} colorScheme="blue" mb={2}>
                Back to Dashboard
              </Button>
              <Button w={"full"} variant={"outline"}>
                Contact Customer Support
              </Button>
            </Box>
          </Flex>
        </Box>
      )}
    </Modal>
  );
};

export default TransactionReviewModal;
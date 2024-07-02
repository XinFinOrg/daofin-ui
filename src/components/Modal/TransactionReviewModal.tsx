import {  useEffect, useState } from "react";
import Modal, { ModalProps } from "./Modal";
import {
  Alert,
  AlertDescription,
  Box,
  Button,
  CircularProgress,
  Flex,
  Image,
  Text,
} from "@chakra-ui/react";
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
import { Link } from "react-router-dom";
import { numberWithCommaSeparate, uuid } from "../../utils/numbers";
import { DefaultAlert } from "../Alerts";
import { DefaultBox } from "../Box";
import { WalletAuthorizedButton } from "../Button/AuthorizedButton";

export type ModalActionButtonType = {
  goTo: string;
  text: string;
};
export type TransactionReviewModalProps<T> = Pick<
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
  txData?: {
    hash: string;
    data: ModalActionButtonType | undefined;
  };
};
const TransactionReviewModal = <T extends any | undefined>({
  isOpen,
  onClose,
  data,
  totalCosts,
  onSubmitClick,
  status,
  txData,
}: TransactionReviewModalProps<T>) => {
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
            <Image src={'GasEstimation.png'}></Image>
          </Box>
          <DefaultBox p={"4"} mb={4}>
            <Flex flexDirection={"column"}>
              {data &&
                data.map(({ title, tooltip, value }) => (
                  <Flex justifyContent={"space-between"} key={uuid()}>
                    <Text fontSize={"sm"} fontWeight={"semibold"}>
                      {title}
                    </Text>
                    <Flex
                      fontSize={"sm"}
                      fontWeight={"semibold"}
                      alignItems={"center"}
                    >
                      <Text mr={1}>
                        {numberWithCommaSeparate(value.toString())}
                      </Text>
                      {/* <Box w={"20px"}>
                        <XdcIcon />
                      </Box> */}
                    </Flex>
                  </Flex>
                ))}
            </Flex>
          </DefaultBox>

          <DefaultBox mb={4}>
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
                      <Text mr={1}>
                        {totalCosts.tokenValue}
                      </Text>
                      <Box w={"20px"}>
                        <XdcIcon />
                      </Box>
                    </Flex>
                    <Text fontSize={"sm"} fontWeight={"semibold"}>
                      {/* ${numberWithCommaSeparate(totalCosts.usdValue)} */}
                      ${totalCosts.usdValue}
                    </Text>
                  </Flex>
                </Flex>
              )}
            </Flex>
          </DefaultBox>
          <Box>
            {/* <Text as="p" fontSize={"sm"} my={4}>
              Estimation will last 29 seconds...
            </Text> */}
          </Box>
          <Box>
            <Flex flexDirection={"row"} justifyContent={"end"}>
              <Flex>
                <WalletAuthorizedButton
                  type="submit"
                  colorScheme="blue"
                  m={1}
                  onClick={onSubmitClick}
                >
                  Ok, Submit
                </WalletAuthorizedButton>
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
                {txData?.hash && (
                  <>
                    <IoDocumentTextOutline
                      style={{ display: "inline-block" }}
                    />
                    <Box as={"span"} mx={2}>
                      {shortenTxHash(txData.hash)}
                    </Box>
                    <a
                      href={makeBlockScannerHashUrl(network, txData.hash)}
                      target="_blank"
                    >
                      <ExternalLinkIcon />
                    </a>
                  </>
                )}
              </Text>
            </Box>

            <Box mb={4} w={"full"}>
              {/* <Link to={`/proposals/${txData?.proposalId}/details`}> */}
              {txData?.data && (
                <Link to={`${txData?.data.goTo}`}>
                  <Button w={"full"} colorScheme="blue" mb={2}>
                    {txData?.data.text}
                  </Button>
                </Link>
              )}

              <Button w={"full"} variant={"outline"} onClick={onClose}>
                Close
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
                {txData && (
                  <>
                    <IoDocumentTextOutline
                      style={{ display: "inline-block" }}
                    />
                    <Box as={"span"} mx={2}>
                      {shortenTxHash(txData.hash)}
                    </Box>
                    <a
                      href={makeBlockScannerHashUrl(network, txData.hash)}
                      target="_blank"
                    >
                      <ExternalLinkIcon />
                    </a>
                  </>
                )}
              </Text>
            </Box>

            <Box mb={4} w={"full"}>
              <Link to={"/"}>
                <Button w={"full"} colorScheme="blue" mb={2}>
                  Back to Dashboard
                </Button>
              </Link>
              <a href="https://www.xdc.dev/new">
                <Button w={"full"} variant={"outline"}>
                  Raise a post on XDC.dev
                </Button>
              </a>
            </Box>
          </Flex>
        </Box>
      )}
    </Modal>
  );
};

export default TransactionReviewModal;

import { FormikHelpers, useFormikContext } from "formik";
import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import styled from "styled-components";
import { CreateProposalFormData } from "../pages/CreateProposal";
import { usePollGasFee } from "../hooks/usePollGasfee";
import { useClient } from "../hooks/useClient";
import { CreateProposalParams } from "@xinfin/osx-daofin-sdk-client";
import { TransactionReviewModal } from "../components/Modal";
import {
  useBreakpoint,
  useBreakpointValue,
  useDisclosure,
  useSteps,
} from "@chakra-ui/react";
import { BigNumberish, BigNumber } from "@ethersproject/bignumber";
import { TransactionState } from "../utils/types";
import { decodeAbiParameters, parseEther, zeroAddress } from "viem";
import { ProposalCreationSteps } from "@xinfin/osx-sdk-client";
import useTransactionModalDisclosure from "../hooks/useTransactionModalDisclosure";
import { DefaultAlert } from "../components/Alerts";
import { toEther } from "../utils/numbers";
import {
  GrantActionSchema,
  MetaDataSchema,
} from "../schemas/createProposalSchema";

export type CreateProposalContextType = {
  handlePublishProposal: () => void;
  isOpenPublishModal: boolean;
  handleOpenPublishModal: () => void;
  steps: ReturnType<typeof useSteps>;
  defaultSteps: any[];
  setFormData: Dispatch<SetStateAction<CreateProposalFormData>>;
  handleSubmit: (values: CreateProposalFormData, actions: any) => void;
};

const CreateProposalContext = createContext<CreateProposalContextType | null>(
  null
);

const CreateProposalProvider: FC<PropsWithChildren> = ({ children }) => {
  const defaultSteps = [
    {
      title: "Name Your Proposal",
      description:
        "Give it a title and a description. They can't be changed once going live",
    },
    {
      title: "Specify Actions",
      description:
        "Depends on the proposal type, you'll need to specify the executing actions details ",
    },
    {
      title: "Select voting period",
      description: "Voting period is a fixed duration of 2-week",
    },
    {
      title: "Preview",
      description:
        "Check how your proposal will be seen by everyone once published",
    },
    {
      title: "Cost Review",
      description:
        "To prevent network spam, you'll need to pay X XDC to publish a proposal and a small amount for gas",
    },
    {
      title: "Publish",
      description: "Proposal is submit on chain",
    },
  ];
  const steps = useSteps({
    index: 0,
    count: defaultSteps.length,
  });
  const { goToNext, activeStep } = steps;
  const [proposalCreationData, setProposalCreationData] =
    useState<CreateProposalParams>();

  const [formData, setFormData] = useState<CreateProposalFormData>({
    metaData: {
      title: "",
      summary: "",
      description: "",
      resources: [{ name: "", url: "" }],
    },
    action: { amount: "", recipient: "" },
    selectedElectionPeriod: "0",
  });
  const [schemas, setSchemas] = useState([MetaDataSchema, GrantActionSchema]);
  console.log({ formData });

  const { isOpen, onClose, onOpen } = useTransactionModalDisclosure();

  const handleSubmit = async (
    values: CreateProposalFormData,
    actions: FormikHelpers<CreateProposalFormData>
  ) => {
    console.log("submit");
    if (activeStep === defaultSteps.length - 2) {
      await handleOpenPublishModal();
    } else {
      goToNext();
    }
    setFormData((prev) => ({ ...prev, ...values }));
  };

  // const breakpoint = useBreakpoint();

  // const { values, resetForm } = useFormikContext<CreateProposalFormData>();

  // const { action, metaData, selectedElectionPeriod } = values;

  const { daofinClient } = useClient();

  const [creationProcessState, setCreationProcessState] =
    useState<TransactionState>();

  const [publishedTxData, setPublishedTxData] = useState<{
    hash: string;
    data: {
      goTo: string;
      text: string;
    };
  }>();

  const shouldPoll =
    proposalCreationData !== undefined &&
    creationProcessState === TransactionState.LOADING;

  const estimateCreationFees = useCallback(async () => {
    if (proposalCreationData && daofinClient?.estimation)
      return await daofinClient?.estimation.createProposal(
        proposalCreationData
      );
  }, [daofinClient?.estimation, proposalCreationData]);

  const [proposalCosts, setProposalCosts] = useState<BigNumberish>(0);

  useEffect(() => {
    if (daofinClient && daofinClient.methods) {
      daofinClient?.methods
        .getProposalCosts()
        .then((data) => {
          setProposalCosts(data);
        })
        .catch(console.log);
    }
  }, [daofinClient?.methods]);
  const { stopPolling, txCosts, txFees } = usePollGasFee(
    estimateCreationFees,
    shouldPoll,
    toEther(proposalCosts.toString())
  );

  console.log({ proposalCreationData });
  console.log({ proposalCosts });

  const handlePublishProposal = async () => {
    if (!proposalCreationData) return;
    const proposalIterator =
      daofinClient?.methods.createProposal(proposalCreationData);
    if (!proposalIterator) {
      return;
    }
    setCreationProcessState(TransactionState.WAITING);

    try {
      for await (const step of proposalIterator) {
        switch (step.key) {
          case ProposalCreationSteps.CREATING:
            setPublishedTxData({
              hash: step.txHash,
              data: {
                goTo: "",
                text: "",
              },
            });
            break;
          case ProposalCreationSteps.DONE: {
            setPublishedTxData((prev) => ({
              hash: prev?.hash ? prev.hash : "",
              data: {
                goTo: `/proposals/${step.proposalId.split("_0x")[1]}/details`,
                text: "View my proposal",
              },
            }));

            setCreationProcessState(TransactionState.SUCCESS);
            stopPolling();
            break;
          }
        }
      }
    } catch (error) {
      console.log(error);
      setCreationProcessState(TransactionState.ERROR);
    }
  };

  const handleOpenPublishModal = async () => {
    onOpen(() => {
      setCreationProcessState(TransactionState.LOADING);
    });
    let metadaIpfsHash;

    formData.metaData.resources.map(({ name, url }) => ({
      name,
      url: url.startsWith(`https://`) ? url : `https://${url}`,
    }));
    try {
      metadaIpfsHash = await daofinClient?.methods.pinMetadata(
        formData.metaData
      );
    } catch {
      throw Error("Could not pin metadata on IPFS");
    }
    if (!metadaIpfsHash) return;

    setProposalCreationData({
      metdata: metadaIpfsHash,
      actions: [
        {
          data: new Uint8Array(),
          to: formData.action.recipient,
          value: BigInt(parseEther(formData.action.amount.toString())),
        },
      ],
      proposalType: 0,
      allowFailureMap: 0,
      electionIndex: formData.selectedElectionPeriod,
      voteOption: 0,
    });
  };

  return (
    <CreateProposalContext.Provider
      value={{
        handlePublishProposal: () => {},
        handleOpenPublishModal: () => {},
        isOpenPublishModal: false,
        steps,
        defaultSteps,
        setFormData,
        handleSubmit,
      }}
    >
      {/* {breakpoint === "base" ||
      breakpoint === "xs" ||
      breakpoint === "sm" ||
      breakpoint === "md" ? (
        <>
          <DefaultAlert status="warning" textAlign={"center"}>
            Please use Desktop screen
          </DefaultAlert>
        </>
      ) : ( */}
      <>
        <CreateProposalWrapper>{children}</CreateProposalWrapper>

        {isOpen && (
          <TransactionReviewModal
            isOpen={isOpen}
            onClose={() =>
              onClose(() => {
                stopPolling();
              })
            }
            data={txFees}
            totalCosts={txCosts}
            onSubmitClick={handlePublishProposal}
            status={creationProcessState}
            txData={publishedTxData}
          />
        )}
      </>
      {/* )} */}
    </CreateProposalContext.Provider>
  );
};

const useCreateProposalContext = () => {
  return useContext(CreateProposalContext) as CreateProposalContextType;
};
const CreateProposalWrapper = styled.div.attrs({
  className: "min-h-screen",
})``;

export { CreateProposalProvider, useCreateProposalContext };

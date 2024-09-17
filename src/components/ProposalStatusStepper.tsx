import {
  Box,
  CircularProgress,
  HStack,
  Icon,
  IconButton,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Text,
  VStack,
  useSteps,
} from "@chakra-ui/react";
import React, { FC, useEffect, useMemo, useState } from "react";
import { BlockIcon } from "../utils/assets/icons";
import { dateNow, toDate, toStandardFormatString } from "../utils/date";
import useFetchProposalStatus, {
  FetchProposalStatusType,
} from "../hooks/useFetchProposalStatus";
import { uuid } from "../utils/numbers";
import {
  CloseIcon,
  ExternalLinkIcon,
  QuestionOutlineIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import { ProposalStatus } from "../utils/types";
import {
  IoCloseCircle,
  IoCloseCircleOutline,
  IoCloseOutline,
  IoFlash,
  IoPlay,
  IoRocket,
  IoStop,
  IoTime,
} from "react-icons/io5";
import InfoTooltip from "./Tooltip/InfoTooltip";
import { CHAIN_METADATA, makeBlockScannerHashUrl } from "../utils/networks";
import { useNetwork } from "../contexts/network";
import { useTranslation } from "react-i18next";

interface ProposalStatusStepperProps {
  proposalId: string;
  status: FetchProposalStatusType;
  startDate: number;
  endDate: number;
  createdAt: number;
  creationTxHash: string;
  executionDate: number;
  executionTxHash: string;
}
const ProposalStatusStepper: FC<ProposalStatusStepperProps> = ({
  proposalId,
  status,
  endDate,
  startDate,
  createdAt,
  creationTxHash,
  executionDate,
  executionTxHash,
}) => {
  const { t } = useTranslation();

  const [steps, setSteps] = useState([
    {
      id: uuid(),
      status: ProposalStatus.PUBLISHED,
      title: t("proposalStatus.publish"),
      tooltip: t("proposalStatus.publishTooltip"),
      date: toDate(createdAt),
      indicator: <IoRocket />,
      txHash: creationTxHash,
    },
    {
      id: uuid(),
      status: ProposalStatus.ACTIVE,
      title: t("proposalStatus.startVoting"),
      tooltip: t("proposalStatus.startVotingTooltip"),
      date: toDate(startDate),
      endDate: toDate(endDate),
      indicator: <IoPlay />,
    },
    {
      id: uuid(),
      status: ProposalStatus.ACTIVE,
      title: t("proposalStatus.endVoting"),
      tooltip: t("proposalStatus.endVotingTooltip"),
      date: toDate(endDate),
      endDate: toDate(endDate),
      indicator: <IoStop />,
    },
    {
      id: uuid(),
      status: ProposalStatus.REACHED,
      title: t("proposalStatus.executionDelay"),
      tooltip: t("proposalStatus.executionDelayTooltip"),
      date: toDate(endDate + 10 * 60 * 1000),
      endDate: toDate(endDate),
      indicator: <IoTime />,
    },
    {
      id: uuid(),
      status: ProposalStatus.EXECUTED,
      title: t("proposalStatus.execution"),
      tooltip: t("proposalStatus.executionTooltip"),
      date:
        dateNow().getTime() < executionDate ? toDate(executionDate) : undefined,
      txHash: executionTxHash,
      indicator: <IoFlash />,
    },
    {
      id: uuid(),
      status: ProposalStatus.DEFEATED,
      title: t("proposalStatus.defeated"),
      tooltip: t("proposalStatus.defeatedTooltip"),
      date: undefined,
      indicator: <IoCloseOutline />,
    },
  ]);
  const { network } = useNetwork();
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const pendingStatus = useMemo(
    () => dateNow() > toDate(createdAt) && dateNow() < toDate(startDate),
    [startDate, createdAt]
  );
  const isReachedRequirements = useMemo(
    () =>
      status && status.isMinParticipationReached && status.isThresholdReached,
    [status]
  );

  const running = useMemo(
    () => dateNow() > toDate(startDate) && dateNow() < toDate(endDate),
    [startDate, createdAt]
  );
  const executed = useMemo(() => status && status.executed, [status]);
  const defeated = useMemo(
    () => !running && !pendingStatus && !executed && !isReachedRequirements,
    [pendingStatus, running, executed, isReachedRequirements]
  );
  const ReadyToExecute = useMemo(
    () => !running && !pendingStatus && !executed && isReachedRequirements,
    [pendingStatus, running, executed, isReachedRequirements]
  );

  useEffect(() => {
    if (status) {
      if (pendingStatus) {
        setActiveStep(1);
        setSteps((prev) => [
          ...prev.filter(({ status }) => status !== ProposalStatus.DEFEATED),
        ]);
      }

      if (running) {
        if (Date.now() > startDate) {
          setActiveStep(2);
        } else setActiveStep(1);
        setSteps((prev) => [
          ...prev.filter(({ status }) => status !== ProposalStatus.DEFEATED),
        ]);
      }

      if (isReachedRequirements) {
        setActiveStep(3);
        setSteps((prev) => [
          ...prev.filter(({ status }) => status !== ProposalStatus.DEFEATED),
        ]);
      }
      if (ReadyToExecute) {
        setActiveStep(4);
        setSteps((prev) => [
          ...prev.filter(({ status }) => status !== ProposalStatus.DEFEATED),
        ]);
      }

      if (executed) {
        setActiveStep(steps.length);
        setSteps((prev) => [
          ...prev.filter(({ status }) => status !== ProposalStatus.DEFEATED),
        ]);
      }

      if (defeated) {
        setSteps((prev) => [
          ...prev.filter(
            ({ status }) =>
              status !== (ProposalStatus.EXECUTED || ProposalStatus.REACHED)
          ),
        ]);
      }
    }
  }, [defeated, running, pendingStatus, ReadyToExecute]);

  useEffect(() => {
    if (defeated) {
      setActiveStep(steps.length);
    }
  }, [steps, defeated]);

  const activeProposalIndicator =
    running || executed || !defeated ? (
      <CircularProgress isIndeterminate size={"35px"} />
    ) : (
      <IoCloseCircle color={"red"} size={"100px"} />
    );
  return (
    <>
      <Box p={"5"} fontSize={"lg"} fontWeight={"bold"}>
        <Text>{t("common.proposalstatus")}</Text>
      </Box>
      <Box p={"6"} w={"full"}>
        <Stepper
          index={activeStep}
          orientation="vertical"
          height="250px"
          gap="0"
        >
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>{step.indicator}</StepIndicator>

              <Box flexShrink="0" w={"full"}>
                <StepTitle>
                  <HStack>
                    <Text fontSize={["md"]}>
                      {step.title}{" "}
                      <InfoTooltip label={step.tooltip} placement="right" />
                    </Text>
                    {step.txHash && (
                      <Box w={"0.1"} display={"inline-block"}>
                        <IconButton
                          w={"4"}
                          h={"4"}
                          aria-label=""
                          cursor={"pointer"}
                          onClick={() =>
                            window.open(
                              makeBlockScannerHashUrl(network, step.txHash),
                              "_blank"
                            )
                          }
                          size={"xs"}
                          bgColor="unset"
                          color="unset"
                          as={ExternalLinkIcon}
                        />
                      </Box>
                    )}
                  </HStack>
                </StepTitle>
                <StepDescription>
                  <VStack justifyContent={"start"} alignItems={"start"}>
                    <HStack>
                      {/* <TimeIcon w={"3"} /> */}
                      <Text fontSize={["sm", "sm"]}>
                        {step.date !== undefined && step.date !== null
                          ? toStandardFormatString(step.date)
                          : ""}
                      </Text>
                    </HStack>
                    {/* {step.endDate && (
                      <HStack>
                        <TimeIcon w={"3"} />
                        <Text fontSize={["sm", "md"]}>
                          {step.endDate !== undefined && step.endDate !== null
                            ? toStandardFormatString(step.endDate)
                            : "-"}
                        </Text>
                      </HStack>
                    )} */}
                  </VStack>
                </StepDescription>
              </Box>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>
      </Box>
    </>
  );
};

export default ProposalStatusStepper;

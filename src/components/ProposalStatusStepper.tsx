import {
  Box,
  CircularProgress,
  HStack,
  Icon,
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
import { CloseIcon, QuestionOutlineIcon, TimeIcon } from "@chakra-ui/icons";
import { ProposalStatus } from "../utils/types";
import { IoCloseCircle } from "react-icons/io5";
import InfoTooltip from "./Tooltip/InfoTooltip";

interface ProposalStatusStepperProps {
  proposalId: string;
  status: FetchProposalStatusType;
  startDate: number;
  endDate: number;
  createdAt: number;
}
const ProposalStatusStepper: FC<ProposalStatusStepperProps> = ({
  proposalId,
  status,
  endDate,
  startDate,
  createdAt,
}) => {
  const [steps, setSteps] = useState([
    {
      id: uuid(),
      status: ProposalStatus.PUBLISHED,
      title: "Published",
      tooltip: "Published proposals are submitted on-chain to DAOFIN.",
      date: toDate(createdAt),
    },
    {
      id: uuid(),
      status: ProposalStatus.PENDING,
      title: "Pending",
      tooltip:
        "The proposal has been shared with the community and is now awaiting the start of the voting period.",
      date: dateNow(),
    },
    {
      id: uuid(),
      status: ProposalStatus.ACTIVE,
      title: "Running",
      tooltip:
        "The proposal is currently in the voting phase. Community members are actively casting their votes.",
      date: toDate(startDate),
      endDate: toDate(endDate),
    },
    // {
    //   id: uuid(),
    //   status: ProposalStatus.EXPIRED,
    //   title: "Closing window",
    //   description: "Date & Time",
    //   date: new Date(endDate),
    // },
    // {
    //   id: uuid(),
    //   status: ProposalStatus.REACHED,
    //   title: "Threshold’s Reached",
    //   description: "",
    //   date: null,
    // },

    {
      id: uuid(),
      status: ProposalStatus.EXECUTED,
      title: "Executed",
      tooltip:
        "The proposal has been approved and successfully implemented within the DAOFIN ecosystem.",
      date: undefined,
    },
    {
      id: uuid(),
      status: ProposalStatus.DEFEATED,
      title: "Defeated",
      tooltip: "The proposal has not been approved by the DAOFIN ecosystem.",
      date: undefined,
    },
  ]);

  const { activeStep, setActiveStep, goToNext } = useSteps({
    index: 0,
    count: steps.length,
  });

  const pendingStatus = useMemo(
    () => dateNow() > toDate(createdAt) && dateNow() < toDate(startDate),
    [startDate, createdAt]
  );
  const didNotReachedRequirements = useMemo(
    () => status && status.canExecute,
    [status]
  );

  const running = useMemo(() => status && status.isOpen, [status]);
  const executed = useMemo(() => status && status.executed, [status]);
  const defeated = useMemo(
    () =>
      !running && !pendingStatus && (!executed || !status.isThresholdReached),
    [status, pendingStatus, running, executed]
  );

  useEffect(() => {
    if (status) {
      console.log({ pendingStatus, running, executed, defeated });

      if (pendingStatus) {
        setActiveStep(1);
      }

      if (running) {
        setActiveStep(2);
      }

      if (executed) {
        setActiveStep(steps.length);
      }
      if (defeated) {
        setSteps((prev) => [
          ...prev.filter(({ status }) => status !== ProposalStatus.EXECUTED),
        ]);
      }
    }
  }, [status, defeated, running, pendingStatus]);

  useEffect(() => {
    if (defeated) {
      setActiveStep(steps.length - 1);
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
        <Text>Proposal Status</Text>
      </Box>
      <Box p={"6"} w={"full"}>
        <Stepper
          index={activeStep}
          orientation="vertical"
          height="400px"
          gap="0"
        >
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={activeProposalIndicator}
                />
              </StepIndicator>

              <Box flexShrink="0" w={"full"}>
                <StepTitle>
                  <Text fontSize={["md"]}>
                    {step.title}{" "}
                    <InfoTooltip label={step.tooltip} placement="right" />
                  </Text>
                </StepTitle>
                <StepDescription>
                  <VStack justifyContent={"start"} alignItems={"start"}>
                    <HStack>
                      {/* <TimeIcon w={"3"} /> */}
                      <Text fontSize={["sm", "md"]}>
                        {step.date !== undefined && step.date !== null
                          ? toStandardFormatString(step.date)
                          : "-"}
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

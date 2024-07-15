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
      title: "Publish",
      tooltip: "Published proposals are submitted on-chain to DAOFIN.",
      date: toDate(createdAt),
      indicator: <IoRocket />,
    },
    // {
    //   id: uuid(),
    //   status: ProposalStatus.PENDING,
    //   title: "On-Hold",
    //   tooltip:
    //     "The proposal has been shared with the community and is now awaiting the start of the voting period.",
    //   date: undefined, //dateNow(),
    // },
    {
      id: uuid(),
      status: ProposalStatus.ACTIVE,
      title: "Start of Voting Period ",
      tooltip:
        "The proposal is currently in the voting phase. Community members are actively casting their votes.",
      date: toDate(startDate),
      endDate: toDate(endDate),
      indicator: <IoPlay />,
    },
    {
      id: uuid(),
      status: ProposalStatus.ACTIVE,
      title: "End of Voting Period",
      tooltip:
        "The proposal is currently in the voting phase. Community members are actively casting their votes.",
      date: toDate(endDate),
      endDate: toDate(endDate),
      indicator: <IoStop />,
    },
    {
      id: uuid(),
      status: ProposalStatus.REACHED,
      title: "On-chain execution delay",
      tooltip:
        "The proposal is currently in the voting phase. Community members are actively casting their votes.",
      date: toDate(endDate + 10 * 60 * 1000),
      endDate: toDate(endDate),
      indicator: <IoTime />,
    },
    {
      id: uuid(),
      status: ProposalStatus.EXECUTED,
      title: "Execution",
      tooltip:
        "The proposal has been approved and successfully implemented within the XDCDAO ecosystem.",
      date: undefined,
      indicator: <IoFlash />,
    },
    {
      id: uuid(),
      status: ProposalStatus.DEFEATED,
      title: "Defeated",
      tooltip: "The proposal has not been approved by the XDCDAO ecosystem.",
      date: undefined,
      indicator: <IoCloseOutline />,
    },
  ]);

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
    () => dateNow() < toDate(startDate) && dateNow() < toDate(endDate),
    [startDate, createdAt]
  );
  const executed = useMemo(() => status && status.executed, [status]);
  const defeated = useMemo(
    () =>
      !running &&
      !pendingStatus &&
      !executed &&
      !isReachedRequirements,
    [pendingStatus, running, executed, isReachedRequirements]
  );
  console.log({ status, defeated });
  console.log({ pendingStatus, running, executed, isReachedRequirements });

  useEffect(() => {
    if (status) {
      if (pendingStatus) {
        setActiveStep(1);
        setSteps((prev) => [
          ...prev.filter(({ status }) => status !== ProposalStatus.DEFEATED),
        ]);
      }

      if (running) {
        setActiveStep(2);
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

      if (executed) {
        setActiveStep(steps.length);
        setSteps((prev) => [
          ...prev.filter(({ status }) => status !== ProposalStatus.DEFEATED),
        ]);
      }

      if (defeated) {
        setSteps((prev) => [
          ...prev
            .filter(({ status }) => status !== ProposalStatus.EXECUTED)
            .filter(({ status }) => status !== ProposalStatus.REACHED),
        ]);
      }
    }
  }, [defeated, running, pendingStatus]);

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
        <Text>Proposal Status</Text>
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
              <StepIndicator>
                {step.indicator}
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

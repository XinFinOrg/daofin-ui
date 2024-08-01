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
  useBreakpoint,
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
import { DefaultBox } from "./Box";

interface ProposalSessionStepperProps {
  startDate: number;
  endDate: number;
}
const ProposalSessionStepper: FC<ProposalSessionStepperProps> = ({
  endDate,
  startDate,
}) => {
  const [steps, setSteps] = useState([
    {
      id: uuid(),
      status: ProposalStatus.ACTIVE,
      title: "Start of Voting Period",
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
      tooltip: "Shows the end of voting period of this proposal.",
      date: toDate(endDate),
      endDate: toDate(endDate),
      indicator: <IoStop />,
    },
    {
      id: uuid(),
      status: ProposalStatus.QUEUED,
      title: "On-chain Execution Delay",
      tooltip:
        "Meets the voting requirements, Queued for the on-chain execution.",
      endDate: undefined,
      date: toDate(endDate + 10 * 60 * 1000),
      indicator: (
        <Box position={"relative"}>
          <Box
            zIndex={99}
            position={"absolute"}
            style={{
              top: "40%",
              left: "20%",
            }}
          >
            <IoFlash size={"20px"} color="orange" />
          </Box>
          <Box zIndex={98}>
            <IoTime />
          </Box>
        </Box>
      ),
    },
    {
      id: uuid(),
      status: ProposalStatus.READY_TO_EXECUTE,
      title: "Start of Execution Period",
      tooltip:
        "Meets the voting requirements, Queued for the on-chain execution.",
      date: toDate(endDate + 60 * 10 * 1000),
      endDate: undefined,
      indicator: (
        <Box position={"relative"}>
          <Box
            zIndex={99}
            position={"absolute"}
            style={{
              top: "40%",
              left: "20%",
            }}
          >
            <IoFlash size={"20px"} color="orange" />
          </Box>
          <Box zIndex={98}>
            <IoPlay />
          </Box>
        </Box>
      ),
    },
    {
      id: uuid(),
      status: ProposalStatus.READY_TO_EXECUTE,
      title: "End of Execution Period",
      tooltip:
        "Meets the voting requirements, Queued for the on-chain execution.",
      endDate: undefined,
      date: toDate(endDate + 60 * 60 * 24 * 1000),
      indicator: (
        <Box position={"relative"}>
          <Box
            zIndex={99}
            position={"absolute"}
            style={{
              top: "40%",
              left: "20%",
            }}
          >
            <IoFlash size={"20px"} color="orange" />
          </Box>
          <Box zIndex={98}>
            <IoStop />
          </Box>
        </Box>
      ),
    },
  ]);
  const { network } = useNetwork();
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });
  const now = new Date(Date.now() + 1000 * 60 * 60 * 24 * 10);
  const pendingStatus = useMemo(
    () => now < toDate(startDate) && now < toDate(endDate),
    [startDate, endDate]
  );
  const votingRunning = useMemo(
    () => now > toDate(startDate) && now < toDate(endDate),
    [startDate, endDate]
  );
  const queued = useMemo(
    () => now > toDate(endDate) && now < toDate(endDate + 1000 * 60 * 10),
    [startDate, endDate]
  );
  const executionStarted = useMemo(
    () =>
      now > toDate(endDate + 1000 * 60 * 10) &&
      now < toDate(endDate + 1000 * 60 * 60 * 24),
    [startDate, endDate]
  );
  const executionEnded = useMemo(
    () => now > toDate(endDate + 1000 * 60 * 60 * 24),
    [startDate, endDate]
  );

  useEffect(() => {
    if (pendingStatus) {
      setActiveStep(0);
    }
    if (votingRunning) {
      setActiveStep(1);
    }
    if (queued) {
      setActiveStep(2);
    }
    if (executionStarted) {
      setActiveStep(3);
    }
    if (executionEnded) {
      setActiveStep(5);
    }
  }, [pendingStatus, votingRunning, executionEnded, executionStarted, queued]);
  const breakpoint = useBreakpoint();
  return (
    <DefaultBox
      w={"full"}
      p={1}
      display={breakpoint === "xl" || breakpoint === "lg" ? "block" : "none"}
      >
      <Box p={"6"} w={"full"}>
        Current:
        <Stepper
          index={activeStep}
          orientation={"horizontal"}
          gap="0"
          showLastSeparator
        >
          {steps.map((step, index) => (
            <Step key={index}>
              <StepSeparator />
              <StepIndicator>{step.indicator}</StepIndicator>

              <StepDescription>
                <VStack justifyContent={"start"} alignItems={"start"}>
                  <HStack>
                    {/* <TimeIcon w={"3"} /> */}
                    {/* <Text fontSize={["sm", "sm"]}>
                      {step.date !== undefined && step.date !== null
                        ? toStandardFormatString(step.date)
                        : ""}
                    </Text> */}
                  </HStack>
                </VStack>
              </StepDescription>
            </Step>
          ))}
        </Stepper>
      </Box>
    </DefaultBox>
  );
};

export default ProposalSessionStepper;

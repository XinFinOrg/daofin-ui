import {
  Box,
  HStack,
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
  useSteps,
} from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { BlockIcon } from "../utils/assets/icons";
import { toStandardFormatString } from "../utils/date";
import useFetchProposalStatus, {
  FetchProposalStatusType,
} from "../hooks/useFetchProposalStatus";
import { uuid } from "../utils/numbers";
import { TimeIcon } from "@chakra-ui/icons";
import { ProposalStatus } from "../utils/types";

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
      title: "Proposal published onchain",
      description: "Contact Info",
      date: new Date(createdAt),
    },
    {
      id: uuid(),
      status: ProposalStatus.NOT_STARTED,
      title: "Voting not started yet",
      description: "Contact Info",
      date: new Date(),
    },
    {
      id: uuid(),
      status: ProposalStatus.ACTIVE,
      title: "Open to vote",
      description: "Date & Time",
      date: new Date(startDate),
    },
    {
      id: uuid(),
      status: ProposalStatus.EXPIRED,
      title: "Closing vote",
      description: "Date & Time",
      date: new Date(endDate),
    },
    {
      id: uuid(),
      status: ProposalStatus.REACHED,
      title: "Threshold’s Reached",
      description: "Select Rooms",
      date: null,
    },
    {
      id: uuid(),
      status: ProposalStatus.EXECUTED,
      title: "Proposal’s executed",
      description: "Select Rooms",
      date: undefined,
    },
  ]);

  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });
  useEffect(() => {
    if (status) {
      if (status.isOpen) {
        setActiveStep(3);
      }
      if (!status.isOpen && Date.now() > endDate) {
        setActiveStep(4);
      }
      if (status.canExecute) {
        setActiveStep(5);
      }
      if (status.executed) {
        setActiveStep(6);
      }

      if (!status.executed && !status.canExecute && !status.isOpen) {
      }
    }
  }, [status]);

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
                  complete={<StepNumber />}
                  incomplete={<StepNumber />}
                  // active={<StepNumber />}
                />
              </StepIndicator>

              <Box flexShrink="0" w={"full"}>
                <StepTitle>
                  <Text fontSize={["md"]}>{step.title}</Text>
                </StepTitle>
                <StepDescription>
                  <HStack justifyContent={"start"}>
                    <TimeIcon w={"3"} />
                    <Text fontSize={["sm", "md"]}>
                      {step.date !== undefined && step.date !== null
                        ? toStandardFormatString(step.date)
                        : "-"}
                    </Text>
                  </HStack>
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

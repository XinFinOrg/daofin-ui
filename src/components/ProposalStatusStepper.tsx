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
      title: "Proposal published onchain",
      description: "Contact Info",
      date: new Date(createdAt),
    },
    {
      id: uuid(),
      title: "Open to vote",
      description: "Date & Time",
      date: new Date(startDate),
    },
    {
      id: uuid(),
      title: "Closing vote",
      description: "Date & Time",
      date: new Date(endDate),
    },
    {
      id: uuid(),
      title: "Threshold’s Reached",
      description: "Select Rooms",
      date: null,
    },
    {
      id: uuid(),
      title: "Proposal’s executed",
      description: "Select Rooms",
      date: null,
    },
  ]);

  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });
  useEffect(() => {
    if (status) {
      if (status.isOpen) {
        setActiveStep(2);
      }
      if (!status.isOpen && Date.now() > endDate) {
        setActiveStep(3);
      }
      if (status.canExecute) {
        setActiveStep(4);
      }
      if (status.executed) {
        setActiveStep(5);
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
          height="300px"
          gap="0"
        >
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>

              <Box flexShrink="0" w={"full"}>
                <StepTitle>
                  <Text fontSize={["md", "lg"]}>{step.title}</Text>
                </StepTitle>
                <StepDescription>
                  <HStack justifyContent={"start"}>
                    <TimeIcon w={"3"} />
                    <Text fontSize={["sm", "md"]}>
                      {step.date ? toStandardFormatString(step.date) : "-"}
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

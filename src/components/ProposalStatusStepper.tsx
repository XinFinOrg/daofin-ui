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
import React, { useState } from "react";
import { BlockIcon } from "../utils/assets/icons";

interface ProposalStatusStepperProps {}
const ProposalStatusStepper = () => {
  const [steps, setSteps] = useState([
    { title: "Proposal published onchain", description: "Contact Info" },
    { title: "Open to vote", description: "Date & Time" },
    { title: "Threshold’s Reached", description: "Select Rooms" },
    { title: "Proposal’s executed", description: "Select Rooms" },
  ]);
  const { activeStep } = useSteps({
    index: 1,
    count: steps.length,
  });
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
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>
                  <HStack justifyContent={"start"}>
                    <BlockIcon w={"5"} h={"5"} />
                    <Text>{new Date().toISOString()}</Text>
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

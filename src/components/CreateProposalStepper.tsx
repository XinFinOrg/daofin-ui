import {
  Box,
  Container,
  Divider,
  Flex,
  Spacer,
  Stack,
  Text,
  Grid,
  GridItem,
  SimpleGrid,
} from "@chakra-ui/layout";
import React, { ChangeEvent, FC, useState } from "react";
import CreateMetaData from "./CreateMetaData";
import { Button } from "@chakra-ui/button";
import { styled } from "styled-components";
import {
  Card,
  CardBody,
  CardHeader,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Heading,
  StackDivider,
  CardFooter,
  Badge,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
type CreateProposalStepperProps = {
  proposalType?: Number;
  handleOnChange: (
    e: ChangeEvent<HTMLDivElement | HTMLTextAreaElement>
  ) => void;
  handleSubmitProposal: (data: any) => void;
};

const CreateProposalStepperWrapper = styled.div.attrs({
  className: "max-w-full",
})``;
const CreateProposalStepper: FC<CreateProposalStepperProps> = ({
  handleOnChange,
  handleSubmitProposal,
}) => {
  // const goToNext = () => {
  //   setStep((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
  //   setProgress((prev) => prev + 50);
  // };
  // const goToPrevious = () => {
  //   setStep((prev) => ({ ...prev, currentStep: prev.currentStep - 1 }));
  //   setProgress((prev) => prev - 50);
  // };
  const grantsSteps = [
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
  const { activeStep, goToNext, goToPrevious } = useSteps({
    index: 1,
    count: grantsSteps.length,
  });
  return (
    <>
      <CreateProposalStepperWrapper className="mt-4 px-4">
        <Grid
          templateColumns={"repeat(12, 1fr)"}
          templateRows={"repeat(1, 1fr)"}
          w={"full"}
          gap="2"
        >
          <GridItem colSpan={3} colStart={3}>
            <Stepper
              index={activeStep}
              colorScheme="blue"
              orientation="vertical"
              gap="0"
              height={"md"}
            >
              {grantsSteps.map((step, index) => (
                <Step key={index}>
                  <StepIndicator>
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>

                  <Box flexShrink="0" maxWidth={"full"}>
                    <StepTitle>{step.title}</StepTitle>
                    <StepDescription className="max-w-xs	">
                      {step.description}
                    </StepDescription>
                  </Box>
                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
          </GridItem>
          <GridItem colSpan={5} colStart={7}>
            <Card shadow={"2xl"}>
              <CardHeader>
                <Badge mb={"4"}>GRANT</Badge>
                <Heading size="md">New Proposal</Heading>
              </CardHeader>

              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  <CreateMetaData handleOnChange={handleOnChange}/>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Summary
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      View a summary of all your clients over the last month.
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Overview
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      Check out the overview of your clients.
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Analysis
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      See a detailed analysis of all your business clients.
                    </Text>
                  </Box>
                </Stack>
              </CardBody>
              <CardFooter justifyContent={"end"}>
                <Button
                  isDisabled={activeStep === 0}
                  onClick={() => goToPrevious()}
                >
                  Previous
                </Button>
                <Button
                  isDisabled={activeStep === grantsSteps.length}
                  onClick={() => goToNext()}
                  colorScheme={"blue"}
                  mx={1}
                >
                  Proceed
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </Grid>
      </CreateProposalStepperWrapper>
    </>
  );
};

export default CreateProposalStepper;

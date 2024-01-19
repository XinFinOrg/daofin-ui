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
  useDisclosure,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import GrantsProposalTypeForm from "../actions/forms/GrantsProposalTypeForm";
import ElectionPeriodsForm from "./ElectionPeriodsForm";
import useDaoElectionPeriods from "../../hooks/useDaoElectionPeriods";
import Preview from "./ProposalPreview";
import { CommunityIcon } from "../../utils/assets/icons";
import ProposalCosts from "./ProposalCosts";
import { TransactionReviewModal } from "../Modal";
import { useFormikContext } from "formik";
import { CreateProposalFormData } from "../../pages/CreateProposal";
import { useClient } from "../../hooks/useClient";
import { BigNumber } from "@ethersproject/bignumber";
import { GasFeeEstimation } from "@xinfin/osx-client-common";
import { useCreateProposalContext } from "../../contexts/CreateProposalContext";
import { TransactionState } from "../../utils/types";
import { DefaultBox } from "../Box";
type CreateProposalStepperProps = {
  proposalType?: Number;
};

const CreateProposalStepperWrapper = styled.div.attrs({
  className: "max-w-full",
})``;
const CreateProposalStepper: FC<CreateProposalStepperProps> = ({}) => {
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
    index: 0,
    count: grantsSteps.length,
  });
  const [gasEstimationData, setGasEstimationData] =
    useState<GasFeeEstimation>();
  const lastStep = grantsSteps.length - 2;
  const periods = useDaoElectionPeriods();

  const { values, submitForm, validateField, errors } =
    useFormikContext<CreateProposalFormData>();
  const { daofinClient } = useClient();
  const { handleOpenPublishModal } = useCreateProposalContext();

  const handleProceedButton = () => {
    if (activeStep === lastStep) {
      handleOpenPublishModal();
    } else {
      goToNext();
    }
  };

  const isDisabledProceedButton =
    activeStep === grantsSteps.length || Object.keys(errors).length !== 0;
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
              position={"fixed"}
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
                      {/* {step.description} */}
                    </StepDescription>
                  </Box>
                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
          </GridItem>
          <GridItem colSpan={5} colStart={7}>
            <Card shadow={"2xl"}>
              <DefaultBox p={0}>
                <CardHeader>
                  <Badge mb={"4"}>GRANT</Badge>
                  <Heading size="md">{grantsSteps[activeStep].title}</Heading>
                </CardHeader>

                <CardBody>
                  <Stack divider={<StackDivider />} spacing="4">
                    {activeStep === 0 && <CreateMetaData />}
                    {activeStep === 1 && <GrantsProposalTypeForm />}
                    {activeStep === 2 && periods && (
                      <ElectionPeriodsForm periods={periods} />
                    )}
                    {activeStep === 3 && <Preview />}
                    {activeStep === 4 && <ProposalCosts />}
                  </Stack>
                </CardBody>
                <CardFooter justifyContent={"space-between"}>
                  <Button
                    isDisabled={activeStep === 0}
                    onClick={() => goToPrevious()}
                    variant={"unstyled"}
                  >
                    {"<-"} Back
                  </Button>

                  <Button
                    isDisabled={isDisabledProceedButton}
                    onClick={handleProceedButton}
                    colorScheme={"blue"}
                    mx={1}
                  >
                    Proceed
                  </Button>
                </CardFooter>
              </DefaultBox>
            </Card>
          </GridItem>
        </Grid>
      </CreateProposalStepperWrapper>
    </>
  );
};

export default CreateProposalStepper;

import { Box, Flex, Stack } from "@chakra-ui/layout";
import React, { ChangeEvent, FC, useEffect, useState } from "react";
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
import useDaoElectionPeriods, {
  useDaoNotStartedElectionPeriods,
} from "../../hooks/useDaoElectionPeriods";
import { useClient } from "../../hooks/useClient";
import { GasFeeEstimation } from "@xinfin/osx-client-common";
import { useCreateProposalContext } from "../../contexts/CreateProposalContext";
import { DefaultBox } from "../Box";
import {
  CreationFormSchema,
  GrantActionSchema,
  MetaDataSchema,
} from "../../schemas/createProposalSchema";
import { Form, Formik, FormikProps } from "formik";
import { CreateProposalFormData } from "../../pages/CreateProposal";
import { DefaultButton } from "../Button";
import { GrantsProposalTypeForm } from "../actions";
import ElectionPeriodsForm from "./ElectionPeriodsForm";
import ProposalPreview from "./ProposalPreview";
import ProposalCosts from "./ProposalCosts";
import {
  PROPOSAL_TYPES,
  findProposalTypeById,
  proposalTypeNameToProposalId,
} from "../../utils/constants";
import ProposalAction from "../actions/forms/ProposalAction";
import { useWallet } from "../../hooks/useWallet";
type CreateProposalStepperProps = {
  proposalTypeId: string | undefined;
};

const CreateProposalStepperWrapper = styled.div.attrs({
  className: "max-w-full",
})``;

const CreateProposalStepper: FC<CreateProposalStepperProps> = ({
  proposalTypeId,
}) => {
  const [gasEstimationData, setGasEstimationData] =
    useState<GasFeeEstimation>();

  const { steps, defaultSteps, setFormData, handleSubmit } =
    useCreateProposalContext();
  const { activeStep, goToPrevious, goToNext } = steps;
  const [proposalTypeIdState, setProposalTypeIdState] = useState("");
  const lastStep = defaultSteps.length - 2;
  const { data: periods, isActive: isActivePeriods } =
    useDaoNotStartedElectionPeriods();

  const { daofinClient } = useClient();
  useEffect(() => {
    if (proposalTypeIdState == "" && proposalTypeId) {
      setProposalTypeIdState(proposalTypeNameToProposalId(proposalTypeId));
      setFormData((prev) => ({
        ...prev,
        proposalTypeId: proposalTypeNameToProposalId(proposalTypeId),
      }));
    }
  }, [proposalTypeId]);
  const getCurrentGrantSchema = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return CreationFormSchema.pick(["metaData"]);
      case 1:
        return CreationFormSchema.pick(["action"]);
      default:
        return undefined;
    }
  };
  const getCurrentDecisionMakingSchema = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return CreationFormSchema.pick(["metaData"]);
      default:
        return undefined;
    }
  };
  const getCurrentSchema = (activeStep: number) => {
    if (proposalTypeIdState === "0") return getCurrentGrantSchema(activeStep);
    if (proposalTypeIdState === "1")
      return getCurrentDecisionMakingSchema(activeStep);
  };

  return (
    <>
      <Formik
        key={"my-form-1"}
        initialValues={{
          metaData: {
            title: "",
            summary: "",
            description: "",
            resources: [
              { name: "XDCDAO Forum", url: "" },
              { name: "XDC.Dev", url: "" },
            ],
          },
          action: { amount: "", recipient: "" },
          selectedElectionPeriod: "0",
          proposalTypeId: proposalTypeId
            ? proposalTypeNameToProposalId(proposalTypeId)
            : "-1",
        }}
        validationSchema={getCurrentSchema(activeStep)}
        validateOnChange={true}
        onSubmit={handleSubmit}
      >
        {({
          submitForm,
          errors,
          touched,
        }: FormikProps<CreateProposalFormData>) => (
          <Form>
            <CreateProposalStepperWrapper className="mt-4 px-4">
              <Flex>
                <Box w={["40%", "40%", "40%", "40%", "40%"]}>
                  <Flex
                    flexDirection={"column"}
                    alignItems={"center"}
                    pos={"relative"}
                  >
                    <Stepper
                      position={"initial"}
                      index={activeStep}
                      colorScheme="blue"
                      orientation="vertical"
                      gap="0"
                      height={"md"}
                    >
                      {defaultSteps.map((step, index) => (
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
                  </Flex>
                </Box>
                <Box w={["40%", "40%", "60%"]}>
                  <Card shadow={"2xl"}>
                    <DefaultBox p={0}>
                      <CardHeader>
                        <Badge mb={"4"}>
                          {proposalTypeIdState &&
                            findProposalTypeById(proposalTypeIdState)?.name}
                        </Badge>
                        <Heading size="md">
                          {defaultSteps[activeStep].title}
                        </Heading>
                      </CardHeader>

                      <CardBody>
                        <Stack divider={<StackDivider />} spacing="4">
                          {activeStep === 0 && <CreateMetaData />}
                          {activeStep === 1 && (
                            <ProposalAction
                              proposalTypeId={proposalTypeIdState}
                            />
                          )}
                          {activeStep === 2 && (
                            <ElectionPeriodsForm
                              periods={periods ? periods : []}
                            />
                          )}
                          {activeStep === 3 && <ProposalPreview />}
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

                        <DefaultButton
                          isDisabled={
                            !(Object.keys(touched).length > 0) ||
                            Object.keys(errors).length > 0
                          }
                          onClick={() => {
                            submitForm();
                            window.scrollTo(0, 0);
                          }}
                          colorScheme="blue"
                          mx={1}
                        >
                          Proceed
                        </DefaultButton>
                      </CardFooter>
                    </DefaultBox>
                  </Card>
                </Box>
              </Flex>
            </CreateProposalStepperWrapper>
          </Form>
        )}
      </Formik>
    </>
  );
};
export default CreateProposalStepper;
